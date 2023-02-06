import {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder,
    ButtonBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
} from "discord.js";

import { pb } from "@/index";

import { i18n } from "@/utils/i18n";

import type { Place } from "@/types/DB";

const places = async () => await pb.collection("places").getFullList<Place>(200, { sort: "-dimension" });

const place = async (id: string) => await pb.collection("places").getFirstListItem<Place>(`place_id=${id}`);

const filter = (place: Place) => {
    if (!place) {
        throw new Error("Can't find place");
    }
};

export const menu = async () => {
    let options = [];

    for (const place of await places()) {
        options = [
            ...options,
            {
                label: place.description,
                description: place.dimension.charAt(0).toUpperCase() + place.dimension.slice(1),
                value: place.place_id.toString(),
            },
        ];
    }

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("place_select")
            .setPlaceholder(i18n("selectMenuPlaceholder", "places"))
            .addOptions(options)
            .setMinValues(1)
            .setMaxValues(1)
    );
};

export const modal = (edit: boolean) =>
    new ModalBuilder().addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId("modal_place_description")
                .setLabel(i18n("modalDescriptionInput", "places"))
                .setStyle(TextInputStyle.Short)
                .setRequired(edit ? false : true)
        ),

        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId("modal_place_dimension")
                .setLabel(i18n("modalDimensionInput", "places"))
                .setStyle(TextInputStyle.Short)
                .setRequired(edit ? false : true)
        ),

        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId("modal_place_x")
                .setLabel(i18n("modalXInput", "places"))
                .setStyle(TextInputStyle.Short)
                .setRequired(edit ? false : true)
        ),

        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId("modal_place_y")
                .setLabel(i18n("modalYInput", "places"))
                .setStyle(TextInputStyle.Short)
                .setRequired(edit ? false : true)
        ),

        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId("modal_place_z")
                .setLabel(i18n("modalZInput", "places"))
                .setStyle(TextInputStyle.Short)
                .setRequired(edit ? false : true)
        )
    );

export const actions = async (id: string) => {
    filter(await place(id));

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`place_add_modal`)
            .setStyle(3)
            .setLabel(i18n("addButton", "places"))
            .setEmoji("➕"),

        new ButtonBuilder()
            .setCustomId(`place_edit_modal_${id}`)
            .setStyle(1)
            .setLabel(i18n("editButton", "places"))
            .setEmoji("✏️"),

        new ButtonBuilder()
            .setCustomId(`place_delete_${id}`)
            .setStyle(4)
            .setLabel(i18n("deleteButton", "places"))
            .setEmoji("🗑️")
    );
};

export const controls = async (id: string) => {
    filter(await place(id));

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`trades_select_${id}`).setStyle(1).setLabel("Trades").setEmoji("🤝"),
        new ButtonBuilder().setCustomId(`place_refresh_${id}`).setStyle(1).setEmoji("🔄")
    );
};

export const embed = async (id: string) => {
    const fetchPlace = await place(id);

    filter(fetchPlace);

    const embed = new EmbedBuilder()
        .setFields(
            { name: "Description", value: fetchPlace.description, inline: true },
            {
                name: "Dimension",
                value: fetchPlace.dimension.charAt(0).toUpperCase() + fetchPlace.dimension.slice(1),
                inline: true,
            },
            {
                name: i18n("coordinatesLabel", "places"),
                value: `\`${fetchPlace.x}\`, \`${fetchPlace.y}\`, \`${fetchPlace.z}\``,
                inline: true,
            }
        )
        .setColor("Random");

    if (fetchPlace.image) {
        embed.setImage(fetchPlace.image);
    }

    return embed;
};
