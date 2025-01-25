export function skipWhitespaces(xml: string, index: number) {
	while (index < xml.length && /\s/.test(xml[index])) {
		index++;
	}

	return index;
}
