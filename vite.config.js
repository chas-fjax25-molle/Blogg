import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command, mode }) => ({
    base: command === 'build' ? '/Blogg/' : '/',

    server: {
    middlewareMode: false,
    middleware: [
        (req, res, next) => {
            const path = req.url;
            
            // HTML files: no cache
            if (path.endsWith('.html') || path === '/') {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            }
            // Static assets: long cache (Vite fingerprints them)
            else if (/\.(js|css|png|jpg|jpeg|svg|webp|gif|ico|woff2|woff|ttf|eot)$/i.test(path)) {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
            // Default: revalidate
            else {
                res.setHeader('Cache-Control', 'no-cache');
            }
            
            next();
        }
    ]
},
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
}));