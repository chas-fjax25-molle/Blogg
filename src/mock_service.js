const MOCK_DB_PATH = "/mock-db.json";

async function fetchMock() {
    const res = await fetch(MOCK_DB_PATH);
    if (!res.ok) throw new Error("Failed to load mock DB");
    return res.json();
}

export async function getPosts() {
    const db = await fetchMock();
    return db.posts || [];
}

export async function getPost(id) {
    const db = await fetchMock();
    return (db.posts || []).find((p) => Number(p.id) === Number(id));
}

export async function createPost(postData) {
    // In read-only mode, simulate a successful create without persisting
    return { id: Date.now(), ...postData };
}

export async function getCommentsForPost(postId) {
    const db = await fetchMock();
    return (db.comments || []).filter(
        (c) => Number(c.postId) === Number(postId),
    );
}

export async function addCommentToPost(commentData) {
    // Simulate created comment
    return { id: Date.now(), ...commentData };
}

export async function login(username, password) {
    // Mock login: only returns a fake user object
    if (username === "admin" && password === "password") {
        return { id: 1, username: "admin" };
    }
    throw new Error("Invalid credentials");
}

export async function checkAuth() {
    return { authenticated: false };
}
