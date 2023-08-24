import { REDACTED_TEXT, getRedactedKeyText } from '@directus/constants';
import { merge } from 'lodash-es';
import { describe, expect, test } from 'vitest';
import { getReplacerFn, redact } from './redact.js';

const input = {
	$trigger: {
		event: 'users.create',
		payload: {
			first_name: 'Example',
			last_name: 'User',
			email: 'user@example.com',
			password: 'secret',
		},
		key: 'eb641950-fffa-4388-8606-aede594ae487',
		collection: 'directus_users',
	},
	exec_fm27u: {
		$trigger: {
			event: 'users.create',
			payload: {
				first_name: 'Example',
				last_name: 'User',
				email: 'user@example.com',
				password: 'secret',
			},
			key: 'eb641950-fffa-4388-8606-aede594ae487',
			collection: 'directus_users',
		},
		$last: {
			event: 'users.create',
			payload: {
				first_name: 'Example',
				last_name: 'User',
				email: 'user@example.com',
				password: 'secret',
			},
			key: 'eb641950-fffa-4388-8606-aede594ae487',
			collection: 'directus_users',
		},
	},
};

test('should not mutate input', () => {
	const result = redact(input, [['$trigger']], REDACTED_TEXT);

	expect(result).not.toBe(input);
});

test('should support single level path', () => {
	const result = redact(input, [['$trigger']], REDACTED_TEXT);

	expect(result).toEqual(
		merge({}, input, {
			$trigger: REDACTED_TEXT,
		})
	);
});

test('should support multi level path', () => {
	const result = redact(input, [['$trigger', 'payload', 'password']], REDACTED_TEXT);

	expect(result).toEqual(
		merge({}, input, {
			$trigger: {
				payload: { password: REDACTED_TEXT },
			},
		})
	);
});

test('should support wildcard path', () => {
	const result = redact(input, [['*', 'payload']], REDACTED_TEXT);

	expect(result).toEqual(
		merge({}, input, {
			$trigger: {
				payload: REDACTED_TEXT,
			},
		})
	);
});

test('should support deep path', () => {
	const result = redact(input, [['**', 'password']], REDACTED_TEXT);

	expect(result).toMatchObject(
		merge({}, input, {
			$trigger: {
				payload: {
					password: REDACTED_TEXT,
				},
			},
			exec_fm27u: {
				$trigger: {
					payload: {
						password: REDACTED_TEXT,
					},
				},
				$last: {
					payload: {
						password: REDACTED_TEXT,
					},
				},
			},
		})
	);
});

test('should support multiple paths', () => {
	const result = redact(
		input,
		[
			['$trigger', 'key'],
			['*', 'payload', 'email'],
			['**', 'password'],
		],
		REDACTED_TEXT
	);

	expect(result).toEqual(
		merge({}, input, {
			$trigger: {
				key: REDACTED_TEXT,
				payload: {
					email: REDACTED_TEXT,
					password: REDACTED_TEXT,
				},
			},
			exec_fm27u: {
				$trigger: {
					payload: {
						password: REDACTED_TEXT,
					},
				},
				$last: {
					payload: {
						password: REDACTED_TEXT,
					},
				},
			},
		})
	);
});

