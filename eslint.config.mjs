import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
	{ files: ['src/**/*.{js,mjs,cjs,ts}'] },
	{ ignores: ['dist/**/*'] },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			semi: 0,
			'@typescript-eslint/no-unused-vars': 0,
			// 'no-console': 'warn',
		},
	},
]
