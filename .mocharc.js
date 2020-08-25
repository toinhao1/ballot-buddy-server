process.env.NODE_ENV = 'test';

module.exports = {
	timeout: 200000,
	bail: false,
	exit: true,
	delay: false,
	diff: true,
	opts: false,
	recursive: true,
	require: 'ts-node/register/transpile-only',
	extension: ['ts'],
	watchExtensions: ['ts'],
	spec: ['src/test/**/*.test.ts'],
};
