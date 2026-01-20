/**
 * @typedef {Object} Comment
 * @property {number} id - Unique identifier for comment post
 * @property {number} postId - Identifier for the post connected to the comment
 * @property {string} author - The author of the comment
 * @property {string} text - The text content of the comment
 * @property {string} date - The date of when the comment was created 
 */


/**
 * Comment data structure
 * @type {Comment[]}
 */
export const comments = [
    {
        id: 1,
        postId: 1,
        author: "Vera",
        text: "This explanation of closures finally made it click for me!",
        date: "2024-05-12"
    },
    {
        id: 2,
        postId: 1,
        author: "Pontus",
        text: "Great examples, especially the part about private variables.",
        date: "2024-05-13"
    },
    {
        id: 3,
        postId: 2,
        author: "Millaray",
        text: "Hooks felt scary before, this made them feel approachable.",
        date: "2024-06-16"
    },
    {
        id: 4,
        postId: 2,
        author: "Mario",
        text: "Would love a follow-up post about custom hooks!",
        date: "2024-06-17"
    }
];
