import { Client, Collection } from "discord.js";
import { EventEmitter } from "node:events";
import pocketbase from "pocketbase";
import { resolve } from "path";
import glob from "fast-glob";
import chalk from "chalk";

import { log, warn } from "@/utils/logger";

import type { Command } from "@/types/Command";

const config = await import("config.json");

const client = new Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "GuildMessageReactions", "GuildBans", "MessageContent"],
});

export const pb = new pocketbase("http://137.184.190.118:8090");

export const clientInteractions = new Collection<string, Command>();

export const events = new EventEmitter();

export const serverStatus = new Collection<string, { code: number; players?: string[]; countdown?: number }>();

binder();

await pb.admins.authWithPassword("ma15fo43@gmail.com", config.pocketbase_pwd);

process.on("unhandledRejection", (error: Error) => {
    warn(error);
});

async function binder() {
    const eventFiles = glob.sync("src/events/*.ts");
    const customEventFiles = glob.sync("src/handlers/**/*.ts");
    const commandFiles = glob.sync("src/commands/**/*.ts");

    Promise.all([
        eventFiles.map(async (file) => {
            const event = (await import(resolve(file))).default;

            if (event.once) {
                client.once(event.name, async (...args) => await event.execute(client, ...args));
            } else {
                client.on(event.name, async (...args) => await event.execute(client, ...args));
            }
        }),

        commandFiles.map(async (file) => {
            const command: Command = (await import(resolve(file))).default;

            clientInteractions.set(command.name, command);
        }),

        customEventFiles.map(async (file) => {
            const event = (await import(resolve(file))).default;

            events.on(event.name, async (...args) => await event.execute(client, ...args));
        }),
    ]);

    log(`${chalk.yellow("loaded")} all ${chalk.redBright("commands")} & ${chalk.redBright("events")}`);
}

client.login(config.token);
