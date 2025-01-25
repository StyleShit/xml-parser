import { UnexpectedTokenError } from './errors/unexpected-token-error';
import { parseElement } from './parse-element';
import { parseTextNode } from './parse-text-node';
import type { ParsedXMLNode, XMLNode } from './types';

export function parse(xml: string) {
	const parsed = parseXML(xml, 0);

	if (!parsed) {
		throw new UnexpectedTokenError(xml, 0);
	}

	return parsed.value;
}

export function parseXML(
	xml: string,
	index: number,
): ParsedXMLNode<XMLNode> | null {
	return parseElement(xml, index) ?? parseTextNode(xml, index);
}
