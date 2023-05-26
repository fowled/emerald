package fr.fowled.emerald

import com.github.shynixn.mccoroutine.bukkit.SuspendingJavaPlugin
import com.github.shynixn.mccoroutine.bukkit.registerSuspendingEvents
import fr.fowled.emerald.bot.Bot
import fr.fowled.emerald.events.EventsHandler

@Suppress("unused")
class Emerald : SuspendingJavaPlugin() {
    private val bot = Bot()

    override suspend fun onEnableAsync() {
        logger.info("Plugin started.")

        server.pluginManager.registerSuspendingEvents(EventsHandler(bot), this)

        bot.start()
    }

    override suspend fun onDisableAsync() {
        /* bot.sendWebhook(
            "🔴 Le serveur va s'éteindre, le bot également.",
            "Server",
            "https://mc-heads.net/avatar/steve2"
        ) */

        bot.stop()

        logger.info("Plugin disabled.")
    }
}
