import { blogPosts } from "./posts.js";
import { getPosts, createPostElement } from "./post_json_service.js";

renderPostPreviews();

/**
 * Renders previews of all blog posts on the main page.
*/
function renderPostPreviews() {
    if (!document.querySelector(".blog-posts")) {
        console.error("Blog posts container not found.");
        return;
    }
    getPosts().then(posts => {
        posts.forEach(post => {
            renderPostPreview(post);
        });
    });
}

/**
 * Renders a preview of a single blog post.
 * @param {BlogPost} post
 * TODO: add commentCount to post data
*/
function renderPostPreview(post) {
    const postContainer = document.querySelector(".blog-posts");
    const postElement = document.createElement("article");
    postElement.className = "post-preview";
    postElement.id = `post-${post.id}`;
    postElement.innerHTML = `
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <img class="post-image-preview" src="${post.image}" alt="Blog Post Image" width="100" height="100"/>
            <div class="post-preview-meta">    
        <span class="comment-count" aria-label="Number of comments">
            💬 ${post.commentCount ?? 0} comments
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
}