process.env.NODE_ENV = 'test';

module.exports = {
	timeout: 20000,
	bail: false,
	exit: true,
	delay: false,
	diff: true,
	opts: false,
	recursive: true,
	require: 'ts-node/register/transpile-only',
	extension: ['ts'],
	watchExtensions: ['ts'],
	// need to uncomment
	// single test // "mocha src/test/integrationTests/users.test.ts"
	// spec: ['src/test/**/*.test.ts'],
	spec: ['src/test/integrationTests/representative.test.ts'],
};
