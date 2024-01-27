# Fork node

Fork nodes are used to split a single input into multiple outputs. They are used to create multiple branches of the execution flow.

## Example

Let's take a look at the following 3 programs:

### Program 1

<NodeGraph>
    {"name":"Seq1","id":"f789ce17-5a01-466a-8ec8-562707069d79","config":{"join":"cartesian"},"flow":{"nodes":["1f7a2912-7f34-4a3f-a750-d626c583001c"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"1f7a2912-7f34-4a3f-a750-d626c583001c":{"type":"log","location":[607.9130008209027,512.2236583674015],"inputs":{"title":{"kind":"value","type":"string","value":""},"a":{"kind":"link","node":"d92f8c47-ba8b-4549-8e59-b6b5e1ffb5e7","output":"output"},"b":{"kind":"value","type":"float","value":0},"c":{"kind":"value","type":"float","value":0},"d":{"kind":"value","type":"float","value":0},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"d92f8c47-ba8b-4549-8e59-b6b5e1ffb5e7":{"type":"constantNumber","location":[-367.1958530557317,566.8822264098138],"inputs":{"input":{"kind":"value","type":"float","value":10}},"nodeData":{}}}}
</NodeGraph>

This simple program logs a single number pair to the output.

There is no fork node, so the whole tree gets evaluated only once.

```text
A: 10.0    B: 0.0
```

### Program 2

<NodeGraph>
    {"name":"Seq2","id":"f789ce17-5a01-466a-8ec8-562707069d79","config":{"join":"cartesian"},"flow":{"nodes":["1f7a2912-7f34-4a3f-a750-d626c583001c"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"1f7a2912-7f34-4a3f-a750-d626c583001c":{"type":"log","location":[607.9130008209027,512.2236583674015],"inputs":{"title":{"kind":"value","type":"string","value":""},"a":{"kind":"link","node":"414771e0-64a1-49ff-a9ff-5ab02dea5e48","output":"number"},"b":{"kind":"value","type":"float","value":0},"c":{"kind":"value","type":"float","value":0},"d":{"kind":"value","type":"float","value":0},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"d92f8c47-ba8b-4549-8e59-b6b5e1ffb5e7":{"type":"constantNumber","location":[-367.1958530557317,566.8822264098138],"inputs":{"input":{"kind":"value","type":"float","value":10}},"nodeData":{}},"414771e0-64a1-49ff-a9ff-5ab02dea5e48":{"type":"sequence","location":[99.22421201388784,546.9247242856425],"inputs":{"from":{"kind":"value","type":"float","value":0},"step":{"kind":"value","type":"float","value":1},"count":{"kind":"link","node":"d92f8c47-ba8b-4549-8e59-b6b5e1ffb5e7","output":"output"}},"nodeData":{}}}}
</NodeGraph>

This program starts to be a little more interesting. We use a sequence node, which (in our case) generates a sequence of 10 numbers from 0 to 9.

The sequence node outputs all of the numbers form the sequence and the right of the graph is then evaluated for each of them.

```text
A: 0.0    B: 0.0
A: 1.0    B: 0.0
A: 2.0    B: 0.0
A: 3.0    B: 0.0
A: 4.0    B: 0.0
A: 5.0    B: 0.0
A: 6.0    B: 0.0
A: 7.0    B: 0.0
A: 8.0    B: 0.0
A: 9.0    B: 0.0
```

### Program 3

<NodeGraph>
    {"name":"Seq3","id":"f789ce17-5a01-466a-8ec8-562707069d79","config":{"join":"cartesian"},"flow":{"nodes":["1f7a2912-7f34-4a3f-a750-d626c583001c"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"1f7a2912-7f34-4a3f-a750-d626c583001c":{"type":"log","location":[607.9130008209027,512.2236583674015],"inputs":{"title":{"kind":"value","type":"string","value":""},"a":{"kind":"link","node":"414771e0-64a1-49ff-a9ff-5ab02dea5e48","output":"number"},"b":{"kind":"link","node":"a6a80f41-b081-4384-8015-714a2cb6cd01","output":"number"},"c":{"kind":"value","type":"float","value":0},"d":{"kind":"value","type":"float","value":0},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"d92f8c47-ba8b-4549-8e59-b6b5e1ffb5e7":{"type":"constantNumber","location":[-367.1958530557317,566.8822264098138],"inputs":{"input":{"kind":"value","type":"float","value":10}},"nodeData":{}},"414771e0-64a1-49ff-a9ff-5ab02dea5e48":{"type":"sequence","location":[-96.59963815730794,435.6143252409628],"inputs":{"from":{"kind":"value","type":"float","value":0},"step":{"kind":"value","type":"float","value":1},"count":{"kind":"link","node":"d92f8c47-ba8b-4549-8e59-b6b5e1ffb5e7","output":"output"}},"nodeData":{}},"a6a80f41-b081-4384-8015-714a2cb6cd01":{"type":"sequence","location":[214.6572184305927,624.2236125111144],"inputs":{"from":{"kind":"value","type":"float","value":0},"step":{"kind":"value","type":"float","value":1},"count":{"kind":"link","node":"414771e0-64a1-49ff-a9ff-5ab02dea5e48","output":"number"}},"nodeData":{}}}}
</NodeGraph>

This program uses the output of the first sequence as an input for the second sequence. Try to think about the output of the program.

For each number A it creates a sequence of numbers B from 0 to A.

```text
A: 0.0    B: 0.0

A: 1.0    B: 0.0
A: 1.0    B: 1.0

A: 2.0    B: 0.0
A: 2.0    B: 1.0
A: 2.0    B: 2.0

A: 3.0    B: 0.0
A: 3.0    B: 1.0
A: 3.0    B: 2.0
A: 3.0    B: 3.0
...
```

## Evaluation problems

The order of fork nodes visited in the program matters. During the evaluation, the evaluator searches for the first fork node and then evaluates the rest of the graph for each of the outputs of the fork node. this can cause repeated evaluation of the same nodes. The most time consuming nodes (such as Rasterization) should be placed such that they are evaluated first.

Such problematic scenario can be following:

<NodeGraph>
    {"name":"Problematic evaluation","id":"7b959ceb-94b2-4cb7-8f47-325bfa8b079d","config":{"join":"cartesian"},"flow":{"nodes":["88bc77cb-f37e-4030-a568-035c9d3e39a4","1a48794b-501a-493c-9d0b-c7a7ca835a41"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[178.3929135266534,421.6140345864716],"inputs":{"geometry":{"kind":"link","node":"8a7a2110-a1d2-4ed9-9ee6-676d91fee14b","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"88bc77cb-f37e-4030-a568-035c9d3e39a4":{"type":"setBlock","location":[608.609244419828,519.7294112692304],"inputs":{"material":{"kind":"value","type":"material","value":"stone_slab"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"value","type":"float","value":0},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"8a7a2110-a1d2-4ed9-9ee6-676d91fee14b":{"type":"osmLoader","location":[-492.61113769242854,368.0231345780905],"inputs":{},"nodeData":{"attributes":[],"requests":[{"node":false,"way":true,"relation":true,"query":"building"}]}},"1a48794b-501a-493c-9d0b-c7a7ca835a41":{"type":"setBlock","location":[610.1863343243054,842.1229823609854],"inputs":{"material":{"kind":"value","type":"material","value":"cobblestone"},"x":{"kind":"link","node":"5a45251a-dc18-4b89-9951-f6bc7466914b","output":"x"},"y":{"kind":"value","type":"float","value":0},"z":{"kind":"link","node":"5a45251a-dc18-4b89-9951-f6bc7466914b","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"5a45251a-dc18-4b89-9951-f6bc7466914b":{"type":"rasterize","location":[177.31256026166227,790.5903902106706],"inputs":{"geometry":{"kind":"link","node":"8a7a2110-a1d2-4ed9-9ee6-676d91fee14b","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":false},"strokeWeight":{"kind":"value","type":"float","value":1},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}}}}
</NodeGraph>

This seems completely reasonable: We fill the inside of each building with stone slabs and then place cobblestone on the outline of each building.

However the bottom rasterization node is evaluated for each pixel of the top rasterization node. This can lead to significant performance issues. It is suggested to split this program into two layers.
