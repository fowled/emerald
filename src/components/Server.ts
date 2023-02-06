import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Message,
} from "discord.js";

import { serverStatus } from "@/index";

import { i18n } from "@/utils/i18n";

import { StatusEnum } from "@/types/Status";

export async function Server(interaction: ChatInputCommandInteraction | ButtonInteraction | Message) {
    const status = serverStatus.get("status");

    const display = {
        [StatusEnum.Online]: { text: i18n("onlineStatus", "server"), emoji: "🟢", color: "Green" },
        [StatusEnum.Starting]: { text: i18n("startingStatus", "server"), emoji: "🟠", color: "Orange" },
        [StatusEnum.Preparing]: { text: i18n("preparingStatus", "server"), emoji: "🟠", color: "Orange" },
        [StatusEnum.Loading]: { text: i18n("loadingStatus", "server"), emoji: "🟠", color: "Orange" },
        [StatusEnum.Offline]: { text: i18n("offlineStatus", "server"), emoji: "🔴", color: "Red" },
        [StatusEnum.Stopping]: { text: i18n("stoppingStatus", "server"), emoji: "🔴", color: "Red" },
        [StatusEnum.Saving]: { text: i18n("savingStatus", "server"), emoji: "🔴", color: "Red" },
    };

    const currentDisplay = display[status.code.toString()];

    const embed = new EmbedBuilder()
        .setDescription(null)
        .addFields(
            {
                name: i18n("statusLabel", "server"),
                value: `${currentDisplay.emoji} ${currentDisplay.text}`,
                inline: true,
            },

            {
                name: i18n("lastUpdateLabel", "server"),
                value: `<t:${Math.floor(new Date().getTime() / 1000)}:R>`,
                inline: true,
            }
        )
        .setColor(currentDisplay.color);

    if (status?.players?.length > 0) {
        embed.addFields([
            {
                name: i18n("playersLabel", "server"),
                value: `\`${status.players.join("\n")}\``,
                inline: true,
            },
        ]);
    }

    if (status.countdown) {
        const date = new Date().getTime();

        embed.addFields([
            {
                name: i18n("countdownLabel", "server"),
                value: `<t:${Math.floor((date + status.countdown * 1000) / 1000)}:R>`,
                inline: true,
            },
        ]);
    }

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setEmoji("🔄").setCustomId(`refresh_server`).setStyle(1)
    );

    if (interaction instanceof Message) {
        return await interaction.edit({ content: null, embeds: [embed], components: null });
    } else {
        return await interaction.editReply({ content: null, embeds: [embed], components: [button] });
    }
}
