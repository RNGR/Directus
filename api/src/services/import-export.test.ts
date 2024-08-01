import { expect, test } from 'vitest';
import { getAllFieldNames } from './import-export.js';
import type { FieldNode, FunctionFieldNode, NestedCollectionNode } from '../types/ast.js';

test('getAllFieldNames', () => {
	const parsedFields: (NestedCollectionNode | FieldNode | FunctionFieldNode)[] = [
		{
			type: 'field',
			name: 'id',
			fieldKey: 'id',
			whenCase: [],
		},
		{
			type: 'field',
			name: 'title',
			fieldKey: 'title',
			whenCase: [],
		},
		{
			type: 'm2o',
			name: 'authors',
			fieldKey: 'author',
			parentKey: 'id',
			relatedKey: 'id',
			relation: {
				collection: 'articles',
				field: 'author',
				related_collection: 'authors',
				schema: {
					constraint_name: 'articles_author_foreign',
					table: 'articles',
					column: 'author',
					foreign_key_schema: 'public',
					foreign_key_table: 'authors',
					foreign_key_column: 'id',
					on_update: 'NO ACTION',
					on_delete: 'SET NULL',
				},
				meta: {
					id: 1,
					many_collection: 'articles',
					many_field: 'author',
					one_collection: 'authors',
					one_field: null,
					one_collection_field: null,
					one_allowed_collections: null,
					junction_field: null,
					sort_field: null,
					one_deselect_action: 'nullify',
				},
			},
			query: {},
			children: [
				{
					type: 'field',
					name: 'id',
					fieldKey: 'id',
					whenCase: [],
				},
				{
					type: 'field',
					name: 'first_name',
					fieldKey: 'first_name',
					whenCase: [],
				},
				{
					type: 'field',
					name: 'last_name',
					fieldKey: 'last_name',
					whenCase: [],
				},
				{
					type: 'm2o',
					name: 'addresses',
					fieldKey: 'address',
					parentKey: 'id',
					relatedKey: 'id',
					relation: {
						collection: 'addresses',
						field: 'address',
						related_collection: 'authors',
						schema: {
							constraint_name: 'articles_author_foreign',
							table: 'articles',
							column: 'author',
							foreign_key_schema: 'public',
							foreign_key_table: 'authors',
							foreign_key_column: 'id',
							on_update: 'NO ACTION',
							on_delete: 'SET NULL',
						},
						meta: {
							id: 1,
							many_collection: 'articles',
							many_field: 'author',
							one_collection: 'authors',
							one_field: null,
							one_collection_field: null,
							one_allowed_collections: null,
							junction_field: null,
							sort_field: null,
							one_deselect_action: 'nullify',
						},
					},
					query: {},
					children: [
						{
							type: 'field',
							name: 'id',
							fieldKey: 'id',
							whenCase: [],
						},
						{
							type: 'field',
							name: 'street',
							fieldKey: 'street',
							whenCase: [],
						},
						{
							type: 'field',
							name: 'city',
							fieldKey: 'city',
							whenCase: [],
						},
					],
					cases: [],
					whenCase: [],
				},
			],
			cases: [],
			whenCase: [],
		},
	];

	const res = getAllFieldNames(parsedFields);

	expect(res).toEqual([
		'id',
		'title',
		'author.id',
		'author.first_name',
		'author.last_name',
		'author.address.id',
		'author.address.street',
		'author.address.city',
	]);
});
