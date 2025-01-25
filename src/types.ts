export type XMLNode = XMLElementNode | XMLTextNode;

export type XMLElementNode = {
	kind: 'element';
	name: string;
	children: XMLNode[];
	attributes: Record<string, string>;
};

export type XMLTextNode = {
	kind: 'text';
	text: string;
};

export type ParsedXMLNode<T extends XMLNode> = {
	value: T;
	nextIndex: number;
};
