export const date = /(?:[0-1][0-9]|2[0-3]):?[0-5][0-9]:?[0-5][0-9]?/g;

export const thread = /(?:\[(Server thread\/INFO|WARN|ERROR|FATAL)]:)?/g;

export const username = /([A-z0-9]*)?/g;

export const enclosedUsername = /<([A-z0-9]*)>?/g;

export const join = /(?:(joined|left) the game*)/g;

export const achievement = /has made the advancement (?:\[(.*)])/g;

export const deaths = [
    /(.*) was shot by (.*)(\susing (.*))?/g,
    /(.*) was pummeled by (.*)(\susing (.*))?/g,
    /(.*) was pricked to death/g,
    /(.*) walked into a cactus whilst trying to escape (.*)/g,
    /(.*) drowned(\swhilst trying to escape (.*))?/g,
    /(.*) experienced kinetic energy(\swhilst trying to escape (.*))?/g,
    /(.*) blew up/g,
    /(.*) was blown up by (.*)(\susing (.*))?/g,
    /(.*) was killed by \[Intentional Game Design]/g,
    /(.*) hit the ground too hard(\swhilst trying to escape (.*))?/g,
    /(.*) fell from a high place/g,
    /(.*) fell off a ladder/g,
    /(.*) fell off some(\sweeping||(\stwisting))? vines/g,
    /(.*) fell off scaffolding/g,
    /(.*) fell while climbing/g,
    /(.*) was impaled on a stalagmite(\swhilst fighting (.*))?/g,
    /(.*) was squashed by (a falling anvil|a falling block)/g,
    /(.*) was squashed by a falling stalactite/g,
    /(.*) went up in flames/g,
    /(.*) walked into fire whilst fighting (.*)/g,
    /(.*) burned to death/g,
    /(.*) was burnt to a crisp whilst fighting (.*)/g,
    /(.*) went off with a bang(\sdue to a firework fired from (.*) by (.*))?/g,
    /(.*) tried to swim in lava(\sto escape (.*))?/g,
    /(.*) was struck by lightning(\swhilst fighting (.*))?/g,
    /(.*) discovered the floor was lava/g,
    /(.*) walked into danger zone due to (.*)/g,
    /(.*) was killed by magic(\swhilst trying to escape (.*))?/g,
    /(.*) was killed by (.*) using ((.*)|magic)/g,
    /(.*) froze to death/g,
    /(.*) was frozen to death by (.*)/g,
    /(.*) was slain by (.*)(\susing (.*))?/g,
    /(.*) was fireballed by (.*)(\susing (.*))?/g,
    /(.*) was stung to death by (.*)(\susing (.*))?/g,
    /(.*) was shot by a skull by (.*)(\susing (.*))?/g,
    /(.*) was obliterated by a sonically-charged shriek(\swhilst trying to escape (.*) wielding (.*))?/g,
    /(.*) starved to death(\swhilst fighting (.*))?/g,
    /(.*) suffocated in a wall(\swhilst fighting (.*))?/g,
    /(.*) was squished (too much|by (.*))/g,
    /(.*) was poked to death by a sweet berry bush(\swhilst trying to escape (.*))?/g,
    /(.*) was killed(\sby (.*))? trying to hurt (.*)/g,
    /(.*) was impaled by (.*)(\swith (.*))?/g,
    /(.*) fell out of the world/g,
    /(.*) didn't want to live in the same world as (.*)/g,
    /(.*) withered away(\swhilst fighting (.*))?/g,
    /(.*) died from dehydration(\swhilst trying to escape (.*))?/g,
    /(.*) died(\sbecause of (.*))?/g,
];
