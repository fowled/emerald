import { test, expect } from "vitest";

import { extractToken } from "src/lib/extractToken";

test("Extract token", async () => {
    expect(await extractToken()).toBe(true);
});
