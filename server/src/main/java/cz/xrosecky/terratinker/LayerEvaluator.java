package cz.xrosecky.terratinker;

import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.StaticInfo;
import cz.xrosecky.terratinker.nodes.AbstractForkNode;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class LayerEvaluator {
    private final Program program;

    public LayerEvaluator(Program program) {
        this.program = program;
    }

    public void evaluate(StaticInfo staticInfo) {
        AbstractNode startNode = program.getFlowTail();
        evaluateForTree(startNode, new EvaluationState(staticInfo));
    }

    private void evaluateForTree(AbstractNode startNode, EvaluationState tree) {
        AbstractNode fork = startNode.evaluate(program, tree);
        if (fork != null) {
            evaluateFork(startNode, tree, fork);
        }
    }

    private void evaluateFork(AbstractNode startNode, EvaluationState tree, AbstractNode fork) {
        EvaluationState treeCopy = tree.cloneTree();

        AbstractForkNode forkNode = (AbstractForkNode) fork;

        while (forkNode.evaluateNext(program, treeCopy)) {
            evaluateForTree(startNode, treeCopy);
            treeCopy = tree.cloneTree();
        }
    }
}
