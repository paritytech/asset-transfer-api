import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		setupFiles: ['./vitest-setup-file.ts'],
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					include: ['./src/**/*.spec.ts'],
					exclude: ['./src/integrationTests/**/*.spec.ts', './e2e-tests/*.spec.ts'],
				},
			},
			{
				extends: true,
				test: {
					name: 'integration',
					include: ['./src/integrationTests/**/*.spec.ts'],
				},
			},
			{
				extends: true,
				test: {
					name: 'e2e',
					include: ['./e2e-tests/*.spec.ts'],
				},
			},
		],
	},
});
