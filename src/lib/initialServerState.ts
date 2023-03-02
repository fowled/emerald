import { JSDOM } from "jsdom";

import { statusChange } from "@/connection/statusChange";

import { Status } from "@/types/Status";

import { getConfig } from "@/utils/config";

import type { Client } from "discord.js";
import type WebSocket from "ws";

const config = await getConfig();

export async function checkInitialServerState(websocket: WebSocket, Client: Client) {
    const request = await fetch("https://aternos.org/players/", {
        headers: {
            cookie: `ATERNOS_SESSION=${config.aternos_session}; ATERNOS_SERVER=${config.aternos_server_id}`,
        },
    }).then((res) => res.text());

    const parseReq = new JSDOM(request);

    const getStatus = parseReq.window.document.getElementsByClassName("navigation-server").item(0).classList.item(1);
    const getPlayers = parseReq.window.document.getElementsByClassName("playername");

    const playerlist: string[] = [];

    if (getPlayers.length > 0) {
        for (const player of getPlayers) {
            playerlist.push(player.innerHTML.trim());
        }
    }

    const status = {
        status: Status[getStatus.charAt(0).toUpperCase() + getStatus.slice(1)],
        playerlist,
    };

    return statusChange(status, websocket, Client);
}
