import {
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
} from "discord.js";

import { pb } from "@/index";

import type { Place, Trade } from "@/types/DB";

const fetchPlace = async (placeId: string) => {
    return await pb.collection("places").getFirstListItem<Place>(`place_id=${placeId}`, { expand: "trades" });
};

const filter = (place: Place) => {
    if (place.trades.length === 0) {
        throw new Error("No trade available");
    }
};

export const modal = new ModalBuilder().addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
            .setCustomId("modal_first_value")
            .setLabel("Que propose le villageois ?")
            .setStyle(TextInputStyle.Short)
    ),

    new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
            .setCustomId("modal_second_value")
            .setLabel("Que doit-on lui donner en échange ?")
            .setStyle(TextInputStyle.Short)
    )
);

export const embed = async (placeId: string) => {
    const place = await fetchPlace(placeId);

    filter(place);

    const embed = new EmbedBuilder().setColor("Random").setImage(place.image);

    for (const trade of place.expand.trades) {
        embed.addFields({
            name: trade.receiving,
            value: `➡️ ${trade.giving}`,
            inline: true,
        });
    }

    return embed;
};

export const menu = async (placeId: string) => {
    const place = await fetchPlace(placeId);

    filter(place);

    let selectMenuOptions = [];

    for (const trade of place.expand.trades) {
        selectMenuOptions = [
            ...selectMenuOptions,
            {
                label: trade.receiving,
                description: trade.giving,
                value: trade.id,
            },
        ];
    }

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder().setOptions(selectMenuOptions).setMinValues(1).setMaxValues(1)
    );
};

export const actions = async (placeId: string) => {
    filter(await fetchPlace(placeId));

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`trades_add_modal_${placeId}`).setLabel("Ajouter").setEmoji("➕").setStyle(3),
        new ButtonBuilder().setCustomId(`trades_edit_${placeId}`).setLabel("Modifier").setEmoji("✏️").setStyle(1),
        new ButtonBuilder().setCustomId(`trades_delete_${placeId}`).setLabel("Supprimer").setEmoji("🗑️").setStyle(4)
    );
};

export const controls = async (placeId: string) => {
    filter(await fetchPlace(placeId));

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`place_select_${placeId}`).setLabel("Général").setEmoji("ℹ️").setStyle(1),
        new ButtonBuilder().setCustomId(`trades_refresh_${placeId}`).setEmoji("🔄").setStyle(1)
    );
};
