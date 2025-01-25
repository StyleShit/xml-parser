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
		expect(() => parse('<')).toThrow(`Unexpected end of input at index 1.`);
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

		expect(() => parse('<element')).toThrow(
			`Unexpected end of input at index 8.`,
		);
	});

	it('should throw for missing closing tag', () => {
		// Act & Assert.
		expect(() => parse('<element>')).toThrow(
			'Unexpected end of input at index 9.',
		);

		expect(() => parse('<element></element')).toThrow(
			'Unexpected end of input at index 18.',
		);

		expect(() => parse('<element></')).toThrow(
			'Unexpected end of input at index 11',
		);

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
			children: [
				{
					kind: 'element',
					name: 'child',
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
});
