import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: "autoUpdate",
            devOptions: { enabled: true }, // valfritt: gör att det funkar i dev
            manifest: {
                name: "Blog",
                short_name: "Blog",
                base: "/Blogg/",
                display: "standalone",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                icons: [
                    { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
                    { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" }
                ],
            }
        })
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
});