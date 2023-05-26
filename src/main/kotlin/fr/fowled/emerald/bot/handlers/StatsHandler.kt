package fr.fowled.emerald.bot.handlers

import dev.kord.rest.builder.message.create.UpdateMessageInteractionResponseCreateBuilder
import dev.kord.rest.builder.message.create.actionRow
import dev.kord.rest.builder.message.create.embed
import fr.fowled.emerald.bot.components.statsSelectMenu
import org.bukkit.Bukkit
import org.bukkit.Statistic

class StatsHandler {
    val statsList = listOf(
        mapOf(
            "name" to "deaths",
            "label" to "morts",
            "description" to "Nombre de morts",
            "emoji" to "☠️",
            "statistic" to Statistic.DEATHS
        ),

        mapOf(
            "name" to "kills",
            "label" to "kills",
            "description" to "Nombre de kills",
            "emoji" to "⚔️",
            "statistic" to Statistic.MOB_KILLS
        ),

        mapOf(
            "name" to "raids",
            "label" to "raids gagnés",
            "description" to "Nombre de raids gagnés",
            "emoji" to "🥊",
            "statistic" to Statistic.RAID_WIN
        ),

        mapOf(
            "name" to "jumps",
            "label" to "sauts",
            "description" to "Nombre de sauts",
            "emoji" to "🦘",
            "statistic" to Statistic.JUMP
        ),

        mapOf(
            "name" to "playtime",
            "label" to "heures",
            "description" to "Temps de jeu total",
            "emoji" to "⌚",
            "statistic" to Statistic.PLAY_ONE_MINUTE
        )
    )

    fun handler(statistic: String, builder: UpdateMessageInteractionResponseCreateBuilder) {
        val values = mutableMapOf<String, Int>()
        var players = Bukkit.getOfflinePlayers()

        if (Bukkit.getOnlinePlayers().isNotEmpty()) {
            players = players.plus(Bukkit.getOnlinePlayers())
        }

        val getStat = statsList.find { maps ->
            maps.values.contains(statistic)
        }!!

        for (player in players) {
            if (player.name === null) {
                continue
            }

            val stat = player.getStatistic(getStat["statistic"] as Statistic)

            values[player.name.toString()] = if (getStat["name"] === "playtime") ((stat / 20) / 3600) else stat
        }

        val sortList = values.toSortedMap(compareByDescending { values[it] })

        val sendValues = mutableListOf<String>()

        val medals = arrayOf("🥇", "🥈", "🥉")

        sortList
            .toList()
            .forEachIndexed { index, (key, value) ->
                val emoji = if (index < medals.size) medals[index] else "🔹"

                sendValues.add("$emoji **$key**: `$value` ${getStat["label"]}")
            }

        builder.let {
            it.embed {
                title = "🏆 Leaderboard: ${getStat["label"]} ${getStat["emoji"]}"
                description = sendValues.joinToString("\n")
            }

            it.actionRow {
                statsSelectMenu(this, statistic)
            }
        }
    }
}
