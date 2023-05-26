package fr.fowled.emerald.bot

import dev.kord.common.Color
import dev.kord.common.annotation.KordExperimental
import dev.kord.common.annotation.KordUnsafe
import dev.kord.common.entity.Snowflake
import dev.kord.core.Kord
import dev.kord.core.behavior.execute
import dev.kord.core.behavior.interaction.response.respond
import dev.kord.core.behavior.interaction.updatePublicMessage
import dev.kord.core.entity.Member
import dev.kord.core.entity.Message
import dev.kord.core.entity.interaction.GuildChatInputCommandInteraction
import dev.kord.core.entity.interaction.SelectMenuInteraction
import dev.kord.core.event.gateway.ReadyEvent
import dev.kord.core.event.interaction.GuildChatInputCommandInteractionCreateEvent
import dev.kord.core.event.interaction.SelectMenuInteractionCreateEvent
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.rest.builder.message.modify.actionRow
import fr.fowled.emerald.bot.components.onlinePlayers
import fr.fowled.emerald.bot.components.statsSelectMenu
import fr.fowled.emerald.bot.handlers.StatsHandler
import fr.fowled.emerald.constants.Constants
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.launch
import net.kyori.adventure.text.Component
import net.kyori.adventure.text.format.NamedTextColor
import net.kyori.adventure.text.format.TextColor
import net.kyori.adventure.text.format.TextDecoration
import org.bukkit.Bukkit

class Bot {
    private lateinit var kord: Kord
    private lateinit var job: Job

    private val creds = Constants()

    suspend fun start() {
        job = CoroutineScope(Dispatchers.IO).launch {
            kord = Kord(creds.token) {
                enableShutdownHook = false
            }

            eventHandler()

            login()
        }
    }

    suspend fun stop() {
        kord.shutdown()

        job.join()
    }

    private suspend fun eventHandler() {
        kord.on<MessageCreateEvent> { onMessage(message, member) }
        kord.on<ReadyEvent> { onReady() }
        kord.on<GuildChatInputCommandInteractionCreateEvent> { onInteraction(interaction) }
        kord.on<SelectMenuInteractionCreateEvent> { onSelectInteraction(interaction) }
    }

    private suspend fun onReady() {
        /* sendWebhook(
            "🟢 Le serveur a démarré, le bot est prêt !",
            "Server",
            "https://mc-heads.net/avatar/steve2"
        ) */

        kord.editPresence {
            listening("les pleurs d'Aternos")
        }
    }

    private suspend fun onMessage(message: Message, member: Member?) {
        if (message.author?.isBot == true) {
            return
        }

        if (message.channelId != Snowflake(creds.chatChannelId)) {
            return
        }

        member?.let { it ->
            val getColor = it.roles
                .toList()
                .sortedDescending()
                .firstOrNull { it.color != Color(0x99AAB5) }

            val convertColor = TextColor.color(getColor?.color?.rgb!!)

            val component = Component.text("[Discord] ").color(NamedTextColor.AQUA)
                .append(
                    Component.text(it.displayName).color(convertColor).decoration(TextDecoration.BOLD, true)
                ).append(
                    Component.text(": ${message.content}").color(NamedTextColor.WHITE)
                )

            Bukkit.getServer().broadcast(component)
        }
    }

    private suspend fun onInteraction(interaction: GuildChatInputCommandInteraction) {
        val response = interaction.deferPublicResponse()
        val command = interaction.command

        when (command.rootName) {
            "players" -> {
                response.respond {
                    content = onlinePlayers()
                }
            }

            "stats" -> {
                response.respond {
                    actionRow { statsSelectMenu(this) }
                }
            }
        }
    }

    private suspend fun onSelectInteraction(interaction: SelectMenuInteraction) {
        when (interaction.componentId) {
            "stats" -> {
                val handler = StatsHandler()

                interaction.updatePublicMessage {
                    handler.handler(interaction.values[0], this)
                }
            }
        }
    }

    @OptIn(PrivilegedIntent::class)
    private suspend fun login() {
        kord.login {
            intents += Intent.MessageContent
        }
    }

    @OptIn(KordUnsafe::class, KordExperimental::class)
    suspend fun sendWebhook(message: String, user: String, avatar: String) {
        val webhook = kord.unsafe.webhook(Snowflake(creds.webhookId))

        webhook.execute(creds.webhookToken) {
            content = message
            username = user
            avatarUrl = avatar
        }
    }
}
