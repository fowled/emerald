import Discord from "discord.js";
import glob from "fast-glob";

import { log } from "./logger";

export async function create(client: Discord.Client) {
    const commandFiles = glob.sync("src/commands/*.ts");

    await Promise.all(
        commandFiles.map(async (file) => {
            const command = await import(file);

            const commandObject = {
                name: command.default.name,
                description: command.default.description,
            };

            if (command.default.options) {
                Object.assign(commandObject, { options: command.default.options });
            }

            if (command.default.subcommands) {
                Object.assign(commandObject, { options: command.default.subcommands });
            }

            await client.application.commands.create(commandObject);

            log(`${command.default.name} has been created`);
        })
    );
}

export async function remove(client: Discord.Client) {
    await client.application.commands.fetch().then((cmd) =>
        cmd.forEach(async (cmd) => {
            await cmd.delete();

            log(`${cmd.name} has been deleted`);
        })
    );
}
