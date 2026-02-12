package com.nova.core

import android.content.Context
import android.content.Intent
import android.location.Location
import android.location.LocationManager
import android.net.Uri
import com.nova.db.SQLiteDomainDB

data class EmergencyInfo(
    val procedures: List<String>,
    val localNumbers: Map<String, String>,
    val lastKnownLocation: Location?
)

class EmergencySOS(
    private val context: Context,
    private val domainDB: SQLiteDomainDB
) {
    fun getEmergencyInfo(situation: String): EmergencyInfo {
        val procedures = domainDB.search("emergency $situation", limit = 5)
        return EmergencyInfo(
            procedures = procedures,
            localNumbers = mapOf("universal" to "112", "india" to "112", "us" to "911"),
            lastKnownLocation = getLastKnownLocation()
        )
    }

    fun shareSOSViaSMS(phoneNumber: String, message: String, location: Location?) {
        val locStr = location?.let { "Location: ${it.latitude},${it.longitude}" } ?: "Location: Unknown"
        val fullMessage = "🚨 EMERGENCY SOS 🚨\n$message\n$locStr\nSent from Nova"
        
        val intent = Intent(Intent.ACTION_SENDTO).apply {
            data = Uri.parse("smsto:$phoneNumber")
            putExtra("sms_body", fullMessage)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }

    private fun getLastKnownLocation(): Location? {
        val lm = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return try {
            lm.getLastKnownLocation(LocationManager.GPS_PROVIDER) ?: 
            lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
        } catch (e: SecurityException) { null }
    }
}
