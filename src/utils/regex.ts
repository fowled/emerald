const { logs_format } = await import("config.json");

export let informations: RegExp;

switch (logs_format) {
    case "paper": {
        let date = /((?:[0-1][0-9]|2[0-3]):?[0-5][0-9]:?[0-5][0-9])?/;
        let thread = /(?:(INFO|WARN|ERROR|FATAL))/;

        informations = RegExp(/([\s\S]*)\[/.source + [date.source, thread.source].join("\u0020") + /]:/.source);
        break;
    }

    case "vanilla": {
        let date = /([\s\S]*)\[((?:[0-1][0-9]|2[0-3]):?[0-5][0-9]:?[0-5][0-9])]?/;
        let thread = /(?:\[(Server thread\/INFO|WARN|ERROR|FATAL)]:)?/;

        informations = RegExp([date.source, thread.source].join("\u0020"));
        break;
    }
}

export const colors = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

export const username = /([A-z0-9]*)?/;

export const enclosedUsername = /<([A-z0-9]*)>?/;

export const join = /(?:joined the game*)/;

export const leave = /(?:left the game*)/;

export const achievement = /(has made the advancement|has reached the goal|has completed the challenge) (?:\[(.*)])/;

export const deaths = [
    /was shot by (.*)(\susing (.*))?/,
    /was pummeled by (.*)(\susing (.*))?/,
    /was pricked to death/,
    /walked into a cactus whilst trying to escape (.*)/,
    /drowned(\swhilst trying to escape (.*))?/,
    /experienced kinetic energy(\swhilst trying to escape (.*))?/,
    /blew up/,
    /was blown up by (.*)(\susing (.*))?/,
    /was killed by \[Intentional Game Design]/,
    /hit the ground too hard(\swhilst trying to escape (.*))?/,
    /fell from a high place/,
    /fell off a ladder/,
    /fell off some(\sweeping||(\stwisting))? vines/,
    /fell off scaffolding/,
    /fell while climbing/,
    /was impaled on a stalagmite(\swhilst fighting (.*))?/,
    /was squashed by (a falling anvil|a falling block)/,
    /was squashed by a falling stalactite/,
    /went up in flames/,
    /walked into fire whilst fighting (.*)/,
    /burned to death/,
    /was burnt to a crisp whilst fighting (.*)/,
    /went off with a bang(\sdue to a firework fired from (.*) by (.*))?/,
    /tried to swim in lava(\sto escape (.*))?/,
    /was struck by lightning(\swhilst fighting (.*))?/,
    /discovered the floor was lava/,
    /walked into danger zone due to (.*)/,
    /was killed by magic(\swhilst trying to escape (.*))?/,
    /was killed by (.*) using ((.*)|magic)/,
    /froze to death/,
    /was frozen to death by (.*)/,
    /was slain by (.*)(\susing (.*))?/,
    /was fireballed by (.*)(\susing (.*))?/,
    /was stung to death by (.*)(\susing (.*))?/,
    /was shot by a skull by (.*)(\susing (.*))?/,
    /was obliterated by a sonically-charged shriek(\swhilst trying to escape (.*) wielding (.*))?/,
    /starved to death(\swhilst fighting (.*))?/,
    /suffocated in a wall(\swhilst fighting (.*))?/,
    /was squished (too much|by (.*))/,
    /was poked to death by a sweet berry bush(\swhilst trying to escape (.*))?/,
    /was killed(\sby (.*))? trying to hurt (.*)/,
    /was impaled by (.*)(\swith (.*))?/,
    /fell out of the world/,
    /didn't want to live in the same world as (.*)/,
    /withered away(\swhilst fighting (.*))?/,
    /died from dehydration(\swhilst trying to escape (.*))?/,
    /died(\sbecause of (.*))?/,
];
