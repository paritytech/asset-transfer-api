process.on('unhandledRejection', () => {
	// eslint-disable-next-line no-console
	console.log('Caught unhandled promise rejection');
});

export default {};
