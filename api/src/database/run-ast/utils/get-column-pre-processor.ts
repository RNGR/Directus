import type { Filter, SchemaOverview } from '@directus/types';
import type { Knex } from 'knex';
import type { FieldNode, FunctionFieldNode, M2ONode } from '../../../types/ast.js';
import type { AliasMap } from '../../../utils/get-column-path.js';
import { getColumn } from '../../../utils/get-column.js';
import { parseFilterKey } from '../../../utils/parse-filter-key.js';
import { getHelpers } from '../../helpers/index.js';
import { applyCaseWhen } from './apply-case-when.js';
import { getNodeAlias } from './get-field-alias.js';

interface NodePreProcessOptions {
	/** Don't assign an alias to the column but instead return the column as is */
	noAlias?: boolean;
}

export function getColumnPreprocessor(
	knex: Knex,
	schema: SchemaOverview,
	table: string,
	cases: Filter[],
	aliasMap: AliasMap,
) {
	const helpers = getHelpers(knex);

	return function (
		fieldNode: FieldNode | FunctionFieldNode | M2ONode,
		options?: NodePreProcessOptions,
	): Knex.Raw<string> {
		// Don't assign an alias to the column expression if the field has a whenCase
		// (since the alias will be assigned in applyCaseWhen) or if the noAlias option is set
		const hasWhenCase = fieldNode.whenCase && fieldNode.whenCase.length > 0;
		const noAlias = options?.noAlias || hasWhenCase;
		const alias = getNodeAlias(fieldNode);

		const rawColumnAlias = noAlias ? false : alias;

		let field;

		if (fieldNode.type === 'field' || fieldNode.type === 'functionField') {
			const { fieldName } = parseFilterKey(fieldNode.name);
			field = schema.collections[table]!.fields[fieldName];
		} else {
			field = schema.collections[fieldNode.relation.collection]!.fields[fieldNode.relation.field];
		}

		let column = getColumn(knex, table, fieldNode.name, rawColumnAlias, schema);

		if (field?.type?.startsWith('geometry')) {
			column = helpers.st.asText(table, field.field, rawColumnAlias);
		}

		if (fieldNode.type === 'functionField') {
			column = getColumn(knex, table, fieldNode.name, rawColumnAlias, schema, {
				query: fieldNode.query,
			});
		}

		if (hasWhenCase) {
			const columnCases: Filter[] = [];

			for (const index of fieldNode.whenCase) {
				columnCases.push(cases[index]!);
			}

			column = applyCaseWhen(
				{
					column,
					columnCases,
					aliasMap,
					cases,
					table,
					alias,
				},
				{ knex, schema },
			);
		}

		return column;
	};
}
