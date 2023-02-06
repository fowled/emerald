import { Client, CommandInteraction } from "discord.js";

export interface Command {
    name: string;
    description: string;
    category: string;
    ephemeral?: boolean;
    options?: [{ name: string; type: number; description: string; required: boolean }];
    subcommands?: [
        {
            name: string;
            description: string;
            type: number;
            options?: [{ name: string; type: number; description: string; required: boolean }];
        }
    ];
    botPermissions?: string[];
    memberPermissions?: string[];
    execute(Client: Client, interaction: CommandInteraction, args: string[]): Promise<void>;
}
