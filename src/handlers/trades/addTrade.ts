import { ButtonInteraction, Client, ModalSubmitInteraction } from "discord.js";

import { pb } from "@/index";

import { modal, embed, controls, actions } from "@/components/Trades";

import { i18n } from "@/utils/i18n";

import type { Place } from "@/types/DB";

module.exports = {
    name: "addTrade",

    async execute(_Client: Client, interaction: ButtonInteraction | ModalSubmitInteraction) {
        const instruction = interaction.customId.split("_").at(2);

        const getPlaceId = interaction.customId.replace(/[^0-9]/g, "");

        switch (instruction) {
            case "modal":
                modal.setCustomId("trades_add_submitted_" + getPlaceId).setTitle(i18n("modalAddTitle", "trades"));

                await (interaction as ButtonInteraction).showModal(modal);
                break;

            case "submitted":
                const getPlace = await pb.collection("places").getFirstListItem<Place>(`place_id=${getPlaceId}`);

                const [receiving, giving] = (interaction as ModalSubmitInteraction).fields.fields.map(
                    (field) => field.value
                );

                const createTrade = await pb.collection("trades").create({ receiving, giving });

                await pb.collection("places").update(getPlace.id, { trades: [...getPlace.trades, createTrade.id] });

                await interaction.editReply({
                    content: null,
                    embeds: [await embed(getPlaceId)],
                    components: [await controls(getPlaceId), await actions(getPlaceId)],
                });
                break;
        }
    },
};
