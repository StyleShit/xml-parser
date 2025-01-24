import { collectWhile } from './collect-while';
import type { XMLTextNode } from './types';

export function parseTextNode(xml: string, index: number) {
	const parsed = collectWhile(xml, index, (char) => /[^<>]/i.test(char));

	if (!parsed) {
		return null;
	}

	return {
		value: {
			kind: 'text',
			text: parsed.value,
		} satisfies XMLTextNode,
		nextIndex: parsed.nextIndex,
	};
}
