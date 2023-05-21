package fr.fowled.emerald.bot

import dev.kord.common.Color
import dev.kord.common.entity.Snowflake
import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import fr.fowled.emerald.dotenv
import kotlinx.coroutines.flow.toList
import net.kyori.adventure.text.Component
import net.kyori.adventure.text.format.NamedTextColor
import net.kyori.adventure.text.format.TextColor
import net.kyori.adventure.text.format.TextDecoration
import org.bukkit.Bukkit

lateinit var kord: Kord

suspend fun bot() {
    kord = Kord(dotenv["TOKEN"])

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot == true) {
            return@on
        }

        if (message.channelId != Snowflake(1070081880457760888)) {
            return@on
        }

        member?.let { member ->
            val getColor = member.roles.toList()
                .sortedDescending()
                .firstOrNull { it.color != Color(0x99AAB5) }

            val convertColor = TextColor.color(getColor?.color?.rgb!!)

            val component = Component.text("[Discord] ").color(NamedTextColor.AQUA)
                .append(
                    Component.text(member.tag).color(convertColor).decoration(TextDecoration.BOLD, true)
                )
                .append(
                    Component.text(": ${message.content}").color(NamedTextColor.WHITE)
                )

            Bukkit.getServer().broadcast(component)
        }
    }

    kord.login {
        @OptIn(PrivilegedIntent::class)
        intents += Intent.MessageContent
    }
}
