package com.nova.core

import android.location.Location
import kotlin.math.*

data class RescuePoint(val name: String, val lat: Double, val lon: Double, val type: String)

object RescueEngine {
    
    // A small, high-value list of major hubs to ensure SOMETHING is always found. 
    // In a real expanded version, this would be a SQLite table of 5000+ cities.
    private val GLOBAL_RESCUE_POINTS = listOf(
        RescuePoint("Cairo", 30.0444, 31.2357, "CITY"),
        RescuePoint("Alexandria", 31.2001, 29.9187, "CITY"),
        RescuePoint("Luxor", 25.6872, 32.6396, "CITY"),
        RescuePoint("Aswan", 24.0889, 32.8998, "CITY"),
        RescuePoint("Marsa Matruh", 31.3543, 27.2373, "COASTAL"),
        RescuePoint("Siwa Oasis", 29.2032, 25.5195, "OASIS"),
        RescuePoint("Kharga Oasis", 25.4390, 30.5586, "OASIS"),
        RescuePoint("Farafra", 27.0630, 27.9709, "OASIS"),
        RescuePoint("Bahariya", 28.3555, 28.8779, "OASIS"),
        RescuePoint("Hurghada", 27.2579, 33.8116, "COASTAL"),
        RescuePoint("Sharm El-Sheikh", 27.9158, 34.3299, "COASTAL"),
        RescuePoint("Riyadh", 24.7136, 46.6753, "CITY"),
        RescuePoint("Jeddah", 21.5433, 39.1980, "CITY"),
        RescuePoint("Dubai", 25.2048, 55.2708, "CITY"),
        RescuePoint("London", 51.5074, -0.1278, "CITY"),
        RescuePoint("New York", 40.7128, -74.0060, "CITY")
    )

    fun findNearestCivilization(currentLat: Double, currentLon: Double): Pair<RescuePoint, Float> {
        var nearest: RescuePoint? = null
        var minDistance = Double.MAX_VALUE

        for (point in GLOBAL_RESCUE_POINTS) {
            val dist = calculateDistance(currentLat, currentLon, point.lat, point.lon)
            if (dist < minDistance) {
                minDistance = dist
                nearest = point
            }
        }

        return (nearest ?: GLOBAL_RESCUE_POINTS[0]) to minDistance.toFloat()
    }

    private fun calculateDistance(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val R = 6371e3 // Earth radius in meters
        val phi1 = lat1 * Math.PI / 180
        val phi2 = lat2 * Math.PI / 180
        val deltaPhi = (lat2 - lat1) * Math.PI / 180
        val deltaLambda = (lon2 - lon1) * Math.PI / 180

        val a = sin(deltaPhi / 2).pow(2) + cos(phi1) * cos(phi2) * sin(deltaLambda / 2).pow(2)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return R * c / 1000.0 // Return km
    }
}
