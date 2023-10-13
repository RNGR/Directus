import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

export const TypeId = {
	Color: 'color',
	Weight: 'weight',
};

const Color = Type.Ref(Type.String({ $id: TypeId.Color }));
// const Weight = Type.Integer({ $id: TypeId.Weight });

const Rules = Type.Object({
	foreground: Color,
	foregroundSubdued: Color,
	foregroundAccent: Color,

	background: Color,
	navigation: Type.Object({
		background: Color,

		project: Type.Object({
			background: Color,
			foreground: Color,
		}),

		modules: Type.Object({
			background: Color,
			button: Type.Object({
				foreground: Color,
				background: Color,
				foregroundHover: Color,
				backgroundHover: Color,
				foregroundActive: Color,
				backgroundActive: Color,
			}),
		}),

		list: Type.Object({
			icon: Color,
			foreground: Color,
			background: Color,
			iconHover: Color,
			foregroundHover: Color,
			backgroundHover: Color,
			iconActive: Color,
			foregroundActive: Color,
			backgroundActive: Color,
		}),
	}),
});

export const ThemeSchema = Type.Object({
	name: Type.String(),
	appearance: Type.Union([Type.Literal('light'), Type.Literal('dark')]),
	fonts: Type.Array(Type.String()),
	rules: Rules,
});

export const Definitions = { $defs: { [TypeId.Color]: Color } };

export type Theme = Static<typeof ThemeSchema>;
