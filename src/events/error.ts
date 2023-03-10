import { Client } from "discord.js";

import { error } from "@/utils/logger";

module.exports = {
    name: "error",

    async execute(_: Client, err: Error) {
        return error(err);
    },
};
