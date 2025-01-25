import { parseXML } from './parse';
import { parseClosingTag, parseOpeningTag } from './parse-tag';
import type { ParsedXMLNode, XMLElementNode, XMLNode } from './types';

export function parseElement(
	xml: string,
	index: number,
): ParsedXMLNode<XMLElementNode> | null {
	const openingTag = parseOpeningTag(xml, index);

	if (!openingTag) {
		return null;
	}

	index = openingTag.nextIndex;

	const children: XMLNode[] = [];

	while (index < xml.length) {
		const closingTag = parseClosingTag(xml, index);

		if (closingTag) {
			if (closingTag.value !== openingTag.value) {
				throw new SyntaxError(
					`Expected closing tag for '${openingTag.value}' at index ${String(index)}. Got '${closingTag.value}' instead.`,
				);
			}

			return {
				value: {
					kind: 'element',
					name: openingTag.value,
					children,
				} satisfies XMLElementNode,
				nextIndex: closingTag.nextIndex,
			};
		}

		const nextChild = parseXML(xml, index);

		if (!nextChild) {
			throw new SyntaxError(
				`Unexpected '${xml[index]}' at index ${String(index)}.`,
			);
		}

		children.push(nextChild.value);

		index = nextChild.nextIndex;
	}

	throw new SyntaxError(
		`Expected closing tag for '${openingTag.value}' at index ${String(index)}.`,
	);
}
