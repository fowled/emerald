package fr.fowled.emerald

import fr.fowled.emerald.bot.bot
import fr.fowled.emerald.bot.kord
import fr.fowled.emerald.events.EventsHandler

import io.github.cdimascio.dotenv.dotenv
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import org.bukkit.plugin.java.JavaPlugin

lateinit var scope: CoroutineScope

val dotenv = dotenv()

@Suppress("unused")
class Emerald : JavaPlugin() {
    override fun onEnable() {
        logger.info("Plugin started.")

        scope = CoroutineScope(Dispatchers.Default)

        scope.launch {
            try {
                bot()
            } catch (e: Exception) {
                println(e.stackTrace)
            }
        }

        server.pluginManager.registerEvents(EventsHandler(), this)
    }

    override fun onDisable() {
        logger.info("Plugin shut down.")

        scope.launch {
            kord.logout()
        }

        scope.cancel()
    }
}
