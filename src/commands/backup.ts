import { ChatInputCommandInteraction, Client, EmbedBuilder } from "discord.js";

import { createBackup } from "@/lib/createBackup";
import { extractToken } from "@/lib/extractToken";

import { clientInteractions } from "@/index";

module.exports = {
    name: "backup",
    description: "Crée un backup du serveur",
    category: "misc",

    async execute(Client: Client, interaction: ChatInputCommandInteraction, args: string[]) {
        const success = await createBackup();

        switch (success) {
            case 1:
                const backupCreated = new EmbedBuilder()
                    .setDescription("<:yes:835565213498736650> Le backup a bien été crée !")
                    .setColor("Green");

                await interaction.editReply({ embeds: [backupCreated] });
                break;

            case 2:
                const error = new EmbedBuilder()
                    .setDescription("<:no:835565213322575963> Une erreur inconnue est survenue.")
                    .setColor("Red");

                await interaction.editReply({ embeds: [error] });
                break;

            case 3:
                const invalidToken = new EmbedBuilder()
                    .setDescription(":warning: Le jeton de sécurité est invalide. Essai d'extraction...")
                    .setColor("Orange");

                await interaction.editReply({ embeds: [invalidToken] });

                await extractToken();

                await clientInteractions.get("backup").execute(Client, interaction, args);
        }
    },
};
