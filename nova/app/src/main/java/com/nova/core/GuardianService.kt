package com.nova.core

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.telephony.SmsManager
import android.util.Log
import kotlinx.coroutines.*

class GuardianService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + Job())
    private var checkInTimer: Job? = null
    private var emergencyContact: String? = null
    private var lastLocation: String = "Unknown"

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        when (action) {
            "START_MONITOR" -> {
                val duration = intent.getLongExtra("DURATION_MS", 3600000L) // Default 1 hour
                emergencyContact = intent.getStringExtra("CONTACT")
                lastLocation = intent.getStringExtra("LOCATION") ?: "Unknown"
                startTimer(duration)
            }
            "CHECK_IN" -> {
                resetTimer()
            }
            "STOP_MONITOR" -> {
                stopSelf()
            }
        }
        return START_STICKY
    }

    private fun startTimer(duration: Long) {
        checkInTimer?.cancel()
        checkInTimer = serviceScope.launch {
            delay(duration)
            triggerEmergency()
        }
    }

    private fun resetTimer() {
        Log.d("GuardianService", "User checked in. Resetting timer.")
        checkInTimer?.cancel()
        // In real use, we'd restart or wait for new start command
    }

    private fun triggerEmergency() {
        emergencyContact?.let { contact ->
            try {
                val smsManager = SmsManager.getDefault()
                val message = "🚨 NOVA EMERGENCY ALERT: User failed to check-in. Last known coords: $lastLocation. Please initiate rescue sequence."
                smsManager.sendTextMessage(contact, null, message, null, null)
                Log.d("GuardianService", "Emergency SMS sent to $contact")
            } catch (e: Exception) {
                Log.e("GuardianService", "Failed to send SMS", e)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
