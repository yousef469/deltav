package com.nova.core

import android.app.ActivityManager
import android.content.Context
import android.util.Log

class DeviceProfile(private val context: Context) {

    val ramCategory: RAMCategory by lazy {
        detectRAMCategory()
    }

    val optimalThreads: Int by lazy {
        val cores = Runtime.getRuntime().availableProcessors()
        when (ramCategory) {
            RAMCategory.GB_2 -> 2
            RAMCategory.GB_3 -> 2
            RAMCategory.GB_4_PLUS -> 4.coerceAtMost(cores)
        }
    }

    private fun detectRAMCategory(): RAMCategory {
        val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val memoryInfo = ActivityManager.MemoryInfo()
        activityManager.getMemoryInfo(memoryInfo)
        
        val totalRamGB = memoryInfo.totalMem / (1024.0 * 1024.0 * 1024.0)
        Log.d("NovaDevice", "Total RAM detected: $totalRamGB GB")
        
        return when {
            totalRamGB <= 2.2 -> RAMCategory.GB_2
            totalRamGB <= 3.2 -> RAMCategory.GB_3
            else -> RAMCategory.GB_4_PLUS
        }
    }
}
