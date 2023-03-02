import { JSDOM } from "jsdom";
import fs from "fs";

import { getConfig, writeConfig } from "@/utils/config";

export async function extractToken() {
    const config = await getConfig();

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
        writeConfig({ ...config.default, aternos_token });

        return (success = true);
    } else {
        return (success = false);
    }
}
