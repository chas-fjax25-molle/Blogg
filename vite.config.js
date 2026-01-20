import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import eslint from "vite-plugin-eslint";

export default defineConfig(({ command, mode }) => ({
    base: command === 'build' ? '/Blogg/' : '/',
    plugins: [
        VitePWA({
            registerType: "autoUpdate",
            devOptions: { enabled: true },
            manifest: {
                name: "Blog",
                short_name: "Blog",
                display: "standalone",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                icons: [
                    { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
                    { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" }
                ],
            }
        }),
        eslint()
    ],
    build: {
        rollupOptions: {
            input: {
                main: "index.html",
                post: "post.html",
                about: "about.html"
            }
        }
    }
}));