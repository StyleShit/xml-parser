import { collectWhile } from './collect-while';
import { skipSpaces } from './skip-spaces';
import { skipWhitespaces } from './skip-whitespaces';
import type { XMLElementNode } from './types';

export function parseAttributes(xml: string, index: number) {
	const attributes: XMLElementNode['attributes'] = {};

	index = skipWhitespaces(xml, index);

	while (index < xml.length) {
		const nextAttribute = parseAttribute(xml, index);

		if (!nextAttribute) {
			break;
		}

		attributes[nextAttribute.name] = nextAttribute.value;

		index = skipWhitespaces(xml, nextAttribute.nextIndex);
	}

	return {
		value: attributes,
		nextIndex: index,
	};
}

function parseAttribute(xml: string, index: number) {
	const attributeName = collectWhile(xml, index, (char, currentIndex) => {
		return currentIndex === index
			? /[a-z]/.test(char)
			: /[a-z0-9-]/.test(char);
	});

	if (!attributeName) {
		return null;
	}

	index = skipSpaces(xml, attributeName.nextIndex);

	if (xml[index] !== '=') {
		throw new SyntaxError(
			`Unexpected '${xml[index]}' at index ${String(index)}.`,
		);
	}

	index = skipSpaces(xml, index + 1);

	if (xml[index] !== '"') {
		throw new SyntaxError(
			`Unexpected '${xml[index]}' at index ${String(index)}.`,
		);
	}

	index++;

	const attributeValue = collectWhile(xml, index, (char) =>
		/[^"\n\r<>]/.test(char),
	);

	index = attributeValue?.nextIndex ?? index;

	if (xml[index] !== '"') {
		throw new SyntaxError(
			`Unexpected '${xml[index]}' at index ${String(index)}.`,
		);
	}

	index++;

	return {
		name: attributeName.value.toLowerCase(),
		value: attributeValue?.value ?? '',
		nextIndex: index,
	};
}
