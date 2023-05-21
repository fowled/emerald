package fr.fowled.emerald.events

import fr.fowled.emerald.utils.parseComponent
import fr.fowled.emerald.utils.sendWebhook

import io.papermc.paper.event.player.AsyncChatEvent
import org.bukkit.event.EventHandler
import org.bukkit.event.Listener
import org.bukkit.event.entity.PlayerDeathEvent
import org.bukkit.event.player.PlayerAdvancementDoneEvent
import org.bukkit.event.player.PlayerJoinEvent
import org.bukkit.event.player.PlayerQuitEvent

class EventsHandler : Listener {
    @EventHandler
    fun playerJoin(event: PlayerJoinEvent) {
        return sendWebhook(
            ":wave: **${event.player.name}** a rejoint le serveur !",
            "Server",
            "https://mc-heads.net/avatar/steve2"
        )
    }

    @EventHandler
    fun playerQuitEvent(event: PlayerQuitEvent) {
        return sendWebhook(
            ":cry: **${event.player.name}** a quitté le serveur...",
            "Server",
            "https://mc-heads.net/avatar/steve2"
        )
    }

    @EventHandler
    fun asyncChatEvent(event: AsyncChatEvent) {
        val message = parseComponent(event.message())

        return sendWebhook(
            message,
            event.player.name,
            "https://mc-heads.net/avatar/${event.player.name}"
        )
    }

    @EventHandler
    fun playerDeathEvent(event: PlayerDeathEvent) {
        val deathLog = event.deathMessage() ?: return

        var message = parseComponent(deathLog)

        event.entity.killer?.name?.let {
            message = message.replace(it, "**${it}**")
        }

        message = message.replace(event.player.name, "**${event.player.name}**")

        return sendWebhook(
            "☠️ $message",
            "Server",
            "https://mc-heads.net/avatar/steve2"
        )
    }

    @EventHandler
    fun playerAdvancementDoneEvent(event: PlayerAdvancementDoneEvent) {
        val advancementLog = event.message() ?: return

        var message = parseComponent(advancementLog)
        val advancementName = parseComponent(event.advancement.displayName())

        message = message
            .replace(advancementName, "**$advancementName**")
            .replace(event.player.name, "**${event.player.name}**")

        return sendWebhook(
            "🎖️ $message",
            "Server",
            "https://mc-heads.net/avatar/steve2"
        )
    }
}
