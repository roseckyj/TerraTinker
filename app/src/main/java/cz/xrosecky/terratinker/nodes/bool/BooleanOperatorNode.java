package cz.xrosecky.terratinker.nodes.bool;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.BooleanType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class BooleanOperatorNode extends AbstractNode {

    private enum Operator {
        AND("AND"),
        OR("OR"),
        XOR("XOR"),
        NAND("NAND"),
        NOR("NOR"),
        XNOR("XNOR"),

        INVALID("");

        private static final Map<String, Operator> BY_SERIALIZED = new HashMap<>();

        static {
            for (Operator e : values()) {
                BY_SERIALIZED.put(e.serialized, e);
            }
        }

        private final String serialized;

        private Operator(String serialized) {
            this.serialized = serialized;
        }

        public String getSerialized() {
            return serialized;
        }

        public static Operator fromSerialized(String serialized) {
            return BY_SERIALIZED.getOrDefault(serialized, INVALID);
        }
    }

    private final Operator operator;

    public BooleanOperatorNode(String id, JSONObject json) {
        super(id, json);

        String operator = json.getJSONObject("nodeData").getString("operator");
        this.operator = Operator.fromSerialized(operator);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Boolean a = inputs.get("a").getBooleanValue();
            Boolean b = inputs.get("b").getBooleanValue();

            if (a == null || b == null) {
                output.addValue("output", new NullType());
                return;
            }

            boolean result = switch (operator) {
                case AND -> a && b;
                case OR -> a || b;
                case XOR -> a ^ b;
                case NAND -> !(a && b);
                case NOR -> !(a || b);
                case XNOR -> a == b;
                default -> throw new RuntimeException("Invalid operator");
            };

            output.addValue("output", new BooleanType(result));
        });
    }
}
