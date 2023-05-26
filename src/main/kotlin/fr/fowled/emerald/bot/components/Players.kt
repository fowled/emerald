package fr.fowled.emerald.bot.components

import org.bukkit.Bukkit

fun onlinePlayers(): String {
    val players = Bukkit.getServer().onlinePlayers

    return """
        Il y a ${players.size} joueur(s) en ligne.
        ${players.map { p -> "» **${p.name}**" }.joinToString("\n") { it }}
    """.trimIndent()
}
