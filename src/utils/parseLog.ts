import { informations, deaths, join, username, enclosedUsername, achievement, leave } from "./regex";

export function parseLog(log: string): { type: string; content: string } {    
    const potentialDeathRegex = deaths.find((rgx) => rgx.test(log)) ?? /(?!)/g;

    const schemes = [
        { name: "message", rgx: [informations, enclosedUsername] },
        { name: "join", rgx: [informations, username, join] },
        { name: "leave", rgx: [informations, username, leave] },
        { name: "achievement", rgx: [informations, username, achievement] },
        { name: "death", rgx: [informations, username, potentialDeathRegex] },
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
