export function validateEndOfInput(xml: string, index: number) {
	if (index >= xml.length) {
		throw new SyntaxError(
			`Unexpected end of input at index ${String(index)}.`,
		);
	}
}
