export class UnexpectedTokenError extends SyntaxError {
	constructor(xml: string, index: number) {
		if (index >= xml.length) {
			super(`Unexpected end of input.`);
			return;
		}

		super(`Unexpected '${xml[index]}' at index ${String(index)}.`);
	}
}
