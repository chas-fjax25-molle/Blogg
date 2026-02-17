// Chooses between real API (json-server) and mock read-only API when built for production
let impl;
if (import.meta.env && import.meta.env.PROD) {
    impl = await import("./mock_service.js");
} else {
    impl = await import("./post_json_service.js");
}

export const getPosts = impl.getPosts;
export const getPost = impl.getPost;
export const createPost = impl.createPost;
export const getCommentsForPost = impl.getCommentsForPost;
export const addCommentToPost = impl.addCommentToPost;
export const login = impl.login;
export const checkAuth = impl.checkAuth;
