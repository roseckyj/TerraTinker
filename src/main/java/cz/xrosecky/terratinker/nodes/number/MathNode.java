package cz.xrosecky.terratinker.nodes.number;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluationTree.EvaluationTree;
import cz.xrosecky.terratinker.evaluationTree.outputType.FloatType;
import cz.xrosecky.terratinker.evaluationTree.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class MathNode extends AbstractNode {

    private enum Operator {
        ADD("add"),
        SUBTRACT("subtract"),
        MULTIPLY("multiply"),
        DIVIDE("divide"),
        MODULO("modulo"),
        POWER("power"),
        MIN("min"),
        MAX("max"),

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

    public MathNode(String id, JSONObject json) {
        super(id, json);

        String operator = json.getJSONObject("nodeData").getString("operator");
        this.operator = Operator.fromSerialized(operator);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationTree tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Float a = inputs.get("a").getFloatValue();
            Float b = inputs.get("b").getFloatValue();

            if (a == null || b == null) {
                output.addValue("output", new NullType());
                return;
            }

            float result = switch (operator) {
                case ADD -> a + b;
                case SUBTRACT -> a - b;
                case MULTIPLY -> a * b;
                case DIVIDE -> a / b;
                case MODULO -> a % b;
                case POWER -> (float) Math.pow(a, b);
                case MIN -> Math.min(a, b);
                case MAX -> Math.max(a, b);
                default -> throw new RuntimeException("Invalid operator");
            };

            output.addValue("output", new FloatType(result));
        });
    }
}
