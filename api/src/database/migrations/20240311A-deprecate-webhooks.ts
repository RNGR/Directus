import { randomUUID } from '@directus/random';
import { parseJSON, toArray } from '@directus/utils';
import type { Knex } from 'knex';
import type { Webhook } from '../../types/webhooks.js';

// To avoid typos
const TABLE_WEBHOOKS = 'directus_webhooks',
	TABLE_FLOWS = 'directus_flows',
	TABLE_OPERATIONS = 'directus_operations';

/**
 * 1. Migrate existing webhooks over to identically behaving Flows
 * 2. Disable existing webhooks
 * 3. Dont drop webhooks yet
 */
export async function up(knex: Knex): Promise<void> {
	// 1. Migrate existing webhooks over to identically behaving Flows
	const webhooks: Webhook[] = await knex.select('*').from(TABLE_WEBHOOKS);

	await knex.transaction(async (trx) => {
		for (const webhook of webhooks) {
			const flowId = randomUUID();
			const operationIdRunScript = randomUUID();
			const operationIdWebhook = randomUUID();

			const newFlow = {
				id: flowId,
				name: webhook.name,
				icon: 'webhook',
				// color: null,
				description:
					'Auto-generated by Directus Migration\n\nWebhook were deprecated and have been moved into Flows for you automatically.',
				status: 'active',
				trigger: 'event',
				// accountability: "all",
				options: {
					type: 'action',
					scope: toArray(webhook.actions).map((scope) => `items.${scope}`),
					collections: toArray(webhook.collections),
				},
				operation: null, // Fill this in later --> `operationIdRunScript`
				// date_created: Default Date,
				// user_created: null,
			};

			const operationRunScript = {
				id: operationIdRunScript,
				name: 'Transforming Payload for Webhook',
				key: 'payload-transform',
				type: 'exec',
				position_x: 19,
				position_y: 1,
				options: {
					code: '/**\n * Webhook data slightly differs from Flow trigger data.\n * This flow converts the new Flow format into the older Webhook shape\n * in order to not break existing logic of consumers.\n */ \nmodule.exports = async function(data) {\n    const crudOperation = data.$trigger.event.split(".").at(-1);\n    const keyOrKeys = crudOperation === "create" ? "key" : "keys";\n    return {\n        event: `items.${crudOperation}`,\n        accountability: { user: data.$accountability.user, role: data.$accountability.role },\n        payload: data.$trigger.payload,\n        [keyOrKeys]: data.$trigger?.[keyOrKeys],\n        collection: data.$trigger.collection,\n    };\n}',
				},
				resolve: operationIdWebhook,
				reject: null,
				flow: flowId,
				// date_created: "",
				// user_created: "",
			};

			const operationWebhook = {
				id: operationIdWebhook,
				name: 'Webhook',
				key: 'webhook',
				type: 'request',
				position_x: 37,
				position_y: 1,
				options: {
					url: webhook.url,
					body: webhook.data ? '{{$last}}' : undefined,
					method: webhook.method,
					headers: typeof webhook.headers === 'string' ? parseJSON(webhook.headers) : webhook.headers,
				},
				resolve: null,
				reject: null,
				flow: flowId,
				// date_created: "",
				// user_created: "",
			};

			await trx(TABLE_FLOWS).insert(newFlow);

			// Order is important due to IDs
			await trx(TABLE_OPERATIONS).insert(operationWebhook);
			await trx(TABLE_OPERATIONS).insert(operationRunScript);

			await trx(TABLE_FLOWS).update({ operation: operationIdRunScript }).where({ id: flowId });

			// 2. Disable existing webhooks
			await trx(TABLE_WEBHOOKS).update({ status: 'inactive' });
		}
	});
}

/**
 * Dont drop Webhooks yet.
 */
export async function down(knex: Knex): Promise<void> {
	// DONT DO THIS IN PROD - ONLY OK FOR TESTING NOW
	await knex('directus_webhooks').update({ status: 'active' });
}
