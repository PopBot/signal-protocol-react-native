module.exports = {
	bracketSpacing: true,
	bracketSameLine: false,
	singleQuote: true,
	trailingComma: 'all',
	arrowParens: 'always',
	tabWidth: 4,
	useTabs: true,
	singleAttributePerLine: true,
	jsxSingleQuote: true,
	semi: true,
	quoteProps: 'consistent',
	endOfLine: 'lf',
	embeddedLanguageFormatting: 'auto',
	proseWrap: 'preserve',
	printWidth: 80,
	// Apply this to json files as well
	overrides: [
		{
			files: '*.json',
			options: {
				tabWidth: 4,
			},
		},
		{
			files: '*.ts',
			options: {
				parser: 'typescript',
				tabWidth: 4,
			}
		},
		{
			files: '*.js',
			options: {
				parser: 'babel',
				tabWidth: 4,
			}
		}
	],
};
