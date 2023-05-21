package fr.fowled.emerald.utils

import net.kyori.adventure.text.Component
import net.kyori.adventure.text.serializer.plain.PlainTextComponentSerializer

fun parseComponent(comp: Component): String {
    return PlainTextComponentSerializer.plainText().serialize(comp)
}