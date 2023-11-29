package cz.xrosecky.terratinker.nodes.number;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluationTree.EvaluationTree;
import cz.xrosecky.terratinker.evaluationTree.outputType.BooleanType;
import cz.xrosecky.terratinker.evaluationTree.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class ComparisonNode extends AbstractNode {

    private enum Operator {
        EQUAL("equal"),
        NOT_EQUAL("not equal"),
        GREATER("greater"),
        LESS("less"),
        GREATER_OR_EQUAL("greater or equal"),
        LESS_OR_EQUAL("less or equal"),

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

    public ComparisonNode(String id, JSONObject json) {
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

            boolean result = switch (operator) {
                case EQUAL -> Objects.equals(a, b);
                case NOT_EQUAL -> !Objects.equals(a, b);
                case GREATER -> a > b;
                case LESS -> a < b;
                case GREATER_OR_EQUAL -> a >= b;
                case LESS_OR_EQUAL -> a <= b;
                default -> throw new RuntimeException("Invalid operator");
            };

            output.addValue("output", new BooleanType(result));
        });
    }
}
