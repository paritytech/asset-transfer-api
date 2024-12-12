import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	{
		extends: './vitest.config.ts',
		test: {
			name: 'unit',
			include: ['./src/**/*.spec.ts'],
			exclude: ['./src/integrationTests/**/*.spec.ts', './e2e-tests/*.spec.ts'],
		},
	},
	{
		extends: './vitest.config.ts',
		test: {
			name: 'integration',
			include: ['./src/integrationTests/**/*.spec.ts'],
		},
	},
	{
		extends: './vitest.config.ts',
		test: {
			name: 'e2e',
			include: ['./e2e-tests/*.spec.ts'],
		},
	},
]);
