import { describe, it, expect, vi, beforeEach } from "vitest";
import * as mockService from "../mock_service.js";

const mockDb = {
    posts: [{ id: "1", title: "a" }],
    comments: [{ id: "1", postId: 1, author: "t", text: "hi" }],
};

describe("mock_service", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockDb),
                }),
            ),
        );
    });

    it("returns posts from mock DB", async () => {
        const posts = await mockService.getPosts();
        expect(posts).toBeInstanceOf(Array);
        expect(posts.length).toBeGreaterThan(0);
    });

    it("simulates adding a comment", async () => {
        const newComment = { postId: 1, author: "x", text: "hello" };
        const saved = await mockService.addCommentToPost(newComment);
        expect(saved).toMatchObject(newComment);
        expect(saved.id).toBeTruthy();
    });
});
