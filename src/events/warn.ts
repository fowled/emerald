import { Client } from "discord.js";

import { warn } from "@/utils/logger";

module.exports = {
    name: "warn",

    async execute(_: Client, err: Error) {
        return warn(err);
    },
};
