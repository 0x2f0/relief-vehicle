import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
	server: {
		port: 5173,
		proxy: {
			"/api": {
				target: "http://127.0.0.1:8787",
				changeOrigin: true,
			},
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor-tanstack': ['@tanstack/react-router', '@tanstack/react-query'],
					'vendor-lucide': ['lucide-react'],
					'vendor-qr': ['qrcode.react', 'jsqr'],
				},
			},
		},
		chunkSizeWarningLimit: 600,
	},
});
