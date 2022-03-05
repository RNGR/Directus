import config, { getUrl } from '../../config';
import vendors from '../../get-dbs-to-test';
import request from 'supertest';
import knex, { Knex } from 'knex';
import { find, cloneDeep } from 'lodash';

type SchemaDateTypesObject = {
	id: number;
	date: string;
	time?: string;
	datetime: string;
	timestamp: string;
};

describe('schema', () => {
	const databases = new Map<string, Knex>();

	const sampleDates: SchemaDateTypesObject[] = [];

	for (let i = 0; i < 24; i++) {
		const hour = i < 10 ? '0' + i : String(i);
		sampleDates.push(
			{
				id: 1 + i * 3,
				date: `2022-01-05`,
				time: `${hour}:11:11`,
				datetime: `2022-01-05T${hour}:11:11`,
				timestamp: `2022-01-05T${hour}:11:11-01:00`,
			},
			{
				id: 2 + i * 3,
				date: `2022-01-10`,
				time: `${hour}:22:22`,
				datetime: `2022-01-10T${hour}:22:22`,
				timestamp: `2022-01-10T${hour}:22:22Z`,
			},
			{
				id: 3 + i * 3,
				date: `2022-01-15`,
				time: `${hour}:33:33`,
				datetime: `2022-01-15T${hour}:33:33`,
				timestamp: `2022-01-15T${hour}:33:33+02:00`,
			}
		);
	}

	beforeAll(async () => {
		for (const vendor of vendors) {
			databases.set(vendor, knex(config.knexConfig[vendor]!));
		}
	});

	afterAll(async () => {
		for (const [_vendor, connection] of databases) {
			await connection.destroy();
		}
	});

	describe('Date Types', () => {
		describe('update datetime field schema', () => {
			it.each(vendors)(
				'%s',
				async (vendor) => {
					await request(getUrl(vendor))
						.patch(`/collections/schema_date_types`)
						.send({
							meta: {},
						})
						.set('Authorization', 'Bearer AdminToken')
						.expect('Content-Type', /application\/json/)
						.expect(200);

					switch (vendor) {
						case 'sqlite3':
							await request(getUrl(vendor))
								.patch(`/fields/schema_date_types/timestamp`)
								.send({
									meta: {
										special: ['cast-timestamp'],
									},
								})
								.set('Authorization', 'Bearer AdminToken')
								.expect('Content-Type', /application\/json/)
								.expect(200);
							break;
						case 'oracle':
							await request(getUrl(vendor))
								.patch(`/fields/schema_date_types/datetime`)
								.send({
									meta: {
										special: ['cast-datetime'],
									},
								})
								.set('Authorization', 'Bearer AdminToken')
								.expect('Content-Type', /application\/json/)
								.expect(200);
							break;
					}
				},
				10000
			);
		});

		describe('stores the correct datetime data', () => {
			it.each(vendors)(
				'%s',
				async (vendor) => {
					const dates = cloneDeep(sampleDates);

					if (vendor === 'oracle') {
						for (const date of dates) {
							delete date.time;
						}
					}

					await request(getUrl(vendor))
						.post(`/items/schema_date_types`)
						.send(dates)
						.set('Authorization', 'Bearer AdminToken')
						.expect('Content-Type', /application\/json/)
						.expect(200);

					const response = await request(getUrl(vendor))
						.get(`/items/schema_date_types?fields=*`)
						.set('Authorization', 'Bearer AdminToken')
						.expect('Content-Type', /application\/json/)
						.expect(200);

					expect(response.body.data.length).toBe(sampleDates.length);

					for (let index = 0; index < sampleDates.length; index++) {
						const responseObj = find(response.body.data, (o) => {
							return o.id === sampleDates[index]!.id;
						}) as SchemaDateTypesObject;

						if (vendor === 'oracle') {
							expect(responseObj.date).toBe(sampleDates[index]!.date);
							expect(responseObj.datetime).toBe(sampleDates[index]!.datetime);
							expect(responseObj.timestamp.substring(0, 19)).toBe(
								new Date(sampleDates[index]!.timestamp).toISOString().substring(0, 19)
							);
							continue;
						}

						expect(responseObj.date).toBe(sampleDates[index]!.date);
						expect(responseObj.time).toBe(sampleDates[index]!.time);
						expect(responseObj.datetime).toBe(sampleDates[index]!.datetime);
						expect(responseObj.timestamp.substring(0, 19)).toBe(
							new Date(sampleDates[index]!.timestamp).toISOString().substring(0, 19)
						);
					}
				},
				10000
			);
		});
	});
});
