package com.nova.core

import android.content.Context
import android.media.AudioManager
import android.media.ToneGenerator
import kotlinx.coroutines.*
import kotlin.math.abs

class SurvivalActions(private val context: Context) {

    // --- SOUND BEACON ---
    private var isBeaconActive = false
    private var beaconJob: Job? = null
    private val scope = CoroutineScope(Dispatchers.Main)
    private val toneGenerator = ToneGenerator(AudioManager.STREAM_ALARM, 100)

    fun toggleBeacon(onUpdate: (Boolean) -> Unit) {
        isBeaconActive = !isBeaconActive
        if (isBeaconActive) {
            startBeacon()
        } else {
            stopBeacon()
        }
        onUpdate(isBeaconActive)
    }

    private fun startBeacon() {
        beaconJob = scope.launch(Dispatchers.IO) {
            while (isActive && isBeaconActive) {
                // SOS Pattern: 3 Short, 3 Long, 3 Short
                // Or just a loud repeating chirp as requested "Loud repeating sound"
                // Let's do a high pitch chirp for location
                toneGenerator.startTone(ToneGenerator.TONE_CDMA_EMERGENCY_RINGBACK, 1000)
                delay(2000) // Repeat every 2 seconds
            }
        }
    }

    private fun stopBeacon() {
        isBeaconActive = false
        beaconJob?.cancel()
        toneGenerator.stopTone()
    }

    fun playEmergencyBeep(on: Boolean) {
        if (on) {
            toneGenerator.startTone(ToneGenerator.TONE_CDMA_EMERGENCY_RINGBACK, 5000)
        } else {
            toneGenerator.stopTone()
        }
    }

    // --- DIRECTION LOCK ---
    private var lockedAzimuth: Float? = null

    fun lockDirection(currentAzimuth: Float): String {
        lockedAzimuth = currentAzimuth
        return "LOCKED: ${HeadingUtils.getBearings(currentAzimuth)}"
    }

    fun getReturnGuidance(currentAzimuth: Float): String {
        val locked = lockedAzimuth ?: return "NO DIRECTION LOCKED"
        
        // To return, we need the OPPOSITE direction (180 degrees flip)
        val returnAzimuth = (locked + 180) % 360
        val diff = currentAzimuth - returnAzimuth
        
        // Normalize diff to -180 to 180
        val normalizedDiff = (diff + 540) % 360 - 180

        return when {
            abs(normalizedDiff) < 10 -> "✅ GO STRAIGHT"
            normalizedDiff < 0 -> "↪️ TURN RIGHT"
            else -> "↩️ TURN LEFT"
        }
    }
    
    fun clearLock() {
        lockedAzimuth = null
    }

    // --- WATER TIMER ---
    private var isTimerActive = false
    private var timerJob: Job? = null
    
    fun toggleWaterTimer(intervalMinutes: Long = 15, onAlert: (String) -> Unit): Boolean {
        isTimerActive = !isTimerActive
        if (isTimerActive) {
            startWaterTimer(intervalMinutes, onAlert)
        } else {
            stopWaterTimer()
        }
        return isTimerActive
    }

    private fun startWaterTimer(intervalMinutes: Long, onAlert: (String) -> Unit) {
        timerJob = scope.launch(Dispatchers.Default) {
             while (isActive && isTimerActive) {
                 delay(intervalMinutes * 60 * 1000)
                 withContext(Dispatchers.Main) {
                     onAlert("💧 HYDRATION CHECK: Drink small sip now.")
                     // Play a subtle beep
                     toneGenerator.startTone(ToneGenerator.TONE_PROP_BEEP, 200)
                 }
             }
        }
    }

    private fun stopWaterTimer() {
        isTimerActive = false
        timerJob?.cancel()
    }
    
    object HeadingUtils {
        fun getBearings(azimuth: Float): String {
            return when (azimuth) {
                in 0f..22.5f, in 337.5f..360f -> "N"
                in 22.5f..67.5f -> "NE"
                in 67.5f..112.5f -> "E"
                in 112.5f..157.5f -> "SE"
                in 157.5f..202.5f -> "S"
                in 202.5f..247.5f -> "SW"
                in 247.5f..292.5f -> "W"
                else -> "NW"
            }
        }
    }
}
