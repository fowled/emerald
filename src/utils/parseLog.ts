import { date, deaths, join, thread, username, enclosedUsername, achievement } from "./regex";

export function parseLog(log: string) {
    if (!RegExp([date.source, thread.source].join("\u0020")).test(log)) {
        return null;
    }

    const chatTest = RegExp([date.source, thread.source, enclosedUsername.source].join("\u0020")).test(log);

    const joinTest = RegExp([date.source, thread.source, username.source, join.source].join("\u0020")).test(log);

    const deathTest = deaths.some((rgx) => rgx.test(log));

    const achievementTest = RegExp(
        [date.source, thread.source, username.source, achievement.source].join("\u0020")
    ).test(log);

    let getLogContent: string;

    if (chatTest) {
        const player = log.match(enclosedUsername).shift().replace(/[<>]/g, "");

        getLogContent = log
            .replace(RegExp([date.source, thread.source, enclosedUsername.source].join("\u0020")), "")
            .trim();

        return { type: "chatMessage", player, content: getLogContent };
    }

    getLogContent = log.replace(RegExp([date.source, thread.source].join("\u0020")), "").trim();

    if (joinTest) {
        const eventType = log.includes("joined") ? "joinEvent" : "leaveEvent";

        return { type: eventType, content: getLogContent };
    }

    if (deathTest) {
        return { type: "death", content: getLogContent };
    }

    if (achievementTest) {
        return { type: "achievement", content: getLogContent };
    }
}
