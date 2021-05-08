import api from '@/api';
import { useFieldsStore } from '@/stores/';
import { Relation } from '@/types';
import { defineStore } from 'pinia';

export const useRelationsStore = defineStore({
	id: 'relationsStore',
	state: () => ({
		relations: [] as Relation[],
	}),
	actions: {
		async hydrate() {
			const response = await api.get(`/relations`, { params: { limit: -1 } });
			this.relations = response.data.data;
		},
		async dehydrate() {
			this.reset();
		},
		getRelationsForCollection(collection: string) {
			return this.relations.filter((relation) => {
				return relation.many_collection === collection || relation.one_collection === collection;
			});
		},
		getRelationsForField(collection: string, field: string): Relation[] {
			const fieldsStore = useFieldsStore();
			const fieldInfo = fieldsStore.getField(collection, field);

			if (!fieldInfo) return [];

			const relations: Relation[] = this.getRelationsForCollection(collection).filter((relation: Relation) => {
				return (
					(relation.many_collection === collection && relation.many_field === field) ||
					(relation.one_collection === collection && relation.one_field === field)
				);
			});

			if (relations.length > 0) {
				const isM2M = relations[0].junction_field !== null;

				// If the relation matching the field has a junction field, it's a m2m. In that case,
				// we also want to return the secondary relationship (from the jt to the related)
				// so any ui elements (interfaces) can utilize the full relationship
				if (isM2M) {
					const secondaryRelation = this.relations.find((relation) => {
						return (
							relation.many_collection === relations[0].many_collection &&
							relation.many_field === relations[0].junction_field
						);
					});

					if (secondaryRelation) relations.push(secondaryRelation);
				}
			}

			return relations;
		},
	},
});
