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

const locales = i18n("places");

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
        options.push({
            label: place.description,
            description: place.dimension.charAt(0).toUpperCase() + place.dimension.slice(1),
            value: place.place_id.toString(),
        });
    }

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("place_select")
            .setPlaceholder(locales.selectMenuPlaceholder)
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
                .setLabel(locales.modalDescriptionInput)
                .setStyle(TextInputStyle.Short)
                .setRequired(edit ? false : true)
        ),

        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId("modal_place_dimension")
                .setLabel(locales.modalDimensionInput)
                .setStyle(TextInputStyle.Short)
                .setRequired(edit ? false : true)
        ),

        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId("modal_place_x")
                .setLabel(locales.modalXInput)
                .setStyle(TextInputStyle.Short)
                .setRequired(edit ? false : true)
        ),

        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId("modal_place_y")
                .setLabel(locales.modalYInput)
                .setStyle(TextInputStyle.Short)
                .setRequired(edit ? false : true)
        ),

        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId("modal_place_z")
                .setLabel(locales.modalZInput)
                .setStyle(TextInputStyle.Short)
                .setRequired(edit ? false : true)
        )
    );

export const actions = async (id: string) => {
    filter(await place(id));

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`place_add_modal`).setStyle(3).setLabel(locales.addButton).setEmoji("➕"),

        new ButtonBuilder()
            .setCustomId(`place_edit_modal_${id}`)
            .setStyle(1)
            .setLabel(locales.editButton)
            .setEmoji("✏️"),

        new ButtonBuilder().setCustomId(`place_delete_${id}`).setStyle(4).setLabel(locales.deleteButton).setEmoji("🗑️")
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
                name: locales.coordinatesLabel,
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
