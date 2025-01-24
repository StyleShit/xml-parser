export function collectWhile(
	xml: string,
	index: number,
	condition: (char: string) => boolean,
) {
	if (!condition(xml[index])) {
		return null;
	}

	let value = xml[index];

	index++;

	while (index < xml.length && condition(xml[index])) {
		value += xml[index];

		index++;
	}

	return {
		value,
		nextIndex: index,
	};
}
