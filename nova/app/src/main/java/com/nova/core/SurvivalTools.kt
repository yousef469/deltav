package com.nova.core

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.hardware.camera2.CameraManager
import android.util.Log
import kotlinx.coroutines.*

class SurvivalTools(private val context: Context) : SensorEventListener {

    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
    private var cameraId: String? = null

    var onPressureChanged: ((Float, String) -> Unit)? = null
    private var lastPressure = 0f

    init {
        try {
            cameraId = cameraManager.cameraIdList[0]
        } catch (e: Exception) {
            Log.e("SurvivalTools", "Camera not available", e)
        }
    }

    // --- LIGHTHOUSE MODE (Morse SOS) ---
    private var lighthouseJob: Job? = null

    fun startSOS() {
        stopLighthouse()
        lighthouseJob = CoroutineScope(Dispatchers.Default).launch {
            while (isActive) {
                // SOS: ... --- ...
                pulseMorse("...---...")
                delay(3000) // Wait between cycles
            }
        }
    }

    private suspend fun pulseMorse(pattern: String) {
        for (char in pattern) {
            val duration = if (char == '.') 200L else 600L
            setFlashlight(true)
            delay(duration)
            setFlashlight(false)
            delay(200) // Gap between signals
        }
    }

    private fun setFlashlight(on: Boolean) {
        try {
            cameraId?.let { cameraManager.setTorchMode(it, on) }
        } catch (e: Exception) {
            Log.e("SurvivalTools", "Flashlight error", e)
        }
    }

    fun stopLighthouse() {
        lighthouseJob?.cancel()
        setFlashlight(false)
    }

    // --- WEATHER STATION (Barometer) ---
    fun startWeatherMonitoring() {
        val pressureSensor = sensorManager.getDefaultSensor(Sensor.TYPE_PRESSURE)
        pressureSensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    fun stopWeatherMonitoring() {
        sensorManager.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_PRESSURE) {
            val currentPressure = event.values[0]
            val trend = when {
                lastPressure == 0f -> "Stable (Calibrating)"
                currentPressure < lastPressure - 0.5f -> "STORM WARNING: Pressure Drop"
                currentPressure > lastPressure + 0.5f -> "Improving Weather"
                else -> "Stable"
            }
            lastPressure = currentPressure
            onPressureChanged?.invoke(currentPressure, trend)
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    // --- SHADOW CLOCK (Sun Positioning) ---
    fun calculateLocalTime(shadowLengthCm: Double, stickHeightCm: Double, azimuthDeg: Double): String {
        // High-level estimation based on Sun Azimuth
        // 90 deg = 06:00 (East), 180 deg = 12:00 (South/Noon), 270 deg = 18:00 (West)
        val hours = (azimuthDeg / 15.0).toInt()
        val minutes = ((azimuthDeg % 15.0) * 4.0).toInt()
        
        return String.format("%02d:%02d (Solar Est)", hours, minutes)
    }
}
