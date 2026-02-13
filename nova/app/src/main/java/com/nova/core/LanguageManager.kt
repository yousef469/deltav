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
        ),
        "emergency_title" to mapOf(
            AppLanguage.ENGLISH to "EMERGENCY / SOS",
            AppLanguage.ARABIC to "الطوارئ / استغاثة",
            AppLanguage.SPANISH to "EMERGENCIA / SOS",
            AppLanguage.CHINESE to "紧急 / SOS",
            AppLanguage.HINDI to "आपातकाल / SOS",
            AppLanguage.FRENCH to "URGENCE / SOS"
        ),
        "farming" to mapOf(
            AppLanguage.ENGLISH to "FARMING",
            AppLanguage.ARABIC to "الزراعة",
            AppLanguage.SPANISH to "AGRICULTURA",
            AppLanguage.CHINESE to "农业",
            AppLanguage.HINDI to "खेती",
            AppLanguage.FRENCH to "AGRICULTURE"
        ),
        "repairing" to mapOf(
            AppLanguage.ENGLISH to "REPAIRING",
            AppLanguage.ARABIC to "الإصلاح",
            AppLanguage.SPANISH to "REPARACIÓN",
            AppLanguage.CHINESE to "修理",
            AppLanguage.HINDI to "मरम्मत",
            AppLanguage.FRENCH to "RÉPARATION"
        ),
        "medical" to mapOf(
            AppLanguage.ENGLISH to "MEDICAL",
            AppLanguage.ARABIC to "الطبي",
            AppLanguage.SPANISH to "MÉDICO",
            AppLanguage.CHINESE to "医疗",
            AppLanguage.HINDI to "मेडिकल",
            AppLanguage.FRENCH to "MÉDICAL"
        ),
        "education" to mapOf(
            AppLanguage.ENGLISH to "EDUCATION",
            AppLanguage.ARABIC to "التعليم",
            AppLanguage.SPANISH to "EDUCACIÓN",
            AppLanguage.CHINESE to "教育",
            AppLanguage.HINDI to "शिक्षा",
            AppLanguage.FRENCH to "ÉDUCATION"
        ),
        "coding" to mapOf(
            AppLanguage.ENGLISH to "CODING",
            AppLanguage.ARABIC to "البرمجة",
            AppLanguage.SPANISH to "PROGRAMACIÓN",
            AppLanguage.CHINESE to "编程",
            AppLanguage.HINDI to "कोडिंग",
            AppLanguage.FRENCH to "CODAGE"
        ),
        "chess" to mapOf(
            AppLanguage.ENGLISH to "CHESS",
            AppLanguage.ARABIC to "شطرنج",
            AppLanguage.SPANISH to "AJEDREZ",
            AppLanguage.CHINESE to "象棋",
            AppLanguage.HINDI to "शतरंज",
            AppLanguage.FRENCH to "ÉCHECS"
        ),
        "navigator" to mapOf(
            AppLanguage.ENGLISH to "NAVIGATOR",
            AppLanguage.ARABIC to "الملاح",
            AppLanguage.SPANISH to "NAVEGADOR",
            AppLanguage.CHINESE to "导航员",
            AppLanguage.HINDI to "नेविगेटर",
            AppLanguage.FRENCH to "NAVIGATEUR"
        ),
        "tools" to mapOf(
            AppLanguage.ENGLISH to "TOOLS",
            AppLanguage.ARABIC to "الأدوات",
            AppLanguage.SPANISH to "HERRAMIENTAS",
            AppLanguage.CHINESE to "工具",
            AppLanguage.HINDI to "उपकरण",
            AppLanguage.FRENCH to "OUTILS"
        ),
        "disclaimer" to mapOf(
            AppLanguage.ENGLISH to "Nova provides guidance, not professional medical advice.\nIn emergencies, contact local authorities when possible.",
            AppLanguage.ARABIC to "نوفا توفر التوجيه، وليس المشورة الطبية المهنية.\nفي حالات الطوارئ، اتصل بالسلطات المحلية عندما يكون ذلك ممكنًا.",
            AppLanguage.SPANISH to "Nova brinda orientación, no asesoramiento médico profesional.\nEn emergencias, contacte a las autoridades locales cuando sea posible.",
            AppLanguage.CHINESE to "Nova 提供指导，而不是专业的医疗建议。\n在紧急情况下，尽可能联系当地当局。",
            AppLanguage.HINDI to "नोवा मार्गदर्शन प्रदान करता है, पेशेवर चिकित्सा सलाह नहीं।\nआपात स्थिति में, जब संभव हो स्थानीय अधिकारियों से संपर्क करें।",
            AppLanguage.FRENCH to "Nova fournit des conseils et non des avis médicaux professionnels.\nEn cas d'urgence, contactez les autorités locales si possible."
        ),
        "sos_morse_start" to mapOf(
            AppLanguage.ENGLISH to "🔦 SOS MORSE (OFF)",
            AppLanguage.ARABIC to "🔦 استغاثة مورس (إيقاف)",
            AppLanguage.SPANISH to "🔦 SOS MORSE (APAGADO)",
            AppLanguage.CHINESE to "🔦 SOS 摩斯密码 (关闭)",
            AppLanguage.HINDI to "🔦 एसओएस मोर्स (बंद)",
            AppLanguage.FRENCH to "🔦 SOS MORSE (ÉTEINT)"
        ),
        "sos_morse_stop" to mapOf(
            AppLanguage.ENGLISH to "🛑 STOP SOS MORSE",
            AppLanguage.ARABIC to "🛑 إيقاف استغاثة مورس",
            AppLanguage.SPANISH to "🛑 DETENER SOS MORSE",
            AppLanguage.CHINESE to "🛑 停止 SOS 摩斯密码",
            AppLanguage.HINDI to "🛑 एसओएस मोर्स रोकें",
            AppLanguage.FRENCH to "🛑 ARRÊTER SOS MORSE"
        )
        // Add more keys as needed for UI elements
    )
}
