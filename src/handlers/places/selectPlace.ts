import { ButtonInteraction, Client, StringSelectMenuInteraction } from "discord.js";

import { menu, controls, actions, embed } from "@/components/Places";

import { clientInteractions } from "@/index";

module.exports = {
    name: "selectPlace",

    async execute(Client: Client, interaction: StringSelectMenuInteraction | ButtonInteraction) {
        let id: string;

        if (interaction instanceof StringSelectMenuInteraction) {
            id = (interaction as StringSelectMenuInteraction).values.at(-1);
        } else {
            id = (interaction as ButtonInteraction).customId.split("_").at(-1); // from refresh
        }

        if (id === "null") {
            return clientInteractions.get("places").execute(Client, interaction as null, null);
        }

        try {
            return interaction.editReply({
                content: null,
                embeds: [await embed(id)],
                components: [await menu(), await controls(id), await actions(id)],
            });
        } catch (err) {
            return clientInteractions.get("places").execute(Client, interaction as null, null);
        }
    },
};
