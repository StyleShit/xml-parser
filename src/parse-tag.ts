import { collectWhile } from './collect-while';
import { UnexpectedTokenError } from './errors/unexpected-token-error';
import { skipWhitespaces } from './skip-whitespaces';

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

			return {
				nextIndex: currentIndex + 1,
			};
		},
	});
}

type ParseTagOptions = {
	beforeTagName?: ParserMiddleware;
	afterTagName?: ParserMiddleware;
};

type ParserMiddleware = (
	xml: string,
	index: number,
) => { nextIndex: number } | null;

function parseTag(xml: string, index: number, options: ParseTagOptions = {}) {
	index = skipWhitespaces(xml, index);

	if (xml[index] !== '<') {
		return null;
	}

	index++;

	if (options.beforeTagName) {
		const result = options.beforeTagName(xml, index);

		if (result === null) {
			return null;
		}

		index = result.nextIndex;
	}

	const tagName = parseTagName(xml, index);

	if (!tagName) {
		throw new UnexpectedTokenError(xml, index);
	}

	index = tagName.nextIndex;

	if (options.afterTagName) {
		const result = options.afterTagName(xml, index);

		if (result === null) {
			return null;
		}

		index = result.nextIndex;
	}

	if (xml[index] !== '>') {
		throw new UnexpectedTokenError(xml, index);
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
