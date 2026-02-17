// API facade: use real `post_json_service` during development, but
// use `mock_service` only for production builds or when running tests.
import * as realService from "./post_json_service.js";
import * as mockService from "./mock_service.js";

const isTest =
    typeof process !== "undefined" &&
    process.env &&
    process.env.VITEST === "true";
const isProd = import.meta.env && import.meta.env.PROD;

const impl = isTest || isProd ? mockService : realService;

export const getPosts = (...args) => impl.getPosts(...args);
export const getPost = (...args) => impl.getPost(...args);
export const createPost = (...args) => impl.createPost(...args);
export const getCommentsForPost = (...args) => impl.getCommentsForPost(...args);
export const addCommentToPost = (...args) => impl.addCommentToPost(...args);
export const login = (...args) => impl.login(...args);
export const checkAuth = (...args) => impl.checkAuth(...args);
