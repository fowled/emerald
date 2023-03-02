import type { Client } from "discord.js";

export interface Event {
    name: string;
    once?: boolean;
    execute(Client: Client, ...args): Promise<void>;
}
