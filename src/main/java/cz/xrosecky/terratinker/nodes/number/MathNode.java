package cz.xrosecky.terratinker.nodes.number;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
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
        ROUND("round"),
        FLOOR("floor"),
        CEIL("ceil"),
        ABS("abs"),
        SIN("sin"),
        COS("cos"),
        TAN("tan"),
        ASIN("asin"),
        ACOS("acos"),
        ATAN("atan"),
        ATAN2("atan2"),
        LOG("log"),
        EXP("exp"),
        SQRT("sqrt"),

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
    public AbstractNode evaluate(Program program, EvaluationState tree) {
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
                case ROUND -> Math.round(a);
                case FLOOR -> (float) Math.floor(a);
                case CEIL -> (float) Math.ceil(a);
                case ABS -> Math.abs(a);
                case SIN -> (float) Math.sin(a);
                case COS -> (float) Math.cos(a);
                case TAN -> (float) Math.tan(a);
                case ASIN -> (float) Math.asin(a);
                case ACOS -> (float) Math.acos(a);
                case ATAN -> (float) Math.atan(a);
                case ATAN2 -> (float) Math.atan2(a, b);
                case LOG -> (float) Math.log(a);
                case EXP -> (float) Math.exp(a);
                case SQRT -> (float) Math.sqrt(a);
                default -> throw new RuntimeException("Invalid operator");
            };

            output.addValue("output", new FloatType(result));
        });
    }
}
