package com.nova.core

enum class QueryIntent {
    EMERGENCY, MEDICAL, FARMING, MECHANICAL, NAVIGATION, GENERAL
}

class QueryAnalyzer {
    fun analyze(query: String): QueryIntent {
        val q = query.lowercase()
        return when {
            // Emergency / SOS
            q.contains("sos", true) || q.contains("emergency", true) || 
            q.contains("bleeding", true) || q.contains("unconscious", true) ||
            q.contains("choking", true) -> QueryIntent.EMERGENCY

            // Navigation / Location
            q.contains("where", true) || q.contains("location", true) || 
            q.contains("north", true) || q.contains("compass", true) ||
            q.contains("village", true) -> QueryIntent.NAVIGATION

            // Medical Domain
            q.contains("doctor", true) || q.contains("pain", true) || 
            q.contains("fever", true) || q.contains("wound", true) ||
            q.contains("medicine", true) -> QueryIntent.MEDICAL

            // Farming Domain
            q.contains("plant", true) || q.contains("soil", true) || 
            q.contains("crop", true) || q.contains("seed", true) ||
            q.contains("irrigation", true) -> QueryIntent.FARMING

            // Mechanical Domain
            q.contains("fix", true) || q.contains("repair", true) || 
            q.contains("engine", true) || q.contains("tool", true) ||
            q.contains("build", true) -> QueryIntent.MECHANICAL

            else -> QueryIntent.GENERAL
        }
    }
}
