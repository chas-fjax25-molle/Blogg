/**
 * @typedef {Object} BlogPost
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
 * Blog post data structure
 * @type {BlogPost[]}
 */
const blogPosts = [
    {
        id: 1,
        title: "Understanding JavaScript Closures",
        excerpt: "A deep dive into closures in JavaScript and how they work under the hood.",
        content: "Closures are a fundamental concept in JavaScript that allow functions to access variables from an enclosing scope, even after that scope has closed. This is particularly useful for creating private variables and functions. In this post, we will explore how closures work, with examples and practical use cases.",
        author: "Jane Doe",
        date: "2024-05-10",
        category: "JavaScript",
        image: "placeholder.jpg"
    },
    {
        id: 2,
        title: "Getting Started with React Hooks",
        excerpt: "Learn how to use React Hooks to manage state and side effects in functional components.",
        content: "React Hooks revolutionized the way we write React components by allowing us to use state and other React features without writing a class. In this guide, we'll cover useState, useEffect, and custom hooks with practical examples.",
        author: "John Smith",
        date: "2024-06-15",
        category: "React",
        image: "placeholder.jpg"
    },
    {
        id: 3,
        title: "CSS Grid Layout Essentials",
        excerpt: "Master the fundamentals of CSS Grid for creating responsive layouts.",
        content: "CSS Grid is a powerful layout system that makes it easy to create complex, responsive web designs. This tutorial covers grid containers, grid items, and how to use grid template areas effectively.",
        author: "Emily Johnson",
        date: "2024-07-20",
        category: "CSS",
        image: "placeholder.jpg"
    },
    {
        id: 4,
        title: "Node.js Performance Optimization",
        excerpt: "Tips and techniques for improving your Node.js application performance.",
        content: "Performance is critical for any Node.js application. In this post, we explore clustering, caching strategies, database query optimization, and profiling tools to help you build faster applications.",
        author: "Michael Chen",
        date: "2024-08-05",
        category: "Node.js",
        image: "placeholder.jpg"
    },
    {
        id: 5,
        title: "Introduction to TypeScript",
        excerpt: "Discover how TypeScript adds type safety to your JavaScript projects.",
        content: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Learn about type annotations, interfaces, generics, and how TypeScript can help you catch bugs before runtime.",
        author: "Sarah Williams",
        date: "2024-09-12",
        category: "TypeScript",
        image: "placeholder.jpg"
    },
    {
        id: 6,
        title: "REST API Best Practices",
        excerpt: "Build better APIs with these proven design patterns and conventions.",
        content: "Creating a well-designed REST API is essential for modern web applications. This article covers naming conventions, HTTP methods, status codes, versioning, and authentication strategies.",
        author: "David Brown",
        date: "2024-10-18",
        category: "API Design",
        image: "placeholder.jpg"
    },
    {
        id: 7,
        title: "Async/Await in JavaScript",
        excerpt: "Simplify asynchronous code with async/await syntax.",
        content: "Async/await makes working with promises more intuitive and readable. We'll explore how to handle asynchronous operations, error handling with try/catch, and common patterns for concurrent requests.",
        author: "Lisa Martinez",
        date: "2024-11-25",
        category: "JavaScript",
        image: "placeholder.jpg"
    },
    {
        id: 8,
        title: "Web Security Fundamentals",
        excerpt: "Protect your web applications from common security vulnerabilities.",
        content: "Security should be a priority in every web application. This comprehensive guide covers XSS, CSRF, SQL injection, authentication best practices, and how to implement secure headers.",
        author: "Robert Taylor",
        date: "2024-12-03",
        category: "Security",
        image: "placeholder.jpg"
    }
];

// Determine which page to render based on the current URL
const currentPage = window.location.pathname;
if (currentPage === "/index.html") {
    mainPage();
} else if (currentPage === "/post.html") {
    blogPage();
} else {
    // Do nothing
}

/**
 * Handles the main page rendering
*/
function mainPage() {
    renderPostPreviews();
}

/**
 * Renders previews of all blog posts on the main page.
*/
function renderPostPreviews() {
    if (!document.querySelector(".blog-posts")) {
        console.error("Blog posts container not found.");
        return;
    }

    blogPosts.forEach(post => {
        renderPostPreview(post);
    });
}

/**
 * Renders a preview of a single blog post.
 * @param {BlogPost} post 
*/
function renderPostPreview(post) {
    const postContainer = document.querySelector(".blog-posts");
    const postElement = document.createElement("article");
    postElement.className = "post-preview";
    postElement.id = `post-${post.id}`;
    postElement.innerHTML = `
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <img class="post-image" src="img/${post.image}" alt="Blog Post Image" width="100" height="100"/>
        <button class="read-more-button" onclick="window.location.href='post.html?id=${post.id}'" aria-label="Read More">Read More</button>
    `;
    postContainer.appendChild(postElement);
}

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
            // TODO
            console.error("Blog post not found.");
        }
    } else {
        // TODO
        console.error("No ID parameter found in the URL.");
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
            <img class="post-image" src="img/${post.image}" alt="Blog Post Image" width="300" height="200"/>
            <div class="post-meta">
                <p class="post-author">By ${post.author}</p>
                <time class="post-date" datetime="${post.date}">Published on ${post.date}</time>
                <p class="post-category">Category: ${post.category}</p>
            </div>
            <p class="post-content">${post.content}</p>
        </div>
    `;
    const postContainer = document.querySelector(".blog-post-container");
    if (!postContainer) {
        console.error("Blog post container not found.");
        return;
    }
    postContainer.appendChild(postElement);
}