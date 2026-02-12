package com.nova.core

import kotlin.math.abs

/**
 * Provides survival navigation instructions based on celestial bodies.
 * Avoids reliance on compass sensors which may be compromised.
 */
class CelestialNavigator {

    /**
     * Translates a target bearing into a relative position to the North Star (Polaris).
     * Only applicable in the Northern Hemisphere.
     */
    fun getPolarisInstruction(targetBearing: Float): String {
        // Normalizing bearing to 0..360
        val bearing = (targetBearing + 360) % 360
        
        return when {
            bearing in 350.0..360.0 || bearing in 0.0..10.0 -> 
                "Face the North Star directly and walk towards it."
            bearing in 10.0..80.0 -> 
                "Find the North Star. Turn slightly right so it's over your left shoulder."
            bearing in 80.0..100.0 -> 
                "Find the North Star. Keep it exactly to your left (90 degrees)."
            bearing in 100.0..170.0 -> 
                "Find the North Star. Keep it behind your left shoulder."
            bearing in 170.0..190.0 -> 
                "Face away from the North Star. Walk with it directly behind you."
            bearing in 190.0..260.0 -> 
                "Find the North Star. Keep it behind your right shoulder."
            bearing in 260.0..280.0 -> 
                "Find the North Star. Keep it exactly to your right (90 degrees)."
            else -> 
                "Find the North Star. Keep it over your right shoulder."
        }
    }

    /**
     * Guidance based on Orion's Belt (visible globally, rises East, sets West).
     */
    fun getOrionInstruction(targetBearing: Float): String {
        val bearing = (targetBearing + 360) % 360
        return when {
            bearing in 70.0..110.0 -> "Follow the three stars of Orion's Belt as they rise (East)."
            bearing in 250.0..290.0 -> "Follow the three stars of Orion's Belt as they set (West)."
            else -> "Use Orion's Belt to establish East/West, then adjust your heading."
        }
    }

    /**
     * Basic Sun-based orientation (East/West). 
     * In a real app, this would use the hour of day for precision.
     */
    fun getSunInstruction(targetBearing: Float, isMorning: Boolean): String {
        val bearing = (targetBearing + 360) % 360
        return if (isMorning) {
            "The Sun is in the EAST. " + when {
                bearing in 70.0..110.0 -> "Walk towards the Sun."
                bearing in 250.0..290.0 -> "Keep the Sun directly behind you."
                else -> "Face the Sun, then turn to your target bearing."
            }
        } else {
            "The Sun is in the WEST. " + when {
                bearing in 250.0..290.0 -> "Walk towards the Sunset."
                bearing in 70.0..110.0 -> "Keep the Sun directly behind you."
                else -> "Face the Sunset, then turn to your target bearing."
            }
        }
    }

    fun calculateBearing(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Float {
        val dLon = Math.toRadians(lon2 - lon1)
        val y = Math.sin(dLon) * Math.cos(Math.toRadians(lat2))
        val x = Math.cos(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)) -
                Math.sin(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.cos(dLon)
        var brng = Math.toDegrees(Math.atan2(y, x))
        return ((brng + 360) % 360).toFloat()
    }
}
