import { collectWhile } from './collect-while';
import { skipWhitespaces } from './skip-whitespaces';
import { validateEndOfInput } from './validate-end-of-input';

export function parseOpeningTag(xml: string, index: number) {
	return parseTag(xml, index);
}

export function parseClosingTag(xml: string, index: number) {
	return parseTag(xml, index, true);
}

function parseTag(xml: string, index: number, closing: boolean = false) {
	index = skipWhitespaces(xml, index);

	if (xml[index] !== '<') {
		return null;
	}

	index++;

	validateEndOfInput(xml, index);

	if (closing) {
		if (xml[index] !== '/') {
			return null;
		}

		index++;

		validateEndOfInput(xml, index);
	}

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

	index++;

	if (!closing) {
		validateEndOfInput(xml, index);
	}

	return {
		value: tagName.value.toLowerCase(),
		nextIndex: index,
	};
}

function parseTagName(xml: string, index: number) {
	return collectWhile(xml, index, (char, currentIndex) =>
		currentIndex === index ? /[a-z]/i.test(char) : /[a-z0-9-]/i.test(char),
	);
}
