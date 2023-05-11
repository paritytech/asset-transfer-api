module.exports = {
	entryPoints: [
		'./src/index.ts',
	],
	exclude: [
		'**/*spec.ts',
		'node_modules/**',
		'./src/testHelpers/**',
	],
	"excludeNotDocumented": true,
	"navigationLinks": {
        "Repository": "https://github.com/paritytech/asset-transfer-api",
		"Parity.io": "https://www.parity.io/"
    },
	includeVersion: true,
	excludeExternals: true,
	excludePrivate: true,
	hideGenerator: true,
	out: 'docs',
};
