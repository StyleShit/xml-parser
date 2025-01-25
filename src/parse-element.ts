import { collectWhile } from './collect-while';
import { parseXML } from './parse';
import { skipWhitespaces } from './skip-whitespaces';
import type { ParsedXMLNode, XMLElementNode, XMLNode } from './types';

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

	const tag = tagName.value.toLowerCase();
	const children: XMLNode[] = [];

	while (index < xml.length) {
		const closingTag = parseClosingTag(xml, index);

		if (closingTag) {
			if (closingTag.value !== tag) {
				throw new SyntaxError(
					`Expected closing tag for '${tag}' at index ${String(index)}. Got '${closingTag.value}' instead.`,
				);
			}

			return {
				value: {
					kind: 'element',
					name: tagName.value,
					children,
				} satisfies XMLElementNode,
				nextIndex: closingTag.nextIndex,
			};
		}

		const parsedChild = parseXML(xml, index);

		if (!parsedChild) {
			throw new SyntaxError(
				`Unexpected '${xml[index]}' at index ${String(index)}.`,
			);
		}

		children.push(parsedChild.value);

		index = parsedChild.nextIndex;
	}

	throw new SyntaxError(
		`Expected closing tag for '${tagName.value}' at index ${String(index)}.`,
	);
}

function parseTagName(xml: string, index: number) {
	return collectWhile(xml, index, (char, currentIndex) =>
		currentIndex === index ? /[a-z]/i.test(char) : /[a-z0-9-]/i.test(char),
	);
}

function parseClosingTag(xml: string, index: number) {
	index = skipWhitespaces(xml, index);

	if (xml[index] !== '<') {
		return null;
	}

	index++;

	validateEndOfInput(xml, index);

	if (xml[index] !== '/') {
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
			`Unexpected '${xml[tagName.nextIndex]}' at index ${String(
				tagName.nextIndex,
			)}.`,
		);
	}

	return {
		value: tagName.value.toLowerCase(),
		nextIndex: index + 1,
	};
}

function validateEndOfInput(xml: string, index: number) {
	if (index >= xml.length) {
		throw new SyntaxError(
			`Unexpected end of input at index ${String(index)}.`,
		);
	}
}
