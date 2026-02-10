import { readFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { createApp } from "json-server/lib/app.js";

// Read db.json and users.json
const data = JSON.parse(
    await readFile(new URL("./db.json", import.meta.url), "utf-8"),
);
const usersData = JSON.parse(
    await readFile(new URL("./users.json", import.meta.url), "utf-8"),
);

// Store active tokens (in-memory for simplicity)
const activeTokens = new Map(); // token -> user info

// Generate unique token
const generateToken = () => {
    return randomBytes(32).toString("hex");
};

// Token validation
const validateToken = (token) => {
    return activeTokens.has(token);
};

// Create the json-server app
const app = createApp({ data });

// Cache headers middleware - runs for all requests
app.use((req, res, next) => {
    if (req.method !== "GET") return next();

    const path = req.path || "";
    const match = path.match(/\.([a-z0-9]+)(?:$|\?)/i);
    const ext = match ? match[1].toLowerCase() : "";

    const longCacheExts = new Set(["js", "css", "png", "jpg", "jpeg", "svg", "webp", "gif", "ico",
        "woff2", "woff", "ttf", "eot", "map"]);

    if (path === "/" || path.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    } else if (longCacheExts.has(ext)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else {
        res.setHeader("Cache-Control", "no-cache");
    }

    next();
});

// Custom authentication middleware - insert before other routes
app.use((req, res, next) => {
    // Allow GET requests and /login without auth
    if (req.method === "GET" || req.path === "/login") {
        return next();
    }

    // Check authorization for POST, PUT, PATCH, DELETE
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token || !validateToken(token)) {
        return res.status(401).json({
            error: "Unauthorized. Please provide a valid token.",
        });
    }

    // Attach user info to request
    req.user = activeTokens.get(token);
    next();
});

// Add custom login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Find user in users.json
    const user = usersData.users.find(
        (u) => u.username === username && u.password === password,
    );

    if (user) {
        // Generate unique token
        const token = generateToken();

        // Store token with user info (without password)
        activeTokens.set(token, {
            id: user.id,
            username: user.username,
        });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
            },
        });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`JSON Server with auth running on http://localhost:${PORT}`);
});
