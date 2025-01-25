import { ExpectedClosingTagError } from './errors/expected-closing-tag-error';
import { UnexpectedTokenError } from './errors/unexpected-token-error';
import { parseXML } from './parse';
import { parseAttributes } from './parse-attributes';
import { parseClosingTag, parseOpeningTag } from './parse-tag';
import type { ParsedXMLNode, XMLElementNode, XMLNode } from './types';

export function parseElement(
	xml: string,
	index: number,
): ParsedXMLNode<XMLElementNode> | null {
	let attributes: XMLElementNode['attributes'] = {};

	const openingTag = parseOpeningTag(xml, index, {
		afterTagName: (_, currentIndex) => {
			const parsedAttributes = parseAttributes(xml, currentIndex);

			attributes = parsedAttributes.value;

			return parsedAttributes.nextIndex;
		},
	});

	if (!openingTag) {
		return null;
	}

	index = openingTag.nextIndex;

	const children: XMLNode[] = [];

	while (index < xml.length) {
		const closingTag = parseClosingTag(xml, index);

		if (closingTag) {
			if (closingTag.value !== openingTag.value) {
				throw new ExpectedClosingTagError(
					index,
					openingTag.value,
					closingTag.value,
				);
			}

			return {
				value: {
					kind: 'element',
					name: openingTag.value,
					children,
					attributes,
				} satisfies XMLElementNode,
				nextIndex: closingTag.nextIndex,
			};
		}

		const nextChild = parseXML(xml, index);

		if (!nextChild) {
			throw new UnexpectedTokenError(xml, index);
		}

		children.push(nextChild.value);

		index = nextChild.nextIndex;
	}

	throw new ExpectedClosingTagError(index, openingTag.value);
}
