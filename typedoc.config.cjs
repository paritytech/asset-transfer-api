module.exports = {
	entryPoints: [
		'./src/index.ts',
	],
	exclude: [
		'**/*spec.ts',
		'node_modules/**',
		'./src/testHelpers/**',
	],
	// "excludeNotDocumented": true,
	// "navigationLinks": {
    //     "ATApi": "./docs/classes"
    // },
	// "sidebarLinks": {
    //     "ATApi": "./docs/classes"
    // },
	// "navigation": {
    //     "includeCategories": true,
    //     "includeGroups": false
    // },
    // "categorizeByGroup": false,
	includeVersion: true,
	excludeExternals: true,
	excludePrivate: true,
	hideGenerator: true,
	out: 'docs',
};
