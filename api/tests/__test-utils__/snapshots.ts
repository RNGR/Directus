import { Snapshot, SnapshotField } from '../../src/types';

export const testSnapshotBefore: Snapshot = {
	version: 1,
	directus: '0.0.0',
	collections: [
		{
			collection: 'test_table',
			meta: {
				accountability: 'all',
				collection: 'test_table',
				group: null,
				hidden: true,
				icon: 'import_export',
				item_duplication_fields: null,
				note: null,
				singleton: false,
				translations: {},
			},
			schema: {
				comment: null,
				name: 'test_table',
				schema: 'public',
			},
		},
	],
	fields: [
		{
			collection: 'test_table',
			field: 'id',
			meta: {
				collection: 'test_table',
				conditions: null,
				display: null,
				display_options: null,
				field: 'id',
				group: null,
				hidden: true,
				interface: null,
				note: null,
				options: null,
				readonly: false,
				required: false,
				sort: null,
				special: null,
				translations: {},
				validation: null,
				validation_message: null,
				width: 'full',
			},
			schema: {
				comment: null,
				data_type: 'uuid',
				default_value: null,
				foreign_key_column: null,
				foreign_key_schema: null,
				foreign_key_table: null,
				generation_expression: null,
				has_auto_increment: false,
				is_generated: false,
				is_nullable: false,
				is_primary_key: true,
				is_unique: true,
				max_length: null,
				name: 'id',
				numeric_precision: null,
				numeric_scale: null,
				schema: 'public',
				table: 'test_table',
			},
			type: 'uuid',
		} as SnapshotField,
	],
	relations: [],
};

export const testSnapshotToApply: Snapshot = {
	version: 1,
	directus: '0.0.0',
	collections: [
		{
			collection: 'test_table',
			meta: {
				accountability: 'all',
				collection: 'test_table',
				group: null,
				hidden: true,
				icon: 'import_export',
				item_duplication_fields: null,
				note: null,
				singleton: false,
				translations: {},
			},
			schema: {
				comment: null,
				name: 'test_table',
				schema: 'public',
			},
		},
		{
			collection: 'test_table_2',
			meta: {
				accountability: 'all',
				collection: 'test_table_2',
				group: 'test_table',
				hidden: true,
				icon: 'import_export',
				item_duplication_fields: null,
				note: null,
				singleton: false,
				translations: {},
			},
			schema: {
				comment: null,
				name: 'test_table_2',
				schema: 'public',
			},
		},
		{
			collection: 'test_table_3',
			meta: {
				accountability: 'all',
				collection: 'test_table_3',
				group: 'test_table_2',
				hidden: true,
				icon: 'import_export',
				item_duplication_fields: null,
				note: null,
				singleton: false,
				translations: {},
			},
			schema: {
				comment: null,
				name: 'test_table_3',
				schema: 'public',
			},
		},
	],
	fields: [
		{
			collection: 'test_table',
			field: 'id',
			meta: {
				collection: 'test_table',
				conditions: null,
				display: null,
				display_options: null,
				field: 'id',
				group: null,
				hidden: true,
				interface: null,
				note: null,
				options: null,
				readonly: false,
				required: false,
				sort: null,
				special: null,
				translations: {},
				validation: null,
				validation_message: null,
				width: 'full',
			},
			schema: {
				comment: null,
				data_type: 'uuid',
				default_value: null,
				foreign_key_column: null,
				foreign_key_schema: null,
				foreign_key_table: null,
				generation_expression: null,
				has_auto_increment: false,
				is_generated: false,
				is_nullable: false,
				is_primary_key: true,
				is_unique: true,
				max_length: null,
				name: 'id',
				numeric_precision: null,
				numeric_scale: null,
				schema: 'public',
				table: 'test_table',
			},
			type: 'uuid',
		} as SnapshotField,
		{
			collection: 'test_table_2',
			field: 'id',
			meta: {
				collection: 'test_table_2',
				conditions: null,
				display: null,
				display_options: null,
				field: 'id',
				group: null,
				hidden: true,
				interface: null,
				note: null,
				options: null,
				readonly: false,
				required: false,
				sort: null,
				special: null,
				translations: {},
				validation: null,
				validation_message: null,
				width: 'full',
			},
			schema: {
				comment: null,
				data_type: 'uuid',
				default_value: null,
				foreign_key_column: null,
				foreign_key_schema: null,
				foreign_key_table: null,
				generation_expression: null,
				has_auto_increment: false,
				is_generated: false,
				is_nullable: false,
				is_primary_key: true,
				is_unique: true,
				max_length: null,
				name: 'id',
				numeric_precision: null,
				numeric_scale: null,
				schema: 'public',
				table: 'test_table_2',
			},
			type: 'uuid',
		} as SnapshotField,
		{
			collection: 'test_table_3',
			field: 'id',
			meta: {
				collection: 'test_table_3',
				conditions: null,
				display: null,
				display_options: null,
				field: 'id',
				group: null,
				hidden: true,
				interface: null,
				note: null,
				options: null,
				readonly: false,
				required: false,
				sort: null,
				special: null,
				translations: {},
				validation: null,
				validation_message: null,
				width: 'full',
			},
			schema: {
				comment: null,
				data_type: 'uuid',
				default_value: null,
				foreign_key_column: null,
				foreign_key_schema: null,
				foreign_key_table: null,
				generation_expression: null,
				has_auto_increment: false,
				is_generated: false,
				is_nullable: false,
				is_primary_key: true,
				is_unique: true,
				max_length: null,
				name: 'id',
				numeric_precision: null,
				numeric_scale: null,
				schema: 'public',
				table: 'test_table_3',
			},
			type: 'uuid',
		} as SnapshotField,
	],
	relations: [],
};

