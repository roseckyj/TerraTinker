package cz.xrosecky.terratinker;

import cz.xrosecky.terratinker.evaluationTree.EvaluationTree;
import cz.xrosecky.terratinker.nodes.AbstractForkNode;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class LayerEvaluator {
    private final Program program;

    public LayerEvaluator(Program program) {
        this.program = program;
    }

    public void evaluate() {
        AbstractNode startNode = program.getFlowTail();
        evaluateForTree(startNode, new EvaluationTree());
    }

    private void evaluateForTree(AbstractNode startNode, EvaluationTree tree) {
        AbstractNode fork = startNode.evaluate(program, tree);
        if (fork != null) {
            evaluateFork(startNode, tree, fork);
        }
    }

    private void evaluateFork(AbstractNode startNode, EvaluationTree tree, AbstractNode fork) {
        EvaluationTree treeCopy = tree.cloneTree();

        AbstractForkNode forkNode = (AbstractForkNode) fork;

        while (forkNode.evaluateNext(program, treeCopy)) {
            evaluateForTree(startNode, treeCopy);
            treeCopy = tree.cloneTree();
        }
    }
}
