import { collectWhile } from './collect-while';
import { skipWhitespaces } from './skip-whitespaces';
import { validateEndOfInput } from './validate-end-of-input';

export function parseOpeningTag(
	xml: string,
	index: number,
	options: Pick<ParseTagOptions, 'afterTagName'> = {},
) {
	return parseTag(xml, index, options);
}

export function parseClosingTag(xml: string, index: number) {
	return parseTag(xml, index, {
		beforeTagName: (_, currentIndex) => {
			if (xml[currentIndex] !== '/') {
				return null;
			}

			currentIndex++;

			validateEndOfInput(xml, currentIndex);

			return currentIndex;
		},
	});
}

type ParseTagOptions = {
	beforeTagName?: (xml: string, index: number) => number | null;
	afterTagName?: (xml: string, index: number) => number | null;
};

function parseTag(xml: string, index: number, options: ParseTagOptions = {}) {
	index = skipWhitespaces(xml, index);

	if (xml[index] !== '<') {
		return null;
	}

	index++;

	validateEndOfInput(xml, index);

	if (options.beforeTagName) {
		const result = options.beforeTagName(xml, index);

		if (result === null) {
			return null;
		}

		index = result;
	}

	const tagName = parseTagName(xml, index);

	if (!tagName) {
		throw new SyntaxError(
			`Unexpected '${xml[index]}' at index ${String(index)}.`,
		);
	}

	index = tagName.nextIndex;

	validateEndOfInput(xml, index);

	if (options.afterTagName) {
		const result = options.afterTagName(xml, index);

		if (result === null) {
			return null;
		}

		index = result;
	}

	if (xml[index] !== '>') {
		throw new SyntaxError(
			`Unexpected '${xml[tagName.nextIndex]}' at index ${String(
				tagName.nextIndex,
			)}.`,
		);
	}

	index++;

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
