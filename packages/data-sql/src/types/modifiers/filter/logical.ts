import type { AbstractSqlQueryNode } from '../../utils.js';
import type { AbstractSqlQueryConditionNode } from './conditions/condition.js';

/**
 * A wrapper to add multiple conditions at once.
 */
export interface AbstractSqlQueryLogicalNode extends AbstractSqlQueryNode {
	type: 'logical';

	/* The logical operator to use to group the conditions. */
	operator: 'and' | 'or';

	/* Specifies of the condition should be negated or not. */
	negate: boolean;

	/* A list of conditions or a nested group with another operator. */
	childNodes: (AbstractSqlQueryConditionNode | AbstractSqlQueryLogicalNode)[];
}
