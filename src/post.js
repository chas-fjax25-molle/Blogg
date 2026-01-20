import { blogPosts } from "./posts.js";
import { comments } from "./comments.js";

blogPage();

/**
 * Handles the blog post page rendering
*/
function blogPage() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("id")) {
        const postId = parseInt(params.get("id"));
        const post = blogPosts.find(p => p.id === postId);
        if (post) {
            renderFullPost(post);
        } else {
            const postContainer = document.querySelector(".blog-post-container");
            postContainer.innerHTML = "<p alt='Blog post not found.', class='missing-post'>Blog post not found.</p>";
        }
    } else {
        window.location.href = "index.html";
    }
}

/**
 * Renders the full blog post on its separate page.
 * @param {BlogPost} post 
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

    const commentList = postElement.querySelector(".comment-list");
    const postComments = comments.filter(c => c.postId === post.id);
    postComments.forEach(comment => {
        const li = document.createElement("li");
        li.className = "comment";
        li.innerHTML = `
            <p class="comment-author">${comment.author}</p>
            <p class="comment-text">${comment.text}</p>
        `;
        commentList.appendChild(li);
    });

    if (postComments.length === 0) {
        commentList.innerHTML = "<li class='no-comments'>No comments yet.</li>";
    }
}