package com.nova.core

object HardcodedSurvival {
    fun getEmergencyTip(query: String): String {
        return when {
            query.contains("water", true) -> "💧 EMERGENCY WATER: Collect rainwater using fabric. Dig in dry riverbeds for damp sand. Boil ALL found water for 10 minutes."
            query.contains("fire", true) -> "🔥 EMERGENCY FIRE: Use a clear plastic bag with water as a lens. Use dry grass as tinder. Maintain a 3-layer teepee structure."
            query.contains("shelter", true) -> "⛺ EMERGENCY SHELTER: Build an A-frame using a fallen branch and smaller sticks. Cover with 6 inches of leaves/debris for insulation."
            query.contains("doctor", true) || query.contains("medical", true) -> "🚑 EMERGENCY FIRST AID: Apply direct pressure to bleeding. Keep wounds clean. If fracture suspected, splint the limb to the body to prevent movement."
            else -> "🚨 INVINCIBLE MODE: Systems are offline but I am Nova. Stay calm. Conserve energy. Find shelter. Signal with groups of 3 (flashes or sounds)."
        }
    }
}
