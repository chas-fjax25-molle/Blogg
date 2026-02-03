import { readFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { App } from "@tinyhttp/app";
import { cors } from "@tinyhttp/cors";
import { json } from "milliparsec";
import { Service } from "json-server/lib/service.js";

// Read users.json for authentication
const usersData = JSON.parse(
    await readFile(new URL("./users.json", import.meta.url), "utf-8"),
);

// Create lowdb instance with JSONFile adapter (watches db.json)
const adapter = new JSONFile("db.json");
const db = new Low(adapter, {});
await db.read();

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

// Create service
const service = new Service(db);

// Create app manually to control middleware order
const app = new App();

// CORS - allow everything for development
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Accept",
    );

    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }

    next();
});

// Body parser
app.use(json());

// Add custom login route FIRST
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

        // Set HTTP-only cookie so that browser sends it automatically
        res.setHeader("Set-Cookie", [
            `authToken=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
        ]);

        res.json({
            user: {
                id: user.id,
                username: user.username,
            },
        });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

// Check authentication status
app.get("/me", (req, res) => {
    // Parse cookies
    const cookies = req.headers.cookie?.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
    }, {});

    const token = cookies?.authToken;

    if (token && validateToken(token)) {
        const user = activeTokens.get(token);
        res.json({ authenticated: true, user });
    } else {
        res.json({ authenticated: false });
    }
});

// Custom authentication middleware - runs BEFORE json-server routes
app.use((req, res, next) => {
    // Allow GET requests without auth
    if (req.method === "GET") {
        return next();
    }

    // Parse cookies
    const cookies = req.headers.cookie?.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
    }, {});

    const token = cookies?.authToken;

    if (!token || !validateToken(token)) {
        return res.status(401).json({
            error: "Unauthorized. Please provide a valid token.",
        });
    }

    // Attach user info to request
    req.user = activeTokens.get(token);
    next();
});

// Now add json-server routes
const isItem = (obj) =>
    typeof obj === "object" && obj !== null && !Array.isArray(obj);

app.get("/:name", (req, res, next) => {
    const { name = "" } = req.params;
    const query = {};
    Object.keys(req.query).forEach((key) => {
        let value = req.query[key];
        if (
            ["_start", "_end", "_limit", "_page", "_per_page"].includes(key) &&
            typeof value === "string"
        ) {
            value = parseInt(value);
        }
        if (!Number.isNaN(value)) {
            query[key] = value;
        }
    });
    res.locals["data"] = service.find(name, query);
    next?.();
});

app.get("/:name/:id", (req, res, next) => {
    const { name = "", id = "" } = req.params;
    res.locals["data"] = service.findById(name, id, req.query);
    next?.();
});

app.post("/:name", async (req, res, next) => {
    const { name = "" } = req.params;
    if (isItem(req.body)) {
        res.locals["data"] = await service.create(name, req.body);
    }
    next?.();
});

app.put("/:name", async (req, res, next) => {
    const { name = "" } = req.params;
    if (isItem(req.body)) {
        res.locals["data"] = await service.update(name, req.body);
    }
    next?.();
});

app.put("/:name/:id", async (req, res, next) => {
    const { name = "", id = "" } = req.params;
    if (isItem(req.body)) {
        res.locals["data"] = await service.updateById(name, id, req.body);
    }
    next?.();
});

app.patch("/:name", async (req, res, next) => {
    const { name = "" } = req.params;
    if (isItem(req.body)) {
        res.locals["data"] = await service.patch(name, req.body);
    }
    next?.();
});

app.patch("/:name/:id", async (req, res, next) => {
    const { name = "", id = "" } = req.params;
    if (isItem(req.body)) {
        res.locals["data"] = await service.patchById(name, id, req.body);
    }
    next?.();
});

app.delete("/:name/:id", async (req, res, next) => {
    const { name = "", id = "" } = req.params;
    res.locals["data"] = await service.destroyById(
        name,
        id,
        req.query["_dependent"],
    );
    next?.();
});

app.use("/:name", (req, res) => {
    const { data } = res.locals;
    if (data === undefined) {
        res.sendStatus(404);
    } else {
        if (req.method === "POST") res.status(201);
        res.json(data);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`JSON Server with auth running on http://localhost:${PORT}`);
});
