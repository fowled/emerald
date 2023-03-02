import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client, TextChannel } from "discord.js";

import { getConfig, writeConfig } from "@/utils/config";
import { log } from "@/utils/logger";
import { i18n } from "@/utils/i18n";

const { description, status, interchat, alreadyRan, missingPerm, textChannel, info, success, error } = i18n("setup");

module.exports = {
    name: "setup",
    description,
    category: "misc",
    options: [
        {
            name: "status",
            type: ApplicationCommandOptionType.Channel,
            description: status,
            required: true,
        },

        {
            name: "interchat",
            type: ApplicationCommandOptionType.Channel,
            description: interchat,
            required: true,
        },
    ],

    async execute(Client: Client, interaction: ChatInputCommandInteraction) {
        const config = await getConfig();

        if (config.setup) {
            return interaction.editReply(alreadyRan);
        }

        const fetchMe = await interaction.guild.members.fetchMe();

        if (!fetchMe.permissions.has("ManageWebhooks")) {
            return interaction.editReply(missingPerm);
        }

        let [status, interchat] = interaction.options.data.map(
            async (c) => await interaction.guild.channels.fetch(c.channel.id)
        ) as Promise<TextChannel>[];

        if (![status, interchat].every(async (el) => (await el) instanceof TextChannel)) {
            return await interaction.editReply(textChannel);
        }

        const statusMsg = await (await status).send(info);

        const webhook =
            (await interaction.guild.fetchWebhooks()).find((wb) => wb.owner.id === Client.user.id) ??
            (await (await interchat).createWebhook({ name: `${Client.user.username} - interchat` }));

        try {
            writeConfig({
                ...config.default,
                setup: true,
                discord_webhook: webhook.url,
                chat_channel: (await interchat).id,
                updates_channel: (await status).id,
                updates_message: statusMsg.id,
            });

            await interaction.editReply(success);

            log(["Successfully saved the config file.", "Restart the bot to get started."].join("\n"));

            return process.exit(0);
        } catch (err) {
            return interaction.editReply(error);
        }
    },
};
