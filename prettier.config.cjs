/** @typedef {import('@ianvs/prettier-plugin-sort-imports').PluginConfig} SortImportsConfig */
/** @typedef {import('prettier').Config} PrettierConfig */

/** @type {PrettierConfig | SortImportsConfig} */
const config = {
	semi: true,
	singleQuote: true,
	trailingComma: 'none',
	useTabs: true,
	tabWidth: 2,
	plugins: [
		'prettier-plugin-packagejson',
		'prettier-plugin-jsdoc',
		'prettier-plugin-tailwindcss',
		'@ianvs/prettier-plugin-sort-imports'
	],
	importOrder: [
		'^react',
		'^next/(.*)$',
		'',
		'<TYPES>',
		'<TYPES>^[./]',
		'',
		'<THIRD_PARTY_MODULES>',
		'',
		'^@/utils/(.*)$',
		'',
		'^@/components/(.*)$',
		'',
		'^@/(.*)$',
		'^[./]'
	],
	importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
	importOrderTypeScriptVersion: '5.2.2'
};

module.exports = config;
