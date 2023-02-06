import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Message,
} from "discord.js";

import { serverStatus } from "@/index";

import { StatusEnum } from "@/types/Status";

export async function Server(interaction: ChatInputCommandInteraction | ButtonInteraction | Message) {
    const status = serverStatus.get("status");

    const display = {
        [StatusEnum.Online]: { text: "Ouvert", emoji: "🟢", color: "Green" },
        [StatusEnum.Starting]: { text: "Démarrage", emoji: "🟠", color: "Orange" },
        [StatusEnum.Preparing]: { text: "Préparation", emoji: "🟠", color: "Orange" },
        [StatusEnum.Loading]: { text: "Chargement", emoji: "🟠", color: "Orange" },
        [StatusEnum.Starting]: { text: "Démarre", emoji: "🟠", color: "Orange" },
        [StatusEnum.Offline]: { text: "Fermé", emoji: "🔴", color: "Red" },
        [StatusEnum.Stopping]: { text: "Fermeture", emoji: "🔴", color: "Red" },
        [StatusEnum.Saving]: { text: "Sauvegarde", emoji: "🔴", color: "Red" },
    };

    const currentDisplay = display[status.code.toString()];

    const embed = new EmbedBuilder()
        .setDescription(null)
        .addFields(
            { name: "Statut", value: `${currentDisplay.emoji} ${currentDisplay.text}`, inline: true },
            { name: "Dernière update", value: `<t:${Math.floor(new Date().getTime() / 1000)}:R>`, inline: true }
        )
        .setColor(currentDisplay.color);

    if (status?.players?.length > 0) {
        embed.addFields([
            {
                name: "Joueurs",
                value: `\`${status.players.join("\n")}\``,
                inline: true,
            },
        ]);
    }

    if (status.countdown) {
        const date = new Date().getTime();

        embed.addFields([
            {
                name: "Fermeture",
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
