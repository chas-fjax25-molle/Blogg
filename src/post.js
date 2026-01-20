import "./types.js";
import { getPost, getCommentsForPost } from "./api_service.js";

blogPage();

/**
 * Handles the blog post page rendering
*/
function blogPage() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("id")) {
        const postId = parseInt(params.get("id"));
        getPost(postId).then(post => {
            renderFullPost(post);
        }).catch(error => {
            console.error("Error fetching post:", error);
            const postContainer = document.querySelector(".blog-post-container");
            postContainer.innerHTML = "<p alt='Blog post not found.', class='missing-post'>Blog post not found.</p>";
        });
    } else {
        window.location.href = "index.html";
    }
}

/**
 * Renders the full blog post on its separate page.
 * @param {Post} post 
*/
function renderFullPost(post) {
    const postElement = document.createElement("article");
    postElement.className = "full-post";
    postElement.id = `post-${post.id}`;
    postElement.innerHTML = `
        <h2 class="post-title">${post.title}</h2>
        <div class="post-body">
            <img class="post-image" src="${post.image}" alt="Blog Post Image" width="300" height="200"/>
            <div class="post-meta">
                <p class="post-author">By ${post.author}</p>
                <time class="post-date" datetime="${post.date}">Published on ${post.date}</time>
                <p class="post-category">Category: ${post.category}</p>
            </div>
            <p class="post-content">${post.content}</p>
        </div>

        <section class="comments" aria-labelledby="comments-heading">
            <h3 id="comments-heading">Comments</h3>
            <ul class="comment-list"></ul>
        </section>
    `;
    const postContainer = document.querySelector(".blog-post-container");
    if (!postContainer) {
        console.error("Blog post container not found.");
        return;
    }
    postContainer.appendChild(postElement);

    getCommentsForPost(post.id).then(comments => {
        renderComments(post, comments, postElement);
    }).catch(error => {
        console.error("Error fetching comments:", error);
    });
}

/** Renders comments for a specific post.
 * @param {Post} post 
 * @param {Comment[]} comments 
 * @param {HTMLElement} postElement
*/
function renderComments(post, comments, postElement) {
    const commentList = postElement.querySelector(".comment-list");
    comments.forEach(comment => {
        const li = document.createElement("li");
        li.className = "comment";
        li.innerHTML = `
            <p class="comment-author">${comment.author}</p>
            <p class="comment-text">${comment.text}</p>
        `;
        commentList.appendChild(li);
    });

    if (comments.length === 0) {
        commentList.innerHTML = "<li class='no-comments'>No comments yet.</li>";
    }
}