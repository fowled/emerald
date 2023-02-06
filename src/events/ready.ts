import Discord from "discord.js";
import chalk from "chalk";

import { connectWS } from "@/connection/websocket";

import { log } from "@/utils/logger";

module.exports = {
    name: "ready",
    once: true,

    async execute(Client: Discord.Client) {
        log(`${chalk.yellow("logged in")} as ${chalk.cyanBright(Client.user.tag)}`);

        connectWS(Client);

        Client.user.setActivity({ name: "/status", type: 0 });
    },
};
