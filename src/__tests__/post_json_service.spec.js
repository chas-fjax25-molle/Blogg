import { describe, it, expect, vi, beforeEach } from "vitest";
import * as realService from "../post_json_service.js";

describe("post_json_service (integration with fetch)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("throws when offline (fetch rejects) for getPosts", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(() => Promise.reject(new Error("network"))),
        );
        await expect(realService.getPosts()).rejects.toThrow();
    });

    it("throws on non-ok response when creating a post", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(() => Promise.resolve({ ok: false, status: 500 })),
        );
        await expect(realService.createPost({ title: "x" })).rejects.toThrow();
    });
});
