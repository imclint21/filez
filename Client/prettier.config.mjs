/** @type {import("prettier").Config} */
const config = {
	semi: true,
	singleQuote: false,
	useTabs: true,
	tabWidth: 4,
	printWidth: 512,
	trailingComma: "es5",
	bracketSameLine: true,
	bracketSpacing: true,
	plugins: ["prettier-plugin-organize-imports"],
};

export default config;
