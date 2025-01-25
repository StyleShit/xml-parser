import { collectWhile } from './collect-while';
import { skipWhitespaces } from './skip-whitespaces';
import type { ParsedXMLNode, XMLElementNode } from './types';

export function parseElement(
	xml: string,
	index: number,
): ParsedXMLNode<XMLElementNode> | null {
	index = skipWhitespaces(xml, index);

	if (xml[index] !== '<') {
		return null;
	}

	index++;

	validateEndOfInput(xml, index);

	const tagName = parseTagName(xml, index);

	if (!tagName) {
		throw new SyntaxError(
			`Unexpected '${xml[index]}' at index ${String(index)}.`,
		);
	}

	index = tagName.nextIndex;

	validateEndOfInput(xml, index);

	if (xml[index] !== '>') {
		throw new SyntaxError(
			`Unexpected '${xml[index]}' at index ${String(index)}.`,
		);
	}

	index++;

	const closingTag = parseClosingTag(xml, index, tagName.value);

	if (!closingTag) {
		throw new SyntaxError(
			`Expected closing tag for '${tagName.value}' at index ${String(index)}.`,
		);
	}

	return {
		value: {
			kind: 'element',
			name: closingTag.value,
		} satisfies XMLElementNode,
		nextIndex: closingTag.nextIndex,
	};
}

function parseTagName(xml: string, index: number) {
	return collectWhile(xml, index, (char) => /[a-z]/i.test(char));
}

function parseClosingTag(xml: string, index: number, tag: string) {
	tag = tag.toLowerCase();

	const closingTag = `</${tag}>`;

	if (
		xml.slice(index, index + closingTag.length).toLowerCase() !== closingTag
	) {
		return null;
	}

	return {
		value: tag,
		nextIndex: index + closingTag.length,
	};
}

function validateEndOfInput(xml: string, index: number) {
	if (index >= xml.length) {
		throw new SyntaxError(
			`Unexpected end of input at index ${String(index)}.`,
		);
	}
}
