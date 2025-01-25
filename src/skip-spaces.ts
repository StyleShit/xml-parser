export function skipSpaces(xml: string, index: number) {
	while (index < xml.length && xml[index] === ' ') {
		index++;
	}

	return index;
}
