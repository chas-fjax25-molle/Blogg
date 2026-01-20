const API_URL = "http://localhost:3001/post_json_service";

export async function getPosts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const posts = await response.json();
        return posts;

    } catch (error) {
        console.error("Failed to fetch posts:", error);

        // Viktigt för PWA:
        // Vi kastar felet vidare så UI kan avgöra
        // om data ska hämtas från cache / visa offline-meddelande
        throw error;
    }
}

export function createPostElement(post) {
    const li = document.createElement("li");

    li.className = "post-item";

    li.innerHTML = `
    <input type="checkbox" disabled>
    <span style="${post.done ? "text-decoration: line-through" : ""}">${post.title}</span>
  `;
    return li;
}