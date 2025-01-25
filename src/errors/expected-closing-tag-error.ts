export class ExpectedClosingTagError extends SyntaxError {
	constructor(index: number, expected: string, actual?: string) {
		let message = `Expected closing tag for '${expected}' at index ${String(index)}.`;

		if (actual) {
			message += ` Got '${actual}' instead.`;
		}

		super(message);
	}
}
