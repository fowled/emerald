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

import { Status } from "@/types/Status";

const { online, starting, preparing, loading, offline, stopping, saving, label, update, players, countdown } = i18n("server");

export async function Server(interaction: ChatInputCommandInteraction | ButtonInteraction | Message) {
    const status = serverStatus.get("status");

    const display = {
        [Status.Online]: { text: online, emoji: "🟢", color: "Green" },
        [Status.Starting]: { text: starting, emoji: "🟠", color: "Orange" },
        [Status.Preparing]: { text: preparing, emoji: "🟠", color: "Orange" },
        [Status.Loading]: { text: loading, emoji: "🟠", color: "Orange" },
        [Status.Offline]: { text: offline, emoji: "🔴", color: "Red" },
        [Status.Stopping]: { text: stopping, emoji: "🔴", color: "Red" },
        [Status.Saving]: { text: saving, emoji: "🔴", color: "Red" },
    };

    const currentDisplay = display[status.code.toString()];

    const embed = new EmbedBuilder()
        .setDescription(null)
        .addFields(
            {
                name: label,
                value: `${currentDisplay.emoji} ${currentDisplay.text}`,
                inline: true,
            },

            {
                name: update,
                value: `<t:${Math.floor(new Date().getTime() / 1000)}:R>`,
                inline: true,
            }
        )
        .setColor(currentDisplay.color);

    if (status?.players?.length > 0) {
        embed.addFields({
            name: players,
            value: `\`${status.players.join("\n")}\``,
            inline: true,
        });
    }

    if (status.countdown) {
        const date = new Date().getTime();

        embed.addFields({
            name: countdown,
            value: `<t:${Math.floor((date + status.countdown * 1000) / 1000)}:R>`,
            inline: true,
        });
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
