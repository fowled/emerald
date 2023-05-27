# Emerald
PaperMC plugin that acts as a bridge between your Discord guild and your Minecraft server.

**WIP**: only the french language is supported at the moment.

## History of the project
Originally, **Emerald** was a Discord bot aiming to bring [Aternos](https://aternos.org) actions to your server - start/shutdown/create backups and more.
Unfortunately, it's against their terms of service to automate access to the website. My account got permanently suspended and it should serve as a lesson to use the official infrastructure in place instead of bypassing restrictions and abusing the service.

So here I am, trying to recreate every feature of the bot, but this time in Kotlin and as a plugin. I already had the basics in Java, but Kotlin is super new to me.

## Features
- `/players` command → returns the playercount as well as every players names
- `/stats` command → returns a select menu
  - **Deaths** → leaderboard of players with the most deaths
  - **Kills** → leaderboard of players with the most kills
  - **Raids** → leaderboard of players with the most raids won
  - **Jumps** → leaderboard of players with the most jumps
  - **Playtime** → leaderboard of players with the most playtime
