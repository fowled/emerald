import Discord from "discord.js";
import glob from "fast-glob";
import chalk from "chalk";

import { connectWS } from "@/connection/websocket";

import { create } from "@/utils/slashCmds";
import { getConfig } from "@/utils/config";
import { log } from "@/utils/logger";

import { pb } from "@/index";

module.exports = {
    name: "ready",
    once: true,

    async execute(Client: Discord.Client) {
        const { pocketbase_mail, pocketbase_pwd } = await getConfig();

        await pb.admins.authWithPassword(pocketbase_mail, pocketbase_pwd);

        const fetchCommands = await Client.application.commands.fetch();

        const getFileCommands = glob.sync("src/commands/**/*.ts");

        if (fetchCommands.size !== getFileCommands.length) {
            await create(Client);
        }

        Client.user.setActivity({ name: "/status", type: 0 });

        log(`${chalk.yellow("logged in")} as ${chalk.cyanBright(Client.user.tag)}`);

        connectWS(Client);
    },
};
