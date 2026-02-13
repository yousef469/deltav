package com.nova.core

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Build
import android.os.IBinder
import android.telephony.PhoneStateListener
import android.telephony.SignalStrength
import android.telephony.TelephonyManager
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.*

class SignalMonitorService : Service() {

    private lateinit var telephonyManager: TelephonyManager
    private var isMonitoring = false
    private val scope = CoroutineScope(Dispatchers.Default)
    private var toneGenerator: ToneGenerator? = null

    private fun maximizeVolume() {
        val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM)
        audioManager.setStreamVolume(AudioManager.STREAM_ALARM, maxVolume, 0)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        telephonyManager = getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        toneGenerator = ToneGenerator(AudioManager.STREAM_ALARM, 100)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (!isMonitoring) {
            startForeground(1, createNotification("Scanning for Rescue Signal..."))
            startMonitoring()
        }
        return START_STICKY
    }

    private fun startMonitoring() {
        isMonitoring = true
        
        // Polling check for network (Robust method for API 30+)
        scope.launch {
            while (isMonitoring) {
                checkSignal()
                delay(5000) // Check every 5 seconds
            }
        }
    }

    private fun checkSignal() {
        val networkType = telephonyManager.networkType
        val isConnected = telephonyManager.dataState == TelephonyManager.DATA_CONNECTED || 
                          networkType != TelephonyManager.NETWORK_TYPE_UNKNOWN

        if (isConnected) {
            triggerAlarm()
        }
    }

    private fun triggerAlarm() {
        // WAKE UP!
        maximizeVolume()
        repeat(5) {
            toneGenerator?.startTone(ToneGenerator.TONE_CDMA_EMERGENCY_RINGBACK, 1000)
            Thread.sleep(1200)
        }
        
        // Update notification
        val notification = createNotification("SIGNAL DETECTED! WAKE UP AND SEND SOS!")
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(1, notification)
    }

    private fun createNotification(text: String): Notification {
        return NotificationCompat.Builder(this, "NOVA_SIGNAL_CHANNEL")
            .setContentTitle("Nova Sentinel")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_menu_search)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "NOVA_SIGNAL_CHANNEL",
                "Signal Monitor",
                NotificationManager.IMPORTANCE_HIGH
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        isMonitoring = false
        toneGenerator?.release()
        super.onDestroy()
    }
}
