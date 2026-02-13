package com.nova.core

import android.content.Context

enum class AppLanguage(val code: String, val displayName: String, val flag: String) {
    ENGLISH("en", "English", "🇺🇸"),
    CHINESE("zh", "Chinese", "🇨🇳"),
    HINDI("hi", "Hindi", "🇮🇳"),
    SPANISH("es", "Spanish", "🇪🇸"),
    ARABIC("ar", "Arabic", "🇸🇦"),
    FRENCH("fr", "French", "🇫🇷")
}

object LanguageManager {
    var currentLanguage = AppLanguage.ENGLISH
    
    fun nextLanguage(): AppLanguage {
        val nextIndex = (currentLanguage.ordinal + 1) % AppLanguage.values().size
        currentLanguage = AppLanguage.values()[nextIndex]
        return currentLanguage
    }
    
    fun get(key: String): String {
        return translations[key]?.get(currentLanguage) ?: translations[key]?.get(AppLanguage.ENGLISH) ?: key
    }
    
    private val translations = mapOf(
        "welcome" to mapOf(
            AppLanguage.ENGLISH to "NOVA LITE",
            AppLanguage.CHINESE to "新星精简版",
            AppLanguage.HINDI to "नोवा लाइट",
            AppLanguage.SPANISH to "NOVA LITE",
            AppLanguage.ARABIC to "نوفا لايت",
            AppLanguage.FRENCH to "NOVA LITE"
        ),
        "medical_mode" to mapOf(
            AppLanguage.ENGLISH to "MEDICAL MODE",
            AppLanguage.CHINESE to "医疗模式",
            AppLanguage.HINDI to "चिकित्सा मोड",
            AppLanguage.SPANISH to "MODO MÉDICO",
            AppLanguage.ARABIC to "الوضع الطبي",
            AppLanguage.FRENCH to "MODE MÉDICAL"
        ),
        "farming_mode" to mapOf(
            AppLanguage.ENGLISH to "FARMING MODE",
            AppLanguage.CHINESE to "农业模式",
            AppLanguage.HINDI to "खेती मोड",
            AppLanguage.SPANISH to "MODO AGRÍCOLA",
            AppLanguage.ARABIC to "الوضع الزراعي",
            AppLanguage.FRENCH to "MODE AGRICOLE"
        ),
        "sos_mode" to mapOf(
            AppLanguage.ENGLISH to "SOS MODE",
            AppLanguage.CHINESE to "求救模式",
            AppLanguage.HINDI to "एसओएस मोड",
            AppLanguage.SPANISH to "MODO SOS",
            AppLanguage.ARABIC to "وضع الاستغاثة",
            AppLanguage.FRENCH to "MODE SOS"
        ),
        "tools_mode" to mapOf(
            AppLanguage.ENGLISH to "SURVIVAL TOOLS",
            AppLanguage.CHINESE to "生存工具",
            AppLanguage.HINDI to "उत्तरजीविता उपकरण",
            AppLanguage.SPANISH to "HERRAMIENTAS",
            AppLanguage.ARABIC to "أدوات البقاء",
            AppLanguage.FRENCH to "OUTILS DE SURVIE"
        ),
        "status_searching" to mapOf(
            AppLanguage.ENGLISH to "Searching...",
            AppLanguage.CHINESE to "搜索中...",
            AppLanguage.HINDI to "खोज रहा है...",
            AppLanguage.SPANISH to "Buscando...",
            AppLanguage.ARABIC to "جار البحث...",
            AppLanguage.FRENCH to "Recherche..."
        ),
        "status_ready" to mapOf(
            AppLanguage.ENGLISH to "Survival Database Ready.",
            AppLanguage.CHINESE to "生存数据库准备就绪。",
            AppLanguage.HINDI to "उत्तरजीविता डेटाबेस तैयार है।",
            AppLanguage.SPANISH to "Base de datos lista.",
            AppLanguage.ARABIC to "قاعدة البيانات جاهزة.",
            AppLanguage.FRENCH to "Base de données prête."
        )
        // Add more keys as needed for UI elements
    )
}
