# Layer creation

Every layer is a single [node graph](/layers/node_graph), that transforms input geospatial data into a single Minecraft map. The node graph is a series of operations that are applied to the input data. Read more about the node graph in a [dedicated section](/layers/node_graph).

Layers are evaluated bottom-up, meaning that the bottom-most layer is evaluated first, and the top-most layer is evaluated last. This behavior is similar to how layers are evaluated in a graphics program like Photoshop.
