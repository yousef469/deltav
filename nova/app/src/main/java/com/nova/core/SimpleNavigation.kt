package com.nova.core

import android.content.Context
import android.hardware.SensorManager
import android.location.Location
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin

data class NavigationResult(
    val instruction: String,
    val distanceMeters: Float,
    val bearingDegrees: Float
)

class SimpleNavigation(private val context: Context) {
    private var currentAzimuth = 0f

    fun getCardinalDirection(): String {
        return when (currentAzimuth) {
            in 0f..22.5f, in 337.5f..360f -> "North"
            in 22.5f..67.5f -> "Northeast"
            in 67.5f..112.5f -> "East"
            in 112.5f..157.5f -> "Southeast"
            in 157.5f..202.5f -> "South"
            in 202.5f..247.5f -> "Southwest"
            in 247.5f..292.5f -> "West"
            else -> "Northwest"
        }
    }

    fun getDirectionToLandmark(
        targetLat: Double, targetLon: Double,
        currentLat: Double, currentLon: Double
    ): NavigationResult {
        val bearing = calculateBearing(currentLat, currentLon, targetLat, targetLon)
        val results = FloatArray(1)
        Location.distanceBetween(currentLat, currentLon, targetLat, targetLon, results)
        val distance = results[0]
        
        val relativeBearing = (bearing - currentAzimuth + 360) % 360
        val instruction = when {
            relativeBearing < 30 || relativeBearing > 330 -> "Go straight ahead"
            relativeBearing in 30.0..150.0 -> "Turn right"
            relativeBearing in 150.0..210.0 -> "Turn around"
            else -> "Turn left"
        }

        return NavigationResult(instruction, distance, bearing)
    }

    private fun calculateBearing(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Float {
        val dLon = Math.toRadians(lon2 - lon1)
        val lat1Rad = Math.toRadians(lat1)
        val lat2Rad = Math.toRadians(lat2)
        val y = sin(dLon) * cos(lat2Rad)
        val x = cos(lat1Rad) * sin(lat2Rad) - sin(lat1Rad) * cos(lat2Rad) * cos(dLon)
        return Math.toDegrees(atan2(y, x)).toFloat()
    }
    private val landmarks = listOf(
        Landmark("Everest", 27.9881, 86.9250),
        Landmark("Paris", 48.8566, 2.3522),
        Landmark("New York", 40.7128, -74.0060),
        Landmark("Cairo", 30.0444, 31.2357),
        Landmark("Tokyo", 35.6762, 139.6503),
        Landmark("Sydney", -33.8688, 151.2093)
    )

    fun getLandmarks(): List<Landmark> = landmarks
}

data class Landmark(val name: String, val lat: Double, val lon: Double)
