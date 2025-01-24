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
		expect(result).toMatchObject({
			kind: 'text',
			text: xml,
		});
	});

	it('should throw for invalid text node tokens', () => {
		// Act & Assert.
		expect(() => parse('<')).toThrow(`Unexpected '<' at index '0'`);

		expect(() => parse('>')).toThrow(`Unexpected '>' at index '0'`);
	});
});
