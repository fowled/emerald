import fs from "fs";

import { error } from "./logger";

import type { Config } from "@/types/Config";

export async function getConfig() {
    try {
        return (await import("config.json")) as Config;
    } catch (err) {
        error("Config file not found. Aborting...");

        process.exit(0);
    }
}

export function writeConfig(content: object) {
    return fs.writeFileSync("config.json", JSON.stringify(content, null, 4));
}
