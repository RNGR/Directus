import request from 'supertest';
import { getUrl } from '@common/config';
import vendors from '@common/get-dbs-to-test';
import * as common from '@common/index';
import { collectionFirst, collectionSecond, seedDBValues } from './conceal-filter.seed';

let isSeeded = false;

beforeAll(async () => {
	isSeeded = await seedDBValues();
}, 300000);

test('Seed Database Values', () => {
	expect(isSeeded).toStrictEqual(true);
});

describe.each(common.PRIMARY_KEY_TYPES)('/items', (pkType) => {
	const localCollectionFirst = `${collectionFirst}_${pkType}`;
	const localCollectionSecond = `${collectionSecond}_${pkType}`;

	describe(`pkType: ${pkType}`, () => {
		describe(`GET /${localCollectionFirst}`, () => {
			describe('retrieves items without filters', () => {
				it.each(vendors)('%s', async (vendor) => {
					// Action
					const response = await request(getUrl(vendor))
						.get(`/items/${localCollectionFirst}`)
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response2 = await request(getUrl(vendor))
						.get(`/items/${localCollectionSecond}`)
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);

					// Assert
					expect(response.statusCode).toEqual(200);
					expect(response.body.data.length).toBe(2);
					expect(response2.statusCode).toEqual(200);
					expect(response2.body.data.length).toBe(2);
				});
			});

			describe('retrieves items with filters (non-relational)', () => {
				it.each(vendors)('%s', async (vendor) => {
					// Action
					const response = await request(getUrl(vendor))
						.get(`/items/${localCollectionFirst}`)
						.query({
							filter: JSON.stringify({ string_field: { _null: true } }),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response2 = await request(getUrl(vendor))
						.get(`/items/${localCollectionFirst}`)
						.query({
							filter: JSON.stringify({ string_field: { _nnull: true } }),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response3 = await request(getUrl(vendor))
						.get(`/items/${localCollectionSecond}`)
						.query({
							filter: JSON.stringify({ string_field: { _null: true } }),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response4 = await request(getUrl(vendor))
						.get(`/items/${localCollectionSecond}`)
						.query({
							filter: JSON.stringify({ string_field: { _nnull: true } }),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);

					// Assert
					expect(response.statusCode).toEqual(200);
					expect(response.body.data.length).toBe(1);
					expect(response2.statusCode).toEqual(200);
					expect(response2.body.data.length).toBe(1);
					expect(response3.statusCode).toEqual(200);
					expect(response3.body.data.length).toBe(1);
					expect(response4.statusCode).toEqual(200);
					expect(response4.body.data.length).toBe(1);
				});
			});

			describe('errors with invalid filters (non-relational)', () => {
				it.each(vendors)('%s', async (vendor) => {
					// Action
					const response = await request(getUrl(vendor))
						.get(`/items/${localCollectionFirst}`)
						.query({
							filter: JSON.stringify({ string_field: { _contains: 'a' } }),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response2 = await request(getUrl(vendor))
						.get(`/items/${localCollectionFirst}`)
						.query({
							filter: JSON.stringify({ string_field: { _eq: 'b' } }),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response3 = await request(getUrl(vendor))
						.get(`/items/${localCollectionSecond}`)
						.query({
							filter: JSON.stringify({ string_field: { _starts_with: 'c' } }),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response4 = await request(getUrl(vendor))
						.get(`/items/${localCollectionSecond}`)
						.query({
							filter: JSON.stringify({ string_field: { _ends_with: 'd' } }),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);

					// Assert
					expect(response.statusCode).toEqual(400);
					expect(response2.statusCode).toEqual(400);
					expect(response3.statusCode).toEqual(400);
					expect(response4.statusCode).toEqual(400);
				});
			});

			describe('retrieves items with filters (relational)', () => {
				it.each(vendors)('%s', async (vendor) => {
					// Action
					const response = await request(getUrl(vendor))
						.get(`/items/${localCollectionFirst}`)
						.query({
							filter: JSON.stringify({
								second_ids: { string_field: { _null: true } },
							}),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response2 = await request(getUrl(vendor))
						.get(`/items/${localCollectionFirst}`)
						.query({
							filter: JSON.stringify({
								second_ids: { string_field: { _null: true } },
							}),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response3 = await request(getUrl(vendor))
						.get(`/items/${localCollectionSecond}`)
						.query({
							filter: JSON.stringify({
								first_id: { string_field: { _null: true } },
							}),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response4 = await request(getUrl(vendor))
						.get(`/items/${localCollectionSecond}`)
						.query({
							filter: JSON.stringify({
								first_id: { string_field: { _null: true } },
							}),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);

					// Assert
					expect(response.statusCode).toEqual(200);
					expect(response.body.data.length).toBe(1);
					expect(response2.statusCode).toEqual(200);
					expect(response2.body.data.length).toBe(1);
					expect(response3.statusCode).toEqual(200);
					expect(response3.body.data.length).toBe(1);
					expect(response4.statusCode).toEqual(200);
					expect(response4.body.data.length).toBe(1);
				});
			});

			describe('errors with invalid filters (relational)', () => {
				it.each(vendors)('%s', async (vendor) => {
					// Action
					const response = await request(getUrl(vendor))
						.get(`/items/${localCollectionFirst}`)
						.query({
							filter: JSON.stringify({
								second_ids: { string_field: { _contains: 'a' } },
							}),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response2 = await request(getUrl(vendor))
						.get(`/items/${localCollectionFirst}`)
						.query({
							filter: JSON.stringify({
								second_ids: { string_field: { _eq: 'b' } },
							}),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response3 = await request(getUrl(vendor))
						.get(`/items/${localCollectionSecond}`)
						.query({
							filter: JSON.stringify({
								first_id: { string_field: { _starts_with: 'c' } },
							}),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);
					const response4 = await request(getUrl(vendor))
						.get(`/items/${localCollectionSecond}`)
						.query({
							filter: JSON.stringify({
								first_id: { string_field: { _ends_with: 'd' } },
							}),
						})
						.set('Authorization', `Bearer ${common.USER.ADMIN.TOKEN}`);

					// Assert
					expect(response.statusCode).toEqual(400);
					expect(response2.statusCode).toEqual(400);
					expect(response3.statusCode).toEqual(400);
					expect(response4.statusCode).toEqual(400);
				});
			});
		});
	});
});
