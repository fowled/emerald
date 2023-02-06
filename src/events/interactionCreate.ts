import { Client, Interaction, ApplicationCommandOptionType } from "discord.js";

import { events, clientInteractions } from "@/index";

import { warn } from "@/utils/logger";

module.exports = {
    name: "interactionCreate",

    async execute(Client: Client, interaction: Interaction) {
        if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
            if (!interaction.customId.includes("modal")) {
                await interaction.deferUpdate();
            }

            const command = interaction.customId.split("_").slice(0, 2).join("_");

            switch (command) {
                case "place_select":
                    events.emit("selectPlace", interaction);
                    break;

                case "place_add":
                    events.emit("addPlace", interaction);
                    break;

                case "place_edit":
                    events.emit("editPlace", interaction);
                    break;

                case "place_delete":
                    events.emit("deletePlace", interaction);
                    break;

                case "place_refresh":
                    events.emit("selectPlace", interaction);
                    break;

                case "trades_select":
                    events.emit("trades", interaction);
                    break;

                case "trades_refresh":
                    events.emit("trades", interaction);
                    break;

                case "trades_edit":
                    events.emit("editTrade", interaction);
                    break;

                case "trades_delete":
                    events.emit("deleteTrade", interaction);
                    break;

                case "trades_add":
                    events.emit("addTrade", interaction);
                    break;

                case "refresh_server":
                    events.emit("refreshServer", interaction);
                    break;
            }
        }

        if (
            !interaction.isChatInputCommand() ||
            !interaction.isCommand() ||
            !clientInteractions.has(interaction.commandName)
        )
            return;

        const args = interaction.options.data
            .filter((data) => data.type !== ApplicationCommandOptionType.Subcommand)
            .map((opt) => opt.value.toString());

        const command = interaction.commandName;

        const commandInteraction = clientInteractions.get(command);

        await interaction.deferReply({ ephemeral: commandInteraction.ephemeral });

        try {
            await commandInteraction.execute(Client, interaction, args);
        } catch (err) {
            warn(err);
        }
    },
};
