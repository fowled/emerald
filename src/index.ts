import { Client, Collection } from "discord.js";
import { EventEmitter } from "node:events";
import pocketbase from "pocketbase";
import glob from "fast-glob";
import chalk from "chalk";

import { parallelMap } from "@/utils/parallelMap";
import { error, log, warn } from "@/utils/logger";
import { getConfig } from "@/utils/config";

import type { Command } from "@/types/Command";
import type { Event } from "@/types/Event";

const config = await getConfig();

const client = new Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "GuildMessageReactions", "GuildBans", "MessageContent"],
});

export const pb = new pocketbase(config.pocketbase_host);

export const clientInteractions = new Collection<string, Command>();

export const events = new EventEmitter();

export const serverStatus = new Collection<string, { code: number; players?: string[]; countdown?: number }>();

main();

async function main() {
    switch (config.setup) {
        case undefined:
            error("Config file not completed. Aborting...");
            process.exit(1);

        case false:
            warn(`You haven't entirely completed the bot setup! Run ${chalk.yellow("/setup")} in your Discord server.`);
            break;
    }

    const toBind = [
        {
            path: "src/events/*.ts",
            handler: (exe: Event) => {
                client[exe.once ? "once" : "on"](exe.name, async (...args) => await exe.execute(client, ...args));
            },
        },

        {
            path: "src/commands/**/*.ts",
            handler: (exe: Command) => {
                clientInteractions.set(exe.name, exe);
            },
        },

        {
            path: "src/handlers/**/*.ts",
            handler: (exe: Event) => {
                events.on(exe.name, async (...args) => await exe.execute(client, ...args));
            },
        },
    ];

    await parallelMap(toBind, async (bind) =>
        parallelMap(glob.sync(bind.path), async (file) => bind.handler((await import(file)).default))
    );

    log(`${chalk.yellow("loaded")} all ${chalk.redBright("commands")} & ${chalk.redBright("events")}`);

    process.on("unhandledRejection", (error: Error) => {
        warn(error);
    });

    await client.login(config.token);
}
