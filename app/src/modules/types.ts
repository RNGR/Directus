import VueI18n from 'vue-i18n';
import { RouteConfig } from 'vue-router';
import { Ref } from '@vue/composition-api';
import { User, Permission } from '@/types';

export interface ModuleConfig {
	id: string;
	name: string;
	hidden?: boolean | Ref<boolean>;
	icon: string;
	routes?: RouteConfig[];
	link?: string;
	color?: string;
	preRegisterCheck?: (user: User, permissions: Permission[]) => boolean;
	order?: number;
	persistent?: boolean;
}

export type ModuleContext = { i18n: VueI18n };

export type ModuleDefineParam = ModuleConfig | ((context: ModuleContext) => ModuleConfig);
