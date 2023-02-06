import { JSDOM } from "jsdom";
import fs from "fs";

export async function extractToken() {
    const config = await import("config.json");

    const page = await fetch("https://aternos.org/servers/", {
        headers: {
            cookie: `ATERNOS_SESSION=${config.aternos_session}`,
        },
    }).then((res) => res.text());

    const parser = new JSDOM(page);

    const window = globalThis;

    const locateTokenScriptTag = parser.window.document.head.querySelectorAll("script").item(3).innerHTML;

    eval(locateTokenScriptTag);

    const aternos_token: string = window["AJAX_TOKEN"];

    let success: boolean;

    if (aternos_token !== null && typeof aternos_token === "string") {
        fs.writeFileSync("config.json", JSON.stringify({ ...config.default, aternos_token }, null, 4));

        return (success = true);
    } else {
        return (success = false);
    }
}
