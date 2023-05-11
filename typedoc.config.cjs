module.exports = {
	entryPoints: [
		'./src',
	],
	exclude: [
		'**/*spec.ts',
		'node_modules/**',
		'./src/testHelpers/**',
	],
	includeVersion: true,
	excludeExternals: true,
	excludePrivate: true,
	hideGenerator: true,
	out: 'docs',
};
