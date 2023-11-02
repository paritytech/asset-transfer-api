module.exports = {
	entryPoints: [
		'./src/AssetTransferApi.ts',
		'./src/constructApiPromise.ts',
		'./src/types.ts',
		'./src/errors/BaseError.ts'
	],
	plugin: ["typedoc-theme-hierarchy"],
	exclude: [
		'**/*spec.ts',
		'node_modules/**',
		'./src/testHelpers/**',
	],
	excludeNotDocumented: true,
	navigationLinks: {
        Repository: "https://github.com/paritytech/asset-transfer-api",
		"Parity.io": "https://www.parity.io/"
    },
	includeVersion: true,
	excludeExternals: true,
	excludePrivate: true,
	hideGenerator: true,
	out: 'docs',
};
