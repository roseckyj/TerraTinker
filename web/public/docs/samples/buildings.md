# Buildings

Layer, that creates buildings using OpenStreetMap data.

The buildings are rendered as white boxes, but the material can be changed in the layer settings.
The buildings are placed on terrain provided in a GeoTIFF file.

![Buildings](/docs/samples/buildings.png)

<NodeGraph>
    {"name":"Buildings","id":"81693027-993c-4eb0-86d1-34665ea28833","disabled":false,"config":{"join":"cartesian"},"flow":{"nodes":["f995f38d-6747-4072-b7b1-ff77c233cadc"],"startLocation":[1573.215231514252,-410.72079256677915]},"nodes":{"3ed720e6-fb0e-450d-8395-60aba59ec612":{"type":"rasterize","location":[235.91781429096477,-819.2483093343882],"inputs":{"geometry":{"kind":"link","node":"5b2374c3-4d2e-4640-a284-c09e04e3feb5","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":1},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"09837a2b-6c65-4dd1-8a06-9c3aeb56844c":{"type":"geoTiffLoader","location":[-1056.9329752940055,882.1555159894433],"inputs":{"path":{"kind":"link","node":"80fdbeab-cdeb-4900-b151-840fe4b671e6","output":"path"}},"nodeData":{}},"80fdbeab-cdeb-4900-b151-840fe4b671e6":{"type":"localFile","location":[-1412.1331760053868,855.358159023204],"inputs":{},"nodeData":{"fileId":"6dcfd4fa-1974-44e8-8532-59763c39a94f"}},"5b2374c3-4d2e-4640-a284-c09e04e3feb5":{"type":"osmLoader","location":[-1498.7089449400914,-586.5812482662786],"inputs":{},"nodeData":{"attributes":[{"type":"float","path":"height"},{"type":"float","path":"building:height"},{"type":"float","path":"building:levels"}],"requests":[{"node":false,"way":true,"relation":true,"query":"building"}]}},"8c411b82-7873-49b8-ae23-691dc52876d7":{"type":"aggregateRaster","location":[-822.2568115306238,375.32128661104167],"inputs":{"raster":{"kind":"link","node":"09837a2b-6c65-4dd1-8a06-9c3aeb56844c","output":"raster"},"geometry":{"kind":"link","node":"5b2374c3-4d2e-4640-a284-c09e04e3feb5","output":"geometry"}},"nodeData":{"interpolation":"bilinear"}},"64edba00-7d20-471d-aba6-9eeaea666ae9":{"type":"nullSwitch","location":[-127.33831870635436,-324.60386641677894],"inputs":{"0_case":{"kind":"link","node":"5b2374c3-4d2e-4640-a284-c09e04e3feb5","output":"height"},"1_case":{"kind":"link","node":"5b2374c3-4d2e-4640-a284-c09e04e3feb5","output":"building:height"},"2_case":{"kind":"link","node":"468ffa85-210d-472c-9ef3-e4612316c3e0","output":"output"},"3_case":{"kind":"link","node":"6b1e3433-0ca4-4a3b-acff-80e5fd4448f7","output":"output"}},"nodeData":{"inputType":"float","cases":4}},"468ffa85-210d-472c-9ef3-e4612316c3e0":{"type":"math","location":[-411.05301318818164,-41.44423620078027],"inputs":{"a":{"kind":"link","node":"5b2374c3-4d2e-4640-a284-c09e04e3feb5","output":"building:levels"},"b":{"kind":"value","type":"float","value":3}},"nodeData":{"operator":"multiply"}},"6b1e3433-0ca4-4a3b-acff-80e5fd4448f7":{"type":"randomNumber","location":[-411.58178589577847,-399.4503971402199],"inputs":{"decimal":{"kind":"value","type":"boolean","value":true},"from":{"kind":"value","type":"float","value":3},"to":{"kind":"value","type":"float","value":10},"seed":{"kind":"link","node":"5b2374c3-4d2e-4640-a284-c09e04e3feb5","output":"id"}},"nodeData":{"randomSeed":false}},"aa2e67d7-932e-428d-a850-7946d67f4df8":{"type":"math","location":[663.4381176934185,-87.83309989310791],"inputs":{"a":{"kind":"link","node":"67aa0079-cdb0-40f6-92ea-ad6d8865ff5e","output":"y"},"b":{"kind":"link","node":"83bb42f3-089e-4773-adc0-99b2b8af5ed4","output":"output"}},"nodeData":{"operator":"add"}},"83bb42f3-089e-4773-adc0-99b2b8af5ed4":{"type":"nullSwitch","location":[-445.36054688074967,372.09924443910006],"inputs":{"0_case":{"kind":"link","node":"8c411b82-7873-49b8-ae23-691dc52876d7","output":"minY"},"1_case":{"kind":"value","type":"float","value":0}},"nodeData":{"inputType":"float","cases":2}},"f995f38d-6747-4072-b7b1-ff77c233cadc":{"type":"fill","location":[1576.5114550750154,-330.06578787367704],"inputs":{"material":{"kind":"value","type":"material","value":"white_concrete"},"minX":{"kind":"link","node":"3ed720e6-fb0e-450d-8395-60aba59ec612","output":"x"},"maxX":{"kind":"link","node":"3ed720e6-fb0e-450d-8395-60aba59ec612","output":"x"},"minY":{"kind":"link","node":"2d79d02f-f8a7-476a-8fea-006f6b293955","output":"output"},"maxY":{"kind":"link","node":"aa2e67d7-932e-428d-a850-7946d67f4df8","output":"output"},"minZ":{"kind":"link","node":"3ed720e6-fb0e-450d-8395-60aba59ec612","output":"z"},"maxZ":{"kind":"link","node":"3ed720e6-fb0e-450d-8395-60aba59ec612","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"cad7f7ec-1c70-488c-96e8-52da9f26f2b7":{"type":"sampleRaster","location":[672.0106322400602,398.0200949911347],"inputs":{"raster":{"kind":"link","node":"09837a2b-6c65-4dd1-8a06-9c3aeb56844c","output":"raster"},"x":{"kind":"link","node":"3ed720e6-fb0e-450d-8395-60aba59ec612","output":"x"},"z":{"kind":"link","node":"3ed720e6-fb0e-450d-8395-60aba59ec612","output":"z"}},"nodeData":{"interpolation":"bilinear"}},"94223e42-a0ff-4b95-ba21-699e2e0d2662":{"type":"comment","location":[-238.07909131867112,-488.121765093049],"inputs":{},"nodeData":{"content":"Building height"}},"686187d7-0103-450e-9c45-cfbfa47a72b4":{"type":"comment","location":[-646.0031949115439,282.17868330863945],"inputs":{},"nodeData":{"content":"Building min altitude"}},"afd9ba77-273d-496a-ba42-f20b1b46323e":{"type":"comment","location":[-1143.4730741929993,784.1648350223246],"inputs":{},"nodeData":{"content":"Terrain"}},"1ca0e151-1eee-4c55-85e8-4de7e9996702":{"type":"nullSwitch","location":[925.885083674809,475.48373955359756],"inputs":{"0_case":{"kind":"link","node":"cad7f7ec-1c70-488c-96e8-52da9f26f2b7","output":"y"},"1_case":{"kind":"value","type":"float","value":0}},"nodeData":{"inputType":"float","cases":2}},"974c132a-e4c7-4719-a767-3aefa0a253cd":{"type":"comment","location":[1024.4929028892068,371.9793561066134],"inputs":{},"nodeData":{"content":"Find ground level\n"}},"2d79d02f-f8a7-476a-8fea-006f6b293955":{"type":"math","location":[1198.3250698771528,672.3201216134581],"inputs":{"a":{"kind":"link","node":"1ca0e151-1eee-4c55-85e8-4de7e9996702","output":"output"},"b":{"kind":"value","type":"float","value":1}},"nodeData":{"operator":"add"}},"67aa0079-cdb0-40f6-92ea-ad6d8865ff5e":{"type":"heightToY","location":[255.43297807384397,-78.85983782261269],"inputs":{"height":{"kind":"link","node":"64edba00-7d20-471d-aba6-9eeaea666ae9","output":"output"}},"nodeData":{}}}}
</NodeGraph>