import { registerOperator } from './operator-register';

export default registerOperator({
	operator: '_icontains',
	apply: ({ query, selectionRaw, compareValue }) => {
		query.where(selectionRaw, 'ilike', `%${compareValue}%`);
	},
});
