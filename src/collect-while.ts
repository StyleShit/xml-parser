export function collectWhile(
	xml: string,
	index: number,
	condition: (char: string, currentIndex: number) => boolean,
) {
	if (index >= xml.length) {
		return null;
	}

	if (!condition(xml[index], index)) {
		return null;
	}

	let value = xml[index];

	index++;

	while (index < xml.length && condition(xml[index], index)) {
		value += xml[index];

		index++;
	}

	return {
		value,
		nextIndex: index,
	};
}
