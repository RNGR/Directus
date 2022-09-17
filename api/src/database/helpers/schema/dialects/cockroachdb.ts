import { KNEX_TYPES } from '@directus/shared/constants';
import { Options, SchemaHelper } from '../types';

export class SchemaHelperCockroachDb extends SchemaHelper {
	async changeToType(
		table: string,
		column: string,
		type: typeof KNEX_TYPES[number],
		options: Options = {}
	): Promise<void> {
		await this.changeToTypeByCopy(table, column, type, options);
	}
}
