package cz.xrosecky.terratinker.geometry;

import java.util.List;


public class Ring {
    public enum RingType {
        INNER,
        OUTER
    }

    public final List<Vector2D> points;
    public final RingType type;

    public Ring(List<Vector2D> points, RingType type) {
        this.points = points;
        this.type = type;
    }
}
