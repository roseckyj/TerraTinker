# Region selection

The region selection tab is used to define the transformation from the real world to the Minecraft coordinate system and define the parameters of the Minecraft map.

## Map area

The map is used to visualize the selected region of a real-world map. The marker depicts the center of the region (will correspond to [0, 0] in the minecraft world). The marker can be freely dragged around the map or moved to different location with the button next to Map center (see bellow). The blue are represents the selected region. The dashed smaller area is the area of a preview, that can be generated on the [Preview tab](/preview).

The map area has a search bar that can be used to search for a location. The search bar supports searching for addresses, coordinates and landmarks.

## Sidebar

The sidebar contains the following controls:

### Map center

The real world coordinates corresponding to the center of the Minecraft map.

This button next to the input toggles selection by clicking on the map.

### Minimum altitude

The minimum real-world altitude of the selected region. This is required to correctly convert the real-world altitude to the Minecraft altitude.

The button next to the input tries to guess the altitude from the selected region. This does not have to be correct, so make sure to double-check the value.

### Minecraft map size

The size of the Minecraft map in blocks.

### Horizontal and vertical scale

The horizontal and vertical scale of the Minecraft map. The horizontal scale is used to convert the real-world coordinates to the Minecraft coordinates. The vertical scale is used to convert the real-world height to the Minecraft height.
