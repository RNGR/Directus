import type { AbstractQueryNodeCondition } from '@directus/data';
import type { AbstractSqlQuery } from '../types.js';

/**
 * Extracts the filer values and replaces it with parameter indexes.
 *
 * @param filter
 * @param collection
 * @param firstParameterIndex
 * @param secondParameterIndex
 * @returns
 */
export const convertFilter = (
	filter: AbstractQueryNodeCondition,
	collection: string,
	firstParameterIndex: number,
	secondParameterIndex: number | null
): Required<Pick<AbstractSqlQuery, 'where' | 'parameters'>> | null => {
	if (filter === undefined) {
		return null;
	}

	if (filter.target.type !== 'primitive' || filter.compareTo.type !== 'value') {
		throw new Error('Only primitives are currently supported.');
	}

	const parameterIndexes = [firstParameterIndex];

	if (secondParameterIndex !== null) {
		parameterIndexes.push(secondParameterIndex);
	}

	return {
		where: {
			type: 'condition',
			negation: filter.negation,
			operation: filter.operation,
			target: {
				column: filter.target.field,
				table: collection,
				type: 'primitive',
			},
			compareTo: {
				type: 'value',
				parameterIndexes,
			},
		},
		parameters: filter.compareTo.values,
	};
};
