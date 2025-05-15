const config = require('@substrate/dev/config/eslint');

module.exports = {
	...config,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: '**/tsconfig.json',
	},
};
