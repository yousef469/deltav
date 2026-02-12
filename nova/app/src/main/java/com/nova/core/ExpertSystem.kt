package com.nova.core

object ExpertSystem {
    fun getDecision(intent: QueryIntent, query: String): String {
        val q = expandSynonyms(query.lowercase())
        return when (intent) {
            QueryIntent.EMERGENCY -> handleEmergency(q)
            QueryIntent.MEDICAL -> handleMedical(q)
            else -> "Protocol not found in Expert System. Falling back to Vault Search..."
        }
    }

    private fun expandSynonyms(q: String): String {
        var expanded = q
        val synonyms = mapOf(
            "belly|gut|tummy|abdomen" to "stomach",
            "puke|throw up|nausea" to "vomit",
            "hurt|ache|sore" to "pain",
            "thirsty|dry" to "dehydration",
            "hot|heat|burning" to "fever",
            "car|truck|van" to "vehicle"
        )
        synonyms.forEach { (pattern, replacement) ->
            expanded = expanded.replace(pattern.toRegex(), replacement)
        }
        return expanded
    }

    private fun handleEmergency(q: String): String {
        return when {
            q.contains("bleed|blood", true) -> "🩸 RULE: Apply direct pressure. Elevate limb. Use tourniquet ONLY if pressure fails. Keep patient warm."
            q.contains("choke|breathing", true) -> "🥨 RULE: Perform Hemlich maneuver. 5 back blows, 5 abdominal thrusts. If unconscious, start CPR."
            q.contains("cpr|heart|unconscious", true) -> "💓 RULE: 30 chest compressions (2 inches deep) followed by 2 rescue breaths. Repeat at 100-120 bpm."
            q.contains("stroke|face|speech", true) -> "🧠 RULE: Think FAST. Face drooping? Arm weakness? Speech difficulty? Time to get to a hospital immediately."
            q.contains("snake|bite", true) -> "🐍 RULE: Keep limb BELOW heart. Immobilize. Do NOT cut or suck venom. Identify color/pattern."
            q.contains("dehydration|thirst", true) -> "💧 RULE: Sip water slowly. Add a pinch of salt/sugar if available. Seek shade immediately."
            else -> HardcodedSurvival.getEmergencyTip(q)
        }
    }

    private fun handleMedical(q: String): String {
        return when {
            q.contains("fever", true) -> "🌡️ RULE: Fluid intake priority. Monitor temp every 4h. If >103, initiate cold compress and seek doctor."
            q.contains("burn", true) -> "🔥 RULE: Cool running water for 20m. Do NOT apply ice/butter. Cover with sterile wrap/film."
            else -> "Consulting Medical Vault database for specific treatment protocols..."
        }
    }
}
