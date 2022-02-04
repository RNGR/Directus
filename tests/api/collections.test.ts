import request from 'supertest';
import vendors from '../get-dbs-to-test';
import config, { getUrl } from '../config';
import knex, { Knex } from 'knex';
import { Collection } from '@directus/shared/types';

const TABLES_AFTER_SEED = [
	'artists',
	'artists_events',
	'events',
	'guests',
	'guests_events',
	'organizers',
	'tours',
	'tours_components',
	'directus_activity',
	'directus_collections',
	'directus_dashboards',
	'directus_fields',
	'directus_files',
	'directus_folders',
	'directus_migrations',
	'directus_notifications',
	'directus_panels',
	'directus_permissions',
	'directus_presets',
	'directus_relations',
	'directus_revisions',
	'directus_roles',
	'directus_sessions',
	'directus_settings',
	'directus_shares',
	'directus_users',
	'directus_webhooks',
];

describe('/collections', () => {
	const databases = new Map<string, Knex>();

	beforeAll(() => {
		for (const vendor of vendors) {
			databases.set(vendor, knex(config.knexConfig[vendor]!));
		}
	});

	afterAll(() => {
		for (const [_vendor, connection] of databases) {
			connection.destroy();
		}
	});

	describe.each(vendors)('%s', (vendor) => {
		describe('GET /', () => {
			test('Returns all tables for admin users', async () => {
				const response = await request(getUrl(vendor))
					.get('/collections')
					.set('Authorization', 'Bearer AdminToken')
					.expect(200);

				const responseData = JSON.parse(response.text);
				const tableNames = responseData.data.map((collection: Collection) => collection.collection).sort();

				expect(responseData.data.length).toBe(TABLES_AFTER_SEED.length);
				expect(tableNames).toEqual(TABLES_AFTER_SEED.sort());
			});
		});

		describe('POST /', () => {
			const TEST_DB_NAME = 'test_creation';

			afterEach(async () => {
				const db = databases.get(vendor)!;
				await db.schema.dropTableIfExists(TEST_DB_NAME);
				await db('directus_collections').del().where({ collection: TEST_DB_NAME });
			});

			test('Creates a new regular collection', async () => {
				const db = databases.get(vendor)!;

				const response = await request(getUrl(vendor))
					.post('/collections')
					.send({ collection: TEST_DB_NAME, meta: {}, schema: {} })
					.set('Authorization', 'Bearer AdminToken')
					.expect(200);

				expect(response.body.data.collection).toBe(TEST_DB_NAME);
				expect(response.body.data.schema).toBeNull();
				expect(response.body.data.meta.collection).toBe(TEST_DB_NAME);
				expect(response.body.data.schema.table_name).toBe(TEST_DB_NAME);
				expect(await db.schema.hasTable(TEST_DB_NAME)).toBe(true);
			});

			test('Creates a new folder', async () => {
				const db = databases.get(vendor)!;

				const response = await request(getUrl(vendor))
					.post('/collections')
					.send({ collection: TEST_DB_NAME, meta: {} })
					.set('Authorization', 'Bearer AdminToken')
					.expect(200);

				expect(response.body.data.collection).toBe(TEST_DB_NAME);
				expect(response.body.data.schema).toBeNull();
				expect(response.body.data.meta.collection).toBe(TEST_DB_NAME);
				expect(await db.schema.hasTable(TEST_DB_NAME)).toBe(false);
			});
		});
	});
});