export const testSnapshotToApplyNotNested: Snapshot = {
	version: 1,
	directus: '0.0.0',
	collections: [
		{
			collection: 'test_table',
			meta: {
				accountability: 'all',
				collection: 'test_table',
				group: null,
				hidden: true,
				icon: 'import_export',
				item_duplication_fields: null,
				note: null,
				singleton: false,
				translations: {},
			},
			schema: {
				comment: null,
				name: 'test_table',
				schema: 'public',
			},
		},
		{
			collection: 'test_table_2',
			meta: {
				accountability: 'all',
				collection: 'test_table_2',
				group: null,
				hidden: true,
				icon: 'import_export',
				item_duplication_fields: null,
				note: null,
				singleton: false,
				translations: {},
			},
			schema: {
				comment: null,
				name: 'test_table_2',
				schema: 'public',
			},
		},
	],
	fields: [
		{
			collection: 'test_table',
			field: 'id',
			meta: {
				collection: 'test_table',
				conditions: null,
				display: null,
				display_options: null,
				field: 'id',
				group: null,
				hidden: true,
				interface: null,
				note: null,
				options: null,
				readonly: false,
				required: false,
				sort: null,
				special: null,
				translations: {},
				validation: null,
				validation_message: null,
				width: 'full',
			},
			schema: {
				comment: null,
				data_type: 'uuid',
				default_value: null,
				foreign_key_column: null,
				foreign_key_schema: null,
				foreign_key_table: null,
				generation_expression: null,
				has_auto_increment: false,
				is_generated: false,
				is_nullable: false,
				is_primary_key: true,
				is_unique: true,
				max_length: null,
				name: 'id',
				numeric_precision: null,
				numeric_scale: null,
				schema: 'public',
				table: 'test_table',
			},
			type: 'uuid',
		} as SnapshotField,
		{
			collection: 'test_table_2',
			field: 'id',
			meta: {
				collection: 'test_table_2',
				conditions: null,
				display: null,
				display_options: null,
				field: 'id',
				group: null,
				hidden: true,
				interface: null,
				note: null,
				options: null,
				readonly: false,
				required: false,
				sort: null,
				special: null,
				translations: {},
				validation: null,
				validation_message: null,
				width: 'full',
			},
			schema: {
				comment: null,
				data_type: 'uuid',
				default_value: null,
				foreign_key_column: null,
				foreign_key_schema: null,
				foreign_key_table: null,
				generation_expression: null,
				has_auto_increment: false,
				is_generated: false,
				is_nullable: false,
				is_primary_key: true,
				is_unique: true,
				max_length: null,
				name: 'id',
				numeric_precision: null,
				numeric_scale: null,
				schema: 'public',
				table: 'test_table_2',
			},
			type: 'uuid',
		} as SnapshotField,
	],
	relations: [],
};
