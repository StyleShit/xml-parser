import { parseTextNode } from './parse-text-node';

export function parse(xml: string) {
	const parsed = parseTextNode(xml, 0);

	if (!parsed) {
		throw new SyntaxError(`Unexpected '${xml[0]}' at index '0'`);
	}

	return parsed.value;
}
