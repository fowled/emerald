import { date, deaths, join, thread, username, enclosedUsername, achievement, leave } from "./regex";

export function parseLog(log: string): { type: string; content: string } {
    const potentialDeathRegex = deaths.find((rgx) => rgx.test(log)) ?? /(?!)/g;

    const schemes = [
        { name: "message", rgx: [date, thread, enclosedUsername] },
        { name: "join", rgx: [date, thread, username, join] },
        { name: "leave", rgx: [date, thread, username, leave] },
        { name: "achievement", rgx: [date, thread, username, achievement] },
        { name: "death", rgx: [date, thread, username, potentialDeathRegex] },
    ];

    for (const scheme of schemes) {
        const expression = RegExp(scheme.rgx.map((regex) => regex.source).join("\u0020"));

        if (!expression.test(log)) {
            continue;
        }

        return { type: scheme.name, content: getMsgContent(log, scheme.name, schemes, potentialDeathRegex) };
    }
}

function getMsgContent(log: string, scheme: string, schemes: { name: string; rgx: RegExp[] }[], death: RegExp) {
    const findScheme = schemes.find((sch) => sch.name === scheme);

    const combineRegexes = [];
    
    for (const regex of findScheme.rgx) {
        if (![join, leave, username, achievement, death].includes(regex)) {
            combineRegexes.push(regex.source);
        }
    }

    return log.replace(RegExp(combineRegexes.join("\u0020")), "").trim();
}
