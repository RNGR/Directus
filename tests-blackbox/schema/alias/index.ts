import { getFilterOperatorsForType } from '@directus/shared/utils';
import { ClientFilterOperator } from '@directus/shared/types';
import { FilterValidator } from '@query/filter';
import { GeneratedFilter } from '..';

export const type = 'alias';
export const filterOperatorList = getFilterOperatorsForType(type);

export const generateFilterForDataType = (filter: ClientFilterOperator, _possibleValues: any): GeneratedFilter[] => {
	if (!filterOperatorList.includes(filter)) {
		throw new Error(`Invalid filter operator for ${type}: ${filter}`);
	}

	switch (filter) {
		default:
			throw new Error(`Unimplemented filter operator for ${type}: ${filter}`);
	}
};

export const getValidatorFunction = (filter: ClientFilterOperator): FilterValidator => {
	if (!filterOperatorList.includes(filter)) {
		throw new Error(`Invalid filter operator for ${type}: ${filter}`);
	}

	switch (filter) {
		default:
			throw new Error(`Unimplemented filter operator for ${type}: ${filter}`);
	}
};
