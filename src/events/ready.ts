import Discord from "discord.js";
import chalk from "chalk";

import { connectWS } from "@/connection/websocket";

import { create } from "@/utils/slashCmds";
import { log } from "@/utils/logger";

module.exports = {
    name: "ready",
    once: true,

    async execute(Client: Discord.Client) {
        log(`${chalk.yellow("logged in")} as ${chalk.cyanBright(Client.user.tag)}`);

        const fetchCommands = await Client.application.commands.fetch();
        
        if (fetchCommands.size === 0) {
            await create(Client);
        }

        connectWS(Client);

        Client.user.setActivity({ name: "/status", type: 0 });
    },
};
