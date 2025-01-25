import { UnexpectedTokenError } from './errors/unexpected-token-error';
import { parseElement } from './parse-element';
import { parseTextNode } from './parse-text-node';
import type { ParsedXMLNode, XMLDocumentNode, XMLNode } from './types';

export function parse(xml: string) {
	xml = xml.trim();

	let index = 0;
	const children: XMLNode[] = [];

	while (index < xml.length) {
		const nextChild = parseXML(xml, index);

		if (!nextChild) {
			throw new UnexpectedTokenError(xml, index);
		}

		children.push(nextChild.value);

		index = nextChild.nextIndex;
	}

	return {
		kind: 'document',
		children,
	} satisfies XMLDocumentNode;
}

export function parseXML(
	xml: string,
	index: number,
): ParsedXMLNode<XMLNode> | null {
	return parseElement(xml, index) ?? parseTextNode(xml, index);
}
