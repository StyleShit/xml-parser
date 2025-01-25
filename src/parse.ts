import { parseElement } from './parse-element';
import { parseTextNode } from './parse-text-node';
import type { ParsedXMLNode, XMLNode } from './types';

export function parse(xml: string) {
	const parsed = parseXML(xml, 0);

	if (!parsed) {
		throw new SyntaxError(`Unexpected '${xml[0]}' at index '0'`);
	}

	return parsed.value;
}

function parseXML(xml: string, index: number): ParsedXMLNode<XMLNode> | null {
	return parseElement(xml, index) ?? parseTextNode(xml, index);
}
