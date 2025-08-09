import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	build: {
		outDir: "../wwwroot",
		emptyOutDir: true,
	},
	// resolve: {
	// 	mainFields: ["browser"],
	// },
	plugins: [react()],
});
