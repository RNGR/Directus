import type { Accountability, Filter } from '@directus/types';
import type { AccessRow } from '../modules/process-ast/types.js';
import { filterPoliciesByIp } from '../utils/filter-policies-by-ip.js';
import { withCache } from '../utils/with-cache.js';
import type { Context } from '../types.js';

export const fetchPolicies = withCache('policies', _fetchPolicies, ({ roles, user, ip }) => ({ roles, user, ip }));

/**
 * Fetch the policies associated with the current user accountability
 */
export async function _fetchPolicies(
	{ roles, user, ip }: Pick<Accountability, 'user' | 'roles' | 'ip'>,
	context: Context,
): Promise<string[]> {
	const { AccessService } = await import('../../services/access.js');
	const accessService = new AccessService(context);

	let roleFilter: Filter;

	if (roles.length === 0) {
		// Users without role assumes the Public role permissions along with their attached policies
		roleFilter = { _and: [{ role: { _null: true } }, { user: { _null: true } }] };
	} else {
		roleFilter = { role: { _in: roles } };
	}

	// If the user is not null, we also want to include the policies attached to the user
	const filter = user ? { _or: [{ user: { _eq: user } }, roleFilter] } : roleFilter;

	const accessRows = (await accessService.readByQuery({
		filter,
		fields: ['policy.id', 'policy.ip_access'],
		// Proritize policies attached to users
		sort: [{ field: 'user', nulls: 'last' }, 'sort'],
		limit: -1,
	})) as AccessRow[];

	const filteredAccessRows = filterPoliciesByIp(accessRows, ip);
	const ids = filteredAccessRows.map(({ policy }) => policy.id);

	return ids;
}
