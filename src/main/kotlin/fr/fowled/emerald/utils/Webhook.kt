package fr.fowled.emerald.utils

import fr.fowled.emerald.bot.kord
import fr.fowled.emerald.dotenv
import fr.fowled.emerald.scope

import dev.kord.common.annotation.KordExperimental
import dev.kord.common.annotation.KordUnsafe
import dev.kord.common.entity.Snowflake
import dev.kord.core.behavior.execute
import kotlinx.coroutines.launch

@OptIn(KordUnsafe::class, KordExperimental::class)
fun sendWebhook(message: String, user: String, avatar: String) {
    val webhook = kord.unsafe.webhook(Snowflake(dotenv["WEBHOOK_ID"]))

    scope.launch {
        webhook.execute(dotenv["WEBHOOK_TOKEN"]) {
            content = message
            username = user
            avatarUrl = avatar
        }
    }
}
