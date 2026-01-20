import { blogPosts } from "./posts.js";
import { comments } from "./comments.js";
import { getPosts, createPostElement } from "./post_json_service.js";

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
 * Renders comment count of all blog comments on the main page.
*/
function renderCommentCount() {
    if (!document.querySelector(".blog-posts")) {
        console.error("Blog posts container not found.");
        return;
    }

    blogPosts.forEach(post => {
        renderPostPreview(post, postContainer);
    });
}

/**
 * Renders a preview of a single blog post.
 * @param {BlogPost} post
 * @param {HTMLElement} postContainer
 * TODO: add commentCount to post data
*/
function renderPostPreview(post, postContainer) {
    console.log("Post id = " + post.id);
    console.log("ALLA:", comments);
    console.log(typeof post.id);  // STRING! gjorde quick fix (rad 49)
    const postComments = comments.filter(
      comment => comment.postId === Number(post.id)
    );
    const commentCount = postComments.length;
    const postElement = document.createElement("article");
    postElement.className = "post-preview";
    postElement.id = `post-${post.id}`;
    postElement.innerHTML = `
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <img class="post-image-preview" src="${post.image}" alt="Preview image for blog post: ${post.title}" width="100" height="100"/>
        <div class="post-preview-meta">    
            <span class="comment-count" aria-label="Number of comments">
                💬 ${commentCount ?? 0} comments
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