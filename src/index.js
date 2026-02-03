import { comments } from "./comments.js";
import { createPost, getPosts } from "./post_json_service.js";

/**
 * Renders previews of all blog posts on the main page.
 */
function renderPostPreviews() {
    const postContainer = document.querySelector(".blog-posts");

    if (!postContainer) {
        console.error("Blog posts container not found.");
        return;
    }

    // Clear previous posts
    postContainer.innerHTML = '';

    getPosts().then(posts => {
        posts.forEach(post => {
            renderPostPreview(post, postContainer);
        });
    }).catch(() => {
        postContainer.innerHTML = '<p>Could not load posts.</p>';
    });
}

/**
 * Renders a preview of a single blog post.
 * @param {Object} post
 * @param {HTMLElement} postContainer
 */
function renderPostPreview(post, postContainer) {
    const postComments = comments.filter(
        (comment) => comment.postId === Number(post.id),
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

    // Add event listener for "Read More" button
    const button = postElement.querySelector(".read-more-button");
    button.addEventListener("click", () => {
        window.location.href = `post.html?id=${post.id}`;
    });

    postContainer.appendChild(postElement);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.new-post-form');

    // Render posts on page load
    renderPostPreviews();

    // Handle new post form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Gather form data
        const formData = new FormData(form);
        const postData = {
            title: formData.get('title'),
            author: formData.get('author'),
            category: formData.get('category'),
            content: formData.get('content'),
            excerpt: formData.get('excerpt'),
            image: '', // Handle image upload separately if needed
            date: new Date().toISOString(),
        };

        // Optional: handle image upload if you want to store image as base64 or URL
        // const imageFile = formData.get('image');
        // if (imageFile && imageFile.size > 0) { ... }

        try {
            await createPost(postData);
            form.reset();
            renderPostPreviews(); // Refresh posts list
        } catch (err) {
            alert('Failed to create post.');
        }
    });
});

// Simple login logic for admin.html
document.addEventListener('DOMContentLoaded', () => {
    const isAdminPage = window.location.pathname.endsWith('admin.html');
    const loginModal = document.getElementById('loginModal');
    const adminSection = document.getElementById('adminSection');
    const authBtn = document.getElementById('authBtn');
    const closeBtn = document.querySelector('.close-btn');
    const loginBtn = document.getElementById('loginBtn');

    function isLoggedIn() {
        return localStorage.getItem('isAdminLoggedIn') === 'true';
    }

    function showAdmin() {
        if (adminSection) adminSection.style.display = '';
        if (loginModal) loginModal.style.display = 'none';
        if (loginModal) loginModal.setAttribute('aria-hidden', 'true');
        if (authBtn) authBtn.textContent = 'LOGOUT';
    }

    function showLogin() {
        if (adminSection) adminSection.style.display = 'none';
        if (loginModal) loginModal.style.display = 'block';
        if (loginModal) loginModal.setAttribute('aria-hidden', 'false');
        if (authBtn) authBtn.textContent = 'LOGIN';
    }

    if (isAdminPage) {
        if (isLoggedIn()) {
            showAdmin();
        } else {
            showLogin();
        }

        if (authBtn) {
            authBtn.onclick = () => {
                if (isLoggedIn()) {
                    localStorage.removeItem('isAdminLoggedIn');
                    window.location.reload();
                } else {
                    showLogin();
                }
            };
        }

        if (closeBtn) {
            closeBtn.onclick = () => {
                loginModal.style.display = 'none';
                loginModal.setAttribute('aria-hidden', 'true');
            };
        }

        if (loginBtn) {
            loginBtn.onclick = (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                // Simple check, replace with real authentication
                if (username === 'admin' && password === 'password') {
                    localStorage.setItem('isAdminLoggedIn', 'true');
                    showAdmin();
                } else {
                    alert('Invalid credentials');
                }
            };
        }
    }
});
