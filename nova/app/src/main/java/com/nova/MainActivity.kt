package com.nova

import android.Manifest
import android.graphics.Color
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.MotionEvent
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.nova.core.*
import com.nova.databinding.ActivityMainBinding
import kotlinx.coroutines.launch
import java.io.File

enum class AppMode { GENERAL, FARMING, MEDICAL, ASTRONOMY, MECHANICAL, SOS }

class MainActivity : AppCompatActivity() {
    private var currentMode = AppMode.GENERAL

    private lateinit var binding: ActivityMainBinding
    private lateinit var deviceProfile: DeviceProfile
    private lateinit var engine: NovaProductionEngine
    private lateinit var compass: SurvivalCompass
    private lateinit var survivalTools: SurvivalTools
    private var isRecording = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        deviceProfile = DeviceProfile(this)
        engine = NovaProductionEngine(this, deviceProfile)
        
        compass = SurvivalCompass(this)
        survivalTools = SurvivalTools(this)

        setupCompass()
        setupListeners()
        checkPermissions()
        setupTools()
    }

    private fun checkPermissions() {
        val permissions = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.BODY_SENSORS,
            Manifest.permission.CAMERA,
            Manifest.permission.SEND_SMS
        )
        val toRequest = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (toRequest.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, toRequest.toTypedArray(), 101)
        }
    }

    private fun setupCompass() {
        compass.onDirectionChanged = { azimuth, direction ->
            binding.compassDirText.text = direction
            binding.compassNeedle.rotation = -azimuth
        }
    }

    private fun setupListeners() {
        // Dashboard Categories
        binding.cardMedical.setOnClickListener {
            switchToMode(AppMode.MEDICAL)
        }

        binding.cardFarming.setOnClickListener {
            switchToMode(AppMode.FARMING)
        }

        binding.cardNav.setOnClickListener {
            switchToMode(AppMode.ASTRONOMY)
        }

        binding.cardSOS.setOnClickListener {
            switchToMode(AppMode.SOS)
        }

        binding.cardMechanical.setOnClickListener {
            switchToMode(AppMode.MECHANICAL)
        }

        binding.cardNavigator.setOnClickListener {
            android.content.Intent(this, NavigatorActivity::class.java).also {
                startActivity(it)
            }
        }

        binding.cardTools.setOnClickListener {
            switchToMode(AppMode.GENERAL) // Re-using general for tools view
            showToolsDashboard()
        }

        binding.btnHome.setOnClickListener {
            exitMode()
        }

        binding.btnSendText.setOnClickListener {
            val query = binding.editManualInput.text.toString()
            if (query.isNotBlank()) {
                handleTextQuery(query)
            }
        }

        // Voice button is disabled in UI but we'll clear listener to be safe
        binding.pttButton.setOnTouchListener(null)
    }

    private fun handleTextQuery(query: String) {
        binding.editManualInput.setText("")
        binding.statusText.text = "Searching..."
        
        lifecycleScope.launch {
            val response = engine.processTextCommand(query)
            binding.responseText.text = response
            binding.statusText.text = "Hardened Core Active"
        }
    }

    private fun setupTools() {
        survivalTools.onPressureChanged = { pressure, trend ->
            if (currentMode == AppMode.GENERAL && binding.titleText.text == "SURVIVAL TOOLS") {
                binding.responseText.text = "📟 BAROMETER: ${String.format("%.2f", pressure)} hPa\n📉 TREND: $trend\n\n[SOS Signaling is AVAILABLE]"
            }
        }
    }

    private fun showToolsDashboard() {
        binding.titleText.text = "SURVIVAL TOOLS"
        binding.statusText.text = "HARDWARE SENSORS ACTIVE"
        binding.responseText.text = "Initializing Hardware Tools...\n\nClick PTT (now SOS) to toggle Lighthouse Signaling."
        binding.btnHome.visibility = android.view.View.VISIBLE
        binding.aiCard.setCardBackgroundColor(Color.parseColor("#44FF9800"))
        
        // Temporarily repurpose PTT button as SOS toggle in Tools mode
        binding.pttButton.visibility = android.view.View.VISIBLE
        binding.pttButton.text = "🆘"
        binding.pttButton.setOnClickListener {
            toggleSOS()
        }
        
        survivalTools.startWeatherMonitoring()
    }

    private var sosActive = false
    private fun toggleSOS() {
        sosActive = !sosActive
        if (sosActive) {
            survivalTools.startSOS()
            binding.statusText.text = "🆘 SOS SIGNALING ACTIVE"
            binding.pttButton.setBackgroundColor(Color.RED)
        } else {
            survivalTools.stopLighthouse()
            binding.statusText.text = "Ready"
            binding.pttButton.setBackgroundColor(Color.DKGRAY)
        }
    }

    private fun exitMode() {
        survivalTools.stopWeatherMonitoring()
        survivalTools.stopLighthouse()
        sosActive = false
        binding.pttButton.visibility = android.view.View.GONE
        
        currentMode = AppMode.GENERAL
        binding.titleText.text = "NOVA LITE"
        binding.responseText.text = "Survival Database Ready."
        binding.aiCard.setCardBackgroundColor(Color.parseColor("#22FFFFFF"))
        binding.btnHome.visibility = android.view.View.GONE
        if (binding.compassOverlay.visibility == android.view.View.VISIBLE) {
            toggleCompass()
        }
        engine.setDomainLocked(null)
    }

    private fun switchToMode(mode: AppMode) {
        currentMode = mode
        binding.titleText.text = "${mode.name} MODE"
        
        binding.responseText.text = ""
        binding.statusText.text = "DIRECT VAULT ACCESS"
        binding.btnHome.visibility = android.view.View.VISIBLE
        
        val header = when(mode) {
            AppMode.MEDICAL -> "🛑 MEDICAL VAULT UNLOCKED\nAsk about trauma, first aid, or medicine."
            AppMode.FARMING -> "🌾 FARMING VAULT UNLOCKED\nAsk about crops, irrigation, or soil."
            AppMode.MECHANICAL -> "⚙️ MECHANICAL VAULT UNLOCKED\nAsk about repairs or building."
            AppMode.ASTRONOMY -> "🌌 CELESTIAL VAULT UNLOCKED\nNavigation sensors active."
            AppMode.SOS -> "🚨 EMERGENCY VAULT UNLOCKED\nIMMEDIATE RESCUE PROTOCOLS ACTIVE."
            else -> "NOVA LITE"
        }
        
        binding.responseText.text = header
        binding.responseText.scrollTo(0, 0)
        
        val color = when(mode) {
            AppMode.MEDICAL -> "#44FF0000"
            AppMode.FARMING -> "#4400FF00" 
            AppMode.ASTRONOMY -> "#440000FF"
            AppMode.MECHANICAL -> "#44FFA500"
            else -> "#22FFFFFF"
        }
        binding.aiCard.setCardBackgroundColor(Color.parseColor(color))
        
        if (mode == AppMode.ASTRONOMY) {
            toggleCompass()
        } else {
            if (binding.compassOverlay.visibility == android.view.View.VISIBLE) {
                toggleCompass()
            }
        }
        
        engine.setDomainLocked(mode.name.lowercase())
    }

    private fun toggleCompass() {
        if (binding.compassOverlay.visibility == android.view.View.VISIBLE) {
            binding.compassOverlay.visibility = android.view.View.GONE
            compass.stop()
        } else {
            binding.compassOverlay.visibility = android.view.View.VISIBLE
            compass.start()
        }
    }

    override fun onResume() {
        super.onResume()
        if (binding.compassOverlay.visibility == android.view.View.VISIBLE) {
            compass.start()
        }
    }

    override fun onPause() {
        super.onPause()
        compass.stop()
    }

    override fun onDestroy() {
        super.onDestroy()
    }
}
