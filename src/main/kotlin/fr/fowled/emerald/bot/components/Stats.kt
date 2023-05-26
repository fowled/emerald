package fr.fowled.emerald.bot.components

import dev.kord.rest.builder.component.ActionRowBuilder
import dev.kord.rest.builder.component.option
import dev.kord.rest.builder.component.options
import fr.fowled.emerald.bot.handlers.StatsHandler

fun statsSelectMenu(builder: ActionRowBuilder, stat: String? = null) {
    val getStatsList = StatsHandler().statsList

    builder.let {
        it.stringSelect("stats") {
            placeholder = "Choisis la stat"

            getStatsList.map { stat ->
                val capitalizeStatName = (stat["name"] as String).replaceFirstChar(Char::titlecase)

                option("${stat["emoji"]} $capitalizeStatName", stat["name"] as String) {
                    description = stat["description"] as String
                }
            }

            this.options.map { opt -> opt.default = stat == opt.value }
        }
    }
}
