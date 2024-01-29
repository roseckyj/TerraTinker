# Force Not Null node

This node does not modify the input value. It only shows the output as not null. This can be useful for visually indicating, that a value is not null.

Warning! This node **does not remove null values**. It only shows the output as not null in the web interface. It does not modify the generator functionality in any way.

<Node>
    {
        "type": "forceNotNull",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

## Example

<NodeGraph>
    {"name":"Force not null","id":"f5e9854c-2041-4eef-89da-2af35721be5e","config":{"join":"cartesian"},"flow":{"nodes":["88bc77cb-f37e-4030-a568-035c9d3e39a4"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[43.92881703482658,257.21397421889253],"inputs":{"geometry":{"kind":"link","node":"db7c89d2-b024-4c9c-800b-0300ef96528d","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"88bc77cb-f37e-4030-a568-035c9d3e39a4":{"type":"setBlock","location":[608.609244419828,519.7294112692304],"inputs":{"material":{"kind":"value","type":"material","value":"grass_block"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"link","node":"f664f2be-87ea-4e5c-b897-b7a26c806f0d","output":"output"},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"db7c89d2-b024-4c9c-800b-0300ef96528d":{"type":"esriLoader","location":[-558.5597363628748,598.0148418717093],"inputs":{"path":{"kind":"link","node":"52c15593-46b1-4599-8361-6012874da8b0","output":"path"}},"nodeData":{"attributes":[{"type":"float","path":"height"}]}},"52c15593-46b1-4599-8361-6012874da8b0":{"type":"localFile","location":[-900.5653789219282,635.4679093565624],"inputs":{},"nodeData":{"fileId":null}},"f664f2be-87ea-4e5c-b897-b7a26c806f0d":{"type":"forceNotNull","location":[120.08220865623969,719.8487800115101],"inputs":{"input":{"kind":"link","node":"db7c89d2-b024-4c9c-800b-0300ef96528d","output":"height"}},"nodeData":{"inputType":"float"}},"c697d142-2ea9-40e0-95cc-3c1275bfcc45":{"type":"comment","location":[16.04088755892633,895.7621507111091],"inputs":{},"nodeData":{"content":"We know for sure, that every geometry contains information about the height so we can enforce a solid line here."}}}}
</NodeGraph>