describe('getReplacerFn tests', () => {
	test('Returns parsed error object', () => {
		const errorMessage = 'Error Message';
		const errorCause = 'Error Cause';
		const replacerFn = getReplacerFn(REDACTED_TEXT);
		const result: any = replacerFn('', new Error(errorMessage, { cause: errorCause }));
		expect(result.name).toBe('Error');
		expect(result.message).toBe(errorMessage);
		expect(result.stack).toBeDefined();
		expect(result.cause).toBe(errorCause);
	});

	test('Returns other types as is', () => {
		const values = [
			undefined,
			null,
			0,
			1,
			true,
			false,
			'',
			'abc',
			[],
			['123'],
			{},
			{ abc: '123' },
			() => {
				// empty
			},
		];

		const replacerFn = getReplacerFn(REDACTED_TEXT);

		for (const value of values) {
			expect(replacerFn('', value)).toBe(value);
		}
	});

	test('Correctly parses error object when used with JSON.stringify()', () => {
		const errorMessage = 'Error Message';
		const errorCause = 'Error Cause';

		const baseValue = {
			string: 'abc',
			num: 123,
			bool: true,
			null: null,
		};

		const objWithError = {
			...baseValue,
			error: new Error(errorMessage, { cause: errorCause }),
		};

		const expectedResult = {
			...baseValue,
			error: { name: 'Error', message: errorMessage, cause: errorCause },
		};

		const result = JSON.parse(JSON.stringify(objWithError, getReplacerFn(REDACTED_TEXT)));

		// Stack changes depending on env
		expect(result.error.stack).toBeDefined();
		delete result.error.stack;

		expect(result).toStrictEqual(expectedResult);
	});

	test('Correctly redacts values when used with JSON.stringify()', () => {
		const baseValue = {
			num: 123,
			bool: true,
			null: null,
		};

		const objWithError = {
			...baseValue,
			string: 'A string about errors~~',
			nested: { another_str: 'just bEcaUse of safety 123456' },
			nested_array: [{ str_a: 'cause surely' }, { str_b: 'not an error' }],
			array: ['something', 'no error', 'just because', 'all is good'],
			error: new Error('This is an error message.', { cause: 'Here is an Error Cause!' }),
		};

		const expectedResult = {
			...baseValue,
			string: `A string about ${getRedactedKeyText('ERROR')}s~~`,
			nested: { another_str: `just bE${getRedactedKeyText('cause')} of safety 123456` },
			nested_array: [
				{ str_a: `${getRedactedKeyText('cause')} surely` },
				{ str_b: `not an ${getRedactedKeyText('ERROR')}` },
			],
			array: ['something', `no ${getRedactedKeyText('ERROR')}`, `just be${getRedactedKeyText('cause')}`, 'all is good'],
			error: {
				name: getRedactedKeyText('ERROR'),
				message: `This is an ${getRedactedKeyText('ERROR')} message.`,
				cause: `Here is an ${getRedactedKeyText('ERROR')} ${getRedactedKeyText('cause')}!`,
			},
		};

		const expectedResultWithoutReplacementFn = {
			...baseValue,
			string: `A string about ${REDACTED_TEXT}s~~`,
			nested: { another_str: `just bE${REDACTED_TEXT} of safety 123456` },
			nested_array: [{ str_a: `${REDACTED_TEXT} surely` }, { str_b: `not an ${REDACTED_TEXT}` }],
			array: ['something', `no ${REDACTED_TEXT}`, `just be${REDACTED_TEXT}`, 'all is good'],
			error: {
				name: REDACTED_TEXT,
				message: `This is an ${REDACTED_TEXT} message.`,
				cause: `Here is an ${REDACTED_TEXT} ${REDACTED_TEXT}!`,
			},
		};

		const result = JSON.parse(
			JSON.stringify(
				objWithError,
				getReplacerFn(
					REDACTED_TEXT,
					{
						empty: '',
						ERROR: 'ErrOr',
						cause: 'CAusE',
						number: 123456,
					} as any,
					getRedactedKeyText
				)
			)
		);

		const resultWithoutReplacementFn = JSON.parse(
			JSON.stringify(
				objWithError,
				getReplacerFn(REDACTED_TEXT, {
					empty: '',
					ERROR: 'ErrOr',
					cause: 'CAusE',
					number: 123456,
				} as any)
			)
		);

		// Stack changes depending on env
		expect(result.error.stack).toBeDefined();
		delete result.error.stack;
		expect(resultWithoutReplacementFn.error.stack).toBeDefined();
		delete resultWithoutReplacementFn.error.stack;

		expect(result).toStrictEqual(expectedResult);
		expect(resultWithoutReplacementFn).toStrictEqual(expectedResultWithoutReplacementFn);
	});
});
