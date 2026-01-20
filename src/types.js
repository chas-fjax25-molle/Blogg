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
export { };