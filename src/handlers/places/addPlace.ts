import { ButtonInteraction, Client, ModalSubmitInteraction } from "discord.js";

import { modal } from "@/components/Places";

import { pb } from "@/index";

import type { Place } from "@/types/DB";

module.exports = {
    name: "addPlace",

    async execute(Client: Client, interaction: ButtonInteraction | ModalSubmitInteraction) {
        const instruction = interaction.customId.split("_").at(2);

        switch (instruction) {
            case "submitted":
                const [description, dimension, x, y, z] = (interaction as ModalSubmitInteraction).fields.fields.map(
                    (field) => field.value
                );

                const places = await pb.collection("places").getFullList<Place>(200, { sort: "+place_id" });

                if (isNaN(parseInt(x)) || isNaN(parseInt(y)) || isNaN(parseInt(z))) {
                    return interaction.followUp({
                        content: "Tes coordonnées n'ont pas l'air valides. Assure-toi de ne rentrer que des nombres.",
                        ephemeral: true,
                    });
                }

                if (!["end", "nether", "overworld"].includes(dimension.toLowerCase())) {
                    return interaction.followUp({
                        content: "La dimension doit être une des suivantes : `overworld`, `nether`, ou `end`",
                        ephemeral: true,
                    });
                }

                const data = {
                    place_id: places.at(-1).place_id + 1,
                    description,
                    dimension: dimension.toLowerCase(),
                    x: parseInt(x),
                    y: parseInt(y),
                    z: parseInt(z),
                };

                await pb.collection("places").create(data);

                await interaction.followUp({
                    content: "C'est tout bon, j'ai ajouté le nouvel endroit ! :+1:",
                    ephemeral: true,
                });
                break;

            case "modal":
                const addPlaceModal = modal(false).setCustomId("place_add_submitted");

                await (interaction as ButtonInteraction).showModal(addPlaceModal);
                break;
        }
    },
};
