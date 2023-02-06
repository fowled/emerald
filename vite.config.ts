import { defineConfig } from "vite";

export default defineConfig({
    test: {
        include: ["./src/tests/**/*.test.ts"],
        environment: "node",
        deps: {},
    },
});
