package cz.xrosecky.terratinker.nodes.geometry;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.InputMap;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.geometry.Ring;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.geometry.Vector2DInt;
import cz.xrosecky.terratinker.nodes.AbstractForkNode;
import cz.xrosecky.terratinker.types.Geometry;
import org.json.JSONObject;

import java.awt.*;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Path2D;
import java.awt.image.BufferedImage;
import java.util.HashMap;

public class RasterizeNode extends AbstractForkNode {

    public RasterizeNode(String id, JSONObject json) {
        super(id, json);
    }

    BufferedImage image;
    Graphics2D graphics2D;
    Vector2D minBoundary;
    Vector2D maxBoundary;
    boolean clip;

    int x;
    int y;

    @Override
    public boolean evaluateNext(Program program, EvaluationState tree) {
        return super.forkRoutine(program, tree, (inputs, output) -> {
            if (image == null || minBoundary == null || maxBoundary == null || graphics2D == null) {
                return false;
            }

            Vector2D size = new Vector2D(tree.info().size).scale(0.5f);

            do {
                x++;
                if (x >= image.getWidth()) {
                    x = 0;
                    y++;
                }
            } while (
                    y < image.getHeight() && // While not outside the image
                    (
                        Color.WHITE.getRGB() != image.getRGB(x, y) || // And on a black pixel
                        (clip && ( // Or outside the clip area if the cliping is enabled
                                x + minBoundary.x < -size.x ||
                                x + minBoundary.x > size.x ||
                                y + minBoundary.z < -size.z ||
                                y + minBoundary.z > size.z
                        ))
                    )
            );

            if (y >= image.getHeight()) {
                return false;
            }

            output.addValue("x", new FloatType(x + minBoundary.x));
            output.addValue("z", new FloatType(y + minBoundary.z));
            return true;
        });
    }

    @Override
    public void setup(InputMap inputs, EvaluationState tree) {
        Geometry geometry = inputs.get("geometry").getGeometryValue();
        Boolean fill = inputs.get("fill").getBooleanValue();
        Float strokeWeight = inputs.get("strokeWeight").getFloatValue();
        Float pointSize = inputs.get("pointSize").getFloatValue();
        Boolean ignore = inputs.get("ignore").getBooleanValue();
        Boolean clip = inputs.get("clip").getBooleanValue();

        if (ignore != null && ignore) {
            image = null;
            return;
        }

        if (geometry == null || fill == null || strokeWeight == null || pointSize == null || clip == null) {
            image = null;
            return;
        }

        RasterizeOutput output = rasterize(geometry, fill, strokeWeight, pointSize);

        image = output.image;
        graphics2D = output.graphics2D;

        // TODO: Cliping should be done here
        minBoundary = output.minBoundary;
        maxBoundary = output.maxBoundary;
        this.clip = clip;

//        File f = new File("D:\\" + System.currentTimeMillis() + ".png");
//        try {
//            ImageIO.write(image, "PNG", f);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

        // Reset the iterator
        x = 0;
        y = 0;
    }

    @Override
    public void teardown() {
        if (image != null) {
            image.flush();
        }
        image = null;
        graphics2D = null;
        minBoundary = null;
        maxBoundary = null;
        x = 0;
        y = 0;
    }

    public static RasterizeOutput rasterize(Geometry geometry, Boolean fill, Float strokeWeight, Float pointSize) {
        RasterizeOutput output = new RasterizeOutput();

        Vector2D margin = new Vector2D((int)Math.ceil(Math.max(strokeWeight / 2.0, pointSize / 2.0)) + 2).ceil();
        Vector2D minBoundary = geometry.minBoundary.floor().subtract(margin);
        Vector2D maxBoundary = geometry.maxBoundary.ceil().add(margin);
        Vector2D size = maxBoundary.subtract(minBoundary);

        if (size.x < 0 || size.z < 0) {
            return output;
        }

        BufferedImage image = new BufferedImage((int)size.x, (int)size.z, BufferedImage.TYPE_BYTE_BINARY);

        Graphics2D graphics2D = image.createGraphics();
        graphics2D.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_OFF);
        graphics2D.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL,
                RenderingHints.VALUE_STROKE_PURE);

        for (var ring : geometry.rings) {
            var points = ring.points;
            var type = ring.type;

            if (type == Ring.RingType.OUTER) {
                graphics2D.setColor(Color.WHITE);
            } else {
                graphics2D.setColor(Color.BLACK);
            }
            double[] xPoints = points.stream().mapToDouble((point) -> point.x - minBoundary.x + 0.5).toArray();
            double[] zPoints = points.stream().mapToDouble((point) -> point.z - minBoundary.z + 0.5).toArray();

            Path2D path = new Path2D.Double();
            path.moveTo(xPoints[0], zPoints[0]);
            for (int i = 1; i < points.size(); i++) {
                path.lineTo(xPoints[i], zPoints[i]);
            }

            if (fill) {
                path.closePath();
                graphics2D.fill(path);
                graphics2D.setStroke(new BasicStroke(1));
                graphics2D.draw(path);
            }
            if (strokeWeight > 0) {
                graphics2D.setStroke(new BasicStroke(strokeWeight));
                graphics2D.draw(path);
            }
            if (pointSize > 0) {
                for (var point : points) {
                    int realRadius = (int)Math.floor((pointSize + 1) / 2);
                    Ellipse2D ellipse2D = new Ellipse2D.Double(point.x - minBoundary.x - realRadius + 1, point.z - minBoundary.z - realRadius + 1, realRadius * 2 - 1, realRadius * 2 - 1);
                    graphics2D.fill(ellipse2D);
                }
            }
        }

        output.image = image;
        output.graphics2D = graphics2D;
        output.minBoundary = minBoundary;
        output.maxBoundary = maxBoundary;

        return output;
    }

    public static class RasterizeOutput {
        public BufferedImage image;
        public Graphics2D graphics2D;
        public Vector2D minBoundary;
        public Vector2D maxBoundary;
    }
}
