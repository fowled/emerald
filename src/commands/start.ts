import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";

import { clientInteractions } from "@/index";

import { extractToken } from "@/lib/extractToken";
import { startServer } from "@/lib/startServer";

module.exports = {
    name: "start",
    description: "Démarre le serveur",
    category: "misc",

    async execute(Client: Client, interaction: ChatInputCommandInteraction, args: string[]) {
        const success = await startServer();

        switch (success) {
            case 1:
                const bootedUp = new EmbedBuilder()
                    .setDescription("<:yes:835565213498736650> Le serveur a démarré !")
                    .setColor("Green");

                await interaction.editReply({ embeds: [bootedUp] });
                break;

            case 2:
                const alreadyLaunched = new EmbedBuilder()
                    .setDescription("<:no:835565213322575963> Le serveur est déjà allumé !")
                    .setColor("Red");

                await interaction.editReply({ embeds: [alreadyLaunched] });
                break;

            case 3:
                const invalidToken = new EmbedBuilder()
                    .setDescription(":warning: Le jeton de sécurité est invalide. Essai d'extraction...")
                    .setColor("Orange");

                await interaction.editReply({ embeds: [invalidToken] });

                await extractToken();

                await clientInteractions.get("start").execute(Client, interaction, args);
                break;
        }
    },
};
