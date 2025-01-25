# XML Parser

Simple XML to AST parser in TypeScript.

This parser has a custom grammar and exists for learning purposes.

## Features

The parser supports elements ('<element>'), attributes ('<element attribute="value">'), and text nodes ('<element>text</element>').

It does not support comments, self-closing tags, or other XML features.

## Installation

```bash
npm install @styleshit/xml-parser
```

## Usage

To use it, import the `parse` function and pass an XML string to it.

For example, this code:

```typescript
import { parse } from '@styleshit/xml-parser';

const ast = parse(`
    <root>
        <element attribute="value">first text</element>
    </root>
    <sibling>another text</sibling>
`);

console.log(ast);
```

Will output:

```typescript
const ast = {
  kind: 'document',
  children: [
    {
      kind: 'element',
      name: 'root',
      children: [
        {
          kind: 'element',
          name: 'element',
          children: [
            {
              kind: 'text',
              text: 'first text',
            },
          ],
          attributes: {
            attribute: 'value',
          },
        },
      ],
      attributes: {},
    },
    {
      kind: 'element',
      name: 'sibling',
      children: [
        {
          kind: 'text',
          text: 'another text',
        },
      ],
      attributes: {},
    },
  ],
};
```

While this code will throw an error:

```typescript
import { parse } from '@styleshit/xml-parser';

const ast = parse('<element>text</another-element>');

// SyntaxError: Expected closing tag for 'element' at index 13. Got 'another-element' instead.
```
