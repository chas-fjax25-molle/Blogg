const API_URL = "http://localhost:3000/posts";

/**
 * @typedef {Object} Post
 * @property {number} id - Unique identifier for the blog post
 * @property {string} title - Title of the blog post
 * @property {string} excerpt - Short excerpt of the blog post
 * @property {string} content - Full content of the blog post
 * @property {string} author - Author of the blog post
 * @property {string} date - Publication date of the blog post
 * @property {string} category - Category of the blog post
 * @property {string} image - Image URL for the blog post
 */

/**
 * @typedef {Object} Comment
 * @property {number} id - Unique identifier for comment post
 * @property {number} postId - Identifier for the post connected to the comment
 * @property {string} author - The author of the comment
 * @property {string} text - The text content of the comment
 * @property {string} date - The date of when the comment was created 
 */

/**
 * Gets all posts from the API.
 * @returns {Promise<Post[]>} List of all posts.
 */
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

/**
 * Gets a single post by ID.
 * @param {number} id
 * @returns {Promise<Post>} The post object. 
 */
export async function getPost(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const post = await response.json();
        return post;

    } catch (error) {
        console.error(`Failed to fetch post with id ${id}:`, error);
        throw error;
    }
}

/**
 * Creates a new post.
 * @param {Post} postData
 * @returns {Promise<Post>} The created post object.
 */
export async function createPost(postData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const newPost = await response.json();
        return newPost;

    } catch (error) {
        console.error("Failed to create post:", error);
        throw error;
    }
}

/**
 * Gets all comments for a specific post.
 * @param {number} postId
 * @returns {Promise<Comment[]>} List of comments for the post.
 */
export async function getCommentsForPost(postId) {
    try {
        const response = await fetch(`http://localhost:3000/comments?postId=${postId}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const comments = await response.json();
        return comments;

    } catch (error) {
        console.error(`Failed to fetch comments for post with id ${postId}:`, error);
        throw error;
    }
}

/**
 * Adds a comment to a specific post.
 * @param {number} postId
 * @param {Comment} commentData
 * @returns {Promise<Comment>} The created comment object.
 */
export async function addCommentToPost(postId, commentData) {
    try {
        const response = await fetch(`http://localhost:3000/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...commentData, postId })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const newComment = await response.json();
        return newComment;

    } catch (error) {
        console.error(`Failed to add comment to post with id ${postId}:`, error);
        throw error;
    }
}
