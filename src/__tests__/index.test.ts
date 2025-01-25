import { describe, expect, it } from 'vitest';
import { parse } from '../index';

describe('XML Parser', () => {
	it('should parse text nodes', () => {
		// Arrange.
		const xml = `This
			is a text node

			with multiple lines.`;

		// Act.
		const result = parse(xml);

		// Assert.
		expect(result).toStrictEqual({
			kind: 'text',
			text: xml,
		});
	});

	it('should throw for invalid text node tokens', () => {
		// Act & Assert.
		expect(() => parse('<')).toThrow(`Unexpected end of input.`);
	});

	it('should parse element nodes', () => {
		// Arrange.
		const xml = '<element></element>';

		// Act.
		const result = parse(xml);

		// Assert.
		expect(result).toStrictEqual({
			kind: 'element',
			name: 'element',
			attributes: {},
			children: [],
		});
	});

	it('should parse element nodes with spaces', () => {
		// Arrange.
		const xml = '   \n \t \r <element></element>  \n \t \r ';

		// Act.
		const result = parse(xml);

		// Assert.
		expect(result).toStrictEqual({
			kind: 'element',
			name: 'element',
			attributes: {},
			children: [],
		});
	});

	it('should throw for invalid opening tag', () => {
		// Act & Assert.
		expect(() => parse('<  element>')).toThrow(
			`Unexpected ' ' at index 1.`,
		);

		expect(() => parse('<1element>')).toThrow(`Unexpected '1' at index 1.`);

		expect(() => parse('<element?>')).toThrow(`Unexpected '?' at index 8.`);

		expect(() => parse('<element')).toThrow(`Unexpected end of input.`);
	});

	it('should throw for missing closing tag', () => {
		// Act & Assert.
		expect(() => parse('<element>')).toThrow(
			`Expected closing tag for 'element' at index 9.`,
		);

		expect(() => parse('<element></element')).toThrow(
			'Unexpected end of input.',
		);

		expect(() => parse('<element></')).toThrow('Unexpected end of input.');

		expect(() => parse('<element></another-element>')).toThrow(
			"Expected closing tag for 'element' at index 9. Got 'another-element' instead.",
		);
	});

	it('should parse element with children', () => {
		// Arrange.
		const xml = `
			<parent>
				<child>This is a text node</child>
				<child2>This is another text node</child2>
			</parent>`;

		// Act.
		const result = parse(xml);

		// Assert.
		expect(result).toStrictEqual({
			kind: 'element',
			name: 'parent',
			attributes: {},
			children: [
				{
					kind: 'element',
					name: 'child',
					attributes: {},
					children: [
						{
							kind: 'text',
							text: 'This is a text node',
						},
					],
				},
				{
					kind: 'element',
					name: 'child2',
					attributes: {},
					children: [
						{
							kind: 'text',
							text: 'This is another text node',
						},
					],
				},
			],
		});
	});

	it('should parse element with attributes', () => {
		// Arrange.
		const xml = `<element
			attr1="value1"
			attr2  =  "value2"
			empty=""
		>
			<inner attr3="test 123">text node</inner>
		</element>`;

		// Act.
		const result = parse(xml);

		// Assert.
		expect(result).toStrictEqual({
			kind: 'element',
			name: 'element',
			attributes: {
				attr1: 'value1',
				attr2: 'value2',
				empty: '',
			},
			children: [
				{
					kind: 'element',
					name: 'inner',
					attributes: {
						attr3: 'test 123',
					},
					children: [
						{
							kind: 'text',
							text: 'text node',
						},
					],
				},
			],
		});
	});

	it('should throw for invalid attributes', () => {
		// Act & Assert.
		expect(() => parse('<element attr></element>')).toThrow(
			`Unexpected '>' at index 13.`,
		);

		expect(() => parse('<element attr=></element>')).toThrow(
			`Unexpected '>' at index 14.`,
		);

		expect(() => parse('<element attr="></element>')).toThrow(
			`Unexpected '>' at index 15.`,
		);

		expect(() => parse('<element attr="value></element>')).toThrow(
			`Unexpected '>' at index 20.`,
		);

		expect(() => parse('<element attr?></element>')).toThrow(
			`Unexpected '?' at index 13.`,
		);
	});
});
