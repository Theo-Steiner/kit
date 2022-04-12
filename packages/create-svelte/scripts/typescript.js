import { transform } from 'sucrase';
import ts from 'typescript';
import prettier from 'prettier';

/**
 * @param {string} typescript the typescript source code to transpile
 */
export function transpile(typescript) {
	const transformed = transform(typescript, { transforms: ['typescript'] });

	return prettier.format(transformed.code, {
		parser: 'babel',
		useTabs: true,
		singleQuote: true,
		trailingComma: 'none',
		printWidth: 100
	});
}

/**
 *
 * @param {string} filepath the path to the file to extract types from
 * @returns {string}
 */
export function extract_types(filepath) {
	// Create a Program with an in-memory emit
	const host = ts.createCompilerHost({
		declaration: true,
		emitDeclarationOnly: true
	});
	let declaration;
	host.writeFile = (_, contents) => (declaration = contents);

	// Prepare and emit the d.ts files
	const program = ts.createProgram(
		[filepath],
		{
			declaration: true,
			emitDeclarationOnly: true
		},
		host
	);
	program.emit();

	return declaration;
}
