import { ButtonInteraction, Client, ModalSubmitInteraction } from "discord.js";

import { modal } from "@/components/Places";

import { pb } from "@/index";

import type { Place } from "@/types/DB";

module.exports = {
    name: "editPlace",

    async execute(_Client: Client, interaction: ButtonInteraction | ModalSubmitInteraction) {
        const places = await pb.collection("places").getFullList<Place>();

        const getPlaceId = interaction.customId.replace(/[^0-9]/g, "");

        const getPlace = places.find((place) => place.place_id === parseInt(getPlaceId));

        const instruction = interaction.customId.split("_").at(2);

        switch (instruction) {
            case "modal":
                const editPlaceModal = modal(true).setCustomId("place_edit_submitted_" + getPlaceId);

                await (interaction as ButtonInteraction).showModal(editPlaceModal);
                break;

            case "submitted":
                const fields = (interaction as ModalSubmitInteraction).fields.fields;

                const place = await pb.collection("places").getFirstListItem<Place>(`place_id=${getPlaceId}`);

                const editData = {};

                for (const [_key, value] of fields) {
                    if (value.value.length > 0) {
                        const extractFieldName = value.customId.split("_").at(-1);

                        if (place[extractFieldName] !== value.value.toLowerCase()) {
                            editData[extractFieldName] = value.value;
                        }
                    }
                }

                await pb.collection("places").update(place.id, editData);

                await interaction.followUp({ content: "J'ai modifié les données de l'endroit :+1:", ephemeral: true });
                break;
        }
    },
};
