import inquirer from "inquirer";
import chalk from "chalk";

import { writeConfig } from "@/utils/config";
import { error, log } from "@/utils/logger";

const validate = (input: string) => (!input ? "Input shall not be empty!" : true);

const questions = [
    { type: "list", name: "language", message: "Choose the bot's language:", choices: ["en", "fr"] },
    { type: "list", name: "logs_format", message: "What's your MC server running on?", choices: ["vanilla", "paper"] },
    { type: "input", name: "aternos_server_id", message: "Enter the aternos server ID:", validate },
    { type: "password", name: "aternos_session", message: "Enter your aternos session token:", validate },
    { type: "input", name: "pocketbase_mail", message: "Enter the pocketbase instance email address:", validate },
    { type: "password", name: "pocketbase_pwd", message: "Enter the pocketbase instance password:", validate },
    { type: "input", name: "pocketbase_host", message: "Enter the pocketbase instance URL:", validate },
    { type: "password", name: "token", message: "Enter the Discord bot token:", validate },
];

const prompt = inquirer.createPromptModule();

try {
    writeConfig({
        ...(await prompt(questions)),
        setup: false,
        user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    });

    log(["Successfully saved config file.", `You may now run ${chalk.yellow("/setup")} in your server.`].join("\n"));
} catch {
    error(`${chalk.red("ERR!")} Couldn't save config file. Aborting...`);
}
