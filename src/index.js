import "./types.js"
import { getPosts, getCommentsForPost } from "./post_json_service.js";

renderPostPreviews();

/**
 * Renders previews of all blog posts on the main page.
*/
function renderPostPreviews() {
    const postContainer = document.querySelector(".blog-posts");

    if (!document.querySelector(".blog-posts")) {
        console.error("Blog posts container not found.");
        return;
    }
    getPosts().then(posts => {
        posts.forEach(post => {
            renderPostPreview(post, postContainer);
        });
    });
}

/**
 * Renders a preview of a single blog post.
 * @param {Post} post
 * @param {HTMLElement} postContainer
 * TODO: add commentCount to post data
*/
function renderPostPreview(post, postContainer) {

    const postElement = document.createElement("article");
    postElement.className = "post-preview";
    postElement.id = `post-${post.id}`;
    postElement.innerHTML = `
    <h3 class="post-title">${post.title}</h3>
    <p class="post-excerpt">${post.excerpt}</p>
    <img class="post-image-preview" src="${post.image}" alt="Preview image for blog post: ${post.title}" width="100" height="100"/>
    <div class="post-preview-meta">    
    <span class="comment-count" aria-label="Number of comments">
    💬  0 comments
    </span>
    </div>
    <button class="read-more-button" data-post-id="${post.id}" aria-label="Read More">Read More</button>
    `;

    // Add event listener properly instead of inline onclick
    const button = postElement.querySelector(".read-more-button");
    button.addEventListener("click", () => {
        window.location.href = `post.html?id=${post.id}`;
    });

    postContainer.appendChild(postElement);
    const postId = Number(post.id);
    updateCommentCounts(postId);
}

/**
 * Updates the comment count for a specific post.
 * @param {number} postId 
 */
async function updateCommentCounts(postId) {
    getCommentsForPost(postId).then(comments => {
        const commentCount = comments.length;
        const postElement = document.getElementById(`post-${postId}`);
        if (postElement) {
            const commentCountElement = postElement.querySelector(".comment-count");
            if (commentCountElement) {
                commentCountElement.textContent = `💬 ${commentCount} comments`;
            }
        }
    });
}