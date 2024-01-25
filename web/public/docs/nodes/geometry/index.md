# Rasterize node

Rasterize node is a [fork node](/nodes/fork) that converts a region into a rasterized image. This is useful for creating a heightmap from a region.

<Node>
    {"type":"rasterize","location":[101.09402530118129,493.759663596912],"inputs":{"geometry":{"kind":"link","node":"90bd18ec-f076-4cdb-9dc1-3d0867fff304","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}}
</Node>

## Inputs

-   `Geometry`: Geometry to rasterize.
-   `Fill`: Whether to fill the geometry.
-   `Stroke Weight`:\*\* Stroke weight. If 0, no stroke will be drawn.
-   `Point Size`:\*\* Point size. If 0, no points will be drawn.
-   `Clip to region`:\*\* Whether to clip the rasterized image to the selected region and ignore blocks outside.
-   `Ignore`: Whether to ignore the node.

## Outputs

`X` and `Z` coordinates of each pixel in the rasterized image.

## Example

<NodeGraph>
    {"name":"Clear region","id":"9560d48c-dfda-4b8a-b6e8-310a001e5161","config":{"join":"cartesian"},"flow":{"nodes":["b22900fb-e63a-4f18-8e49-2313c0b5578c"],"startLocation":[616.7805565485858,398.00927050782695]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[101.09402530118129,493.759663596912],"inputs":{"geometry":{"kind":"link","node":"90bd18ec-f076-4cdb-9dc1-3d0867fff304","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"90bd18ec-f076-4cdb-9dc1-3d0867fff304":{"type":"selectedRegion","location":[-360.2393080321519,494.4263302635787],"inputs":{},"nodeData":{}},"360ca912-c957-49c0-a21d-c2887390055e":{"type":"highestBlockAt","location":[351.676841610853,769.6017151134293],"inputs":{"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"}},"nodeData":{}},"b22900fb-e63a-4f18-8e49-2313c0b5578c":{"type":"fill","location":[615.4916279951392,474.0667540193376],"inputs":{"material":{"kind":"value","type":"material","value":"air"},"minX":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"maxX":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"minY":{"kind":"link","node":"ca16f017-d3b6-4dbe-aba7-c64c01a4b4b6","output":"minY"},"maxY":{"kind":"link","node":"360ca912-c957-49c0-a21d-c2887390055e","output":"y"},"minZ":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"maxZ":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"ca16f017-d3b6-4dbe-aba7-c64c01a4b4b6":{"type":"worldInfo","location":[356.3568673877095,304.1991517482469],"inputs":{},"nodeData":{}}}}
</NodeGraph>