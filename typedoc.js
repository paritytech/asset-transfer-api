module.exports = {
	entryPoints: [
		'./src',
	],
	exclude: [
		'**/*spec.ts',
		'node_modules/**',
		'./src/testHelpers/**',
	],
	excludeExternals: true,
	excludePrivate: true,
	hideGenerator: true,
	out: 'docs',
	theme: 'markdown',
};
