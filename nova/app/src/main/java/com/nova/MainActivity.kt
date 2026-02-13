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
    private lateinit var survivalActions: SurvivalActions
    private var isRecording = false
    private var isToolsOverlayVisible = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        deviceProfile = DeviceProfile(this)
        engine = NovaProductionEngine(this, deviceProfile)
        
        compass = SurvivalCompass(this)
        survivalTools = SurvivalTools(this)
        survivalActions = SurvivalActions(this)

        setupCompass()
        setupListeners()
        checkPermissions()
        setupTools()
        updateLanguageUI()
        activateBatterySaver()
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
            
            // Direction Lock Logic
            if (binding.toolsDashboard.visibility == android.view.View.VISIBLE && binding.textLockGuidance.visibility == android.view.View.VISIBLE) {
                 val guidance = survivalActions.getReturnGuidance(azimuth)
                 binding.textLockGuidance.text = guidance
                 
                 // Visual feedback for lock
                 if (guidance.contains("STRAIGHT")) {
                     binding.textLockGuidance.setTextColor(Color.GREEN)
                 } else {
                     binding.textLockGuidance.setTextColor(Color.YELLOW)
                 }
            }
        }
    }

    override fun onBackPressed() {
        if (binding.decisionOverlay.visibility == android.view.View.VISIBLE) {
            endDecisionFlow()
            return
        }
        if (binding.emergencyDashboard.visibility == android.view.View.VISIBLE) {
            binding.emergencyDashboard.visibility = android.view.View.GONE
            return
        }
        if (binding.toolsDashboard.visibility == android.view.View.VISIBLE) {
            closeToolsDashboard()
            return
        }
        if (currentMode != AppMode.GENERAL) {
            exitMode()
        } else {
            super.onBackPressed()
        }
    }

    private var isMorseActive = false

    private fun setupListeners() {
        // Dashboard Categories
        binding.cardFarming.setOnClickListener { 
            startActivity(android.content.Intent(this, com.nova.core.FarmingActivity::class.java))
        }
        binding.cardManualRepair.setOnClickListener { 
            startActivity(android.content.Intent(this, com.nova.core.RepairingActivity::class.java))
        }
        binding.cardMedical.setOnClickListener { switchToMode(AppMode.MEDICAL) }
        
        // NEW: Top Emergency Card
        binding.cardEmergencyTop.setOnClickListener { 
            showEmergencyDashboard()
        }

        binding.cardNavigator.setOnClickListener {
            android.content.Intent(this, NavigatorActivity::class.java).also {
                startActivity(it)
            }
        }

        binding.cardTools.setOnClickListener {
            showToolsDashboard()
        }
        
        // NEW SECTIONS
        binding.cardEducation.setOnClickListener {
           startActivity(android.content.Intent(this, com.nova.core.EducationActivity::class.java))
        }
        
        binding.cardCoding.setOnClickListener {
           startActivity(android.content.Intent(this, com.nova.core.CodingActivity::class.java))
        }
        
        binding.cardGame.setOnClickListener {
           startActivity(android.content.Intent(this, com.nova.core.ChessActivity::class.java))
        }

        binding.btnHome.setOnClickListener { exitMode() }
        
        // Language Toggle
        binding.btnLanguage.setOnClickListener {
            LanguageManager.nextLanguage()
            updateLanguageUI()
        }

        binding.btnSendText.setOnClickListener {
            val query = binding.editManualInput.text.toString()
            if (query.isNotBlank()) {
                handleTextQuery(query)
            }
        }
        
        // Emergency Dashboard Listeners
        binding.btnEmBleeding.setOnClickListener { startDecisionFlow("bleeding") }
        binding.btnEmUnconscious.setOnClickListener { startDecisionFlow("cpr") }
        binding.btnEmHeat.setOnClickListener { startDecisionFlow("heat_stroke") }
        binding.btnEmLost.setOnClickListener { startDecisionFlow("lost") }
        binding.btnEmMorse.setOnClickListener {
            isMorseActive = !isMorseActive
            if (isMorseActive) {
                survivalTools.startSOS { active ->
                    survivalActions.playEmergencyBeep(active)
                }
                binding.btnEmMorse.text = LanguageManager.get("sos_morse_stop")
                binding.btnEmMorse.backgroundTintList = android.content.res.ColorStateList.valueOf(Color.RED)
            } else {
                survivalTools.stopLighthouse()
                survivalActions.playEmergencyBeep(false)
                binding.btnEmMorse.text = LanguageManager.get("sos_morse_start")
                binding.btnEmMorse.backgroundTintList = android.content.res.ColorStateList.valueOf(Color.parseColor("#FFCC0000"))
            }
        }
        binding.btnEmSentinel.setOnClickListener { 
            val intent = android.content.Intent(this, com.nova.core.SignalMonitorService::class.java)
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                startForegroundService(intent)
            } else {
                startService(intent)
            }
            android.widget.Toast.makeText(this, "SENTINEL ACTIVE: Sleeping...", android.widget.Toast.LENGTH_LONG).show()
            binding.emergencyDashboard.visibility = android.view.View.GONE
        }
        binding.btnEmBack.setOnClickListener { binding.emergencyDashboard.visibility = android.view.View.GONE }
        
        // Decision Tree Listeners
        binding.btnYes.setOnClickListener { processDecision(true) }
        binding.btnNo.setOnClickListener { processDecision(false) }
        binding.btnDecisionReset.setOnClickListener { endDecisionFlow() }
        
        // Tools Dashboard Listeners
        binding.btnToolBeacon.setOnClickListener { 
            survivalActions.toggleBeacon { active ->
                binding.btnToolBeacon.text = if (active) "🔊 BEACON ACTIVE (STOP)" else "🔊 SOUND BEACON (OFF)"
                binding.btnToolBeacon.backgroundTintList = android.content.res.ColorStateList.valueOf(if (active) Color.RED else Color.parseColor("#ff9800"))
            }
        }
        
        binding.btnToolLock.setOnClickListener {
            if (binding.textLockGuidance.visibility == android.view.View.VISIBLE) {
                // Unlock
                survivalActions.clearLock()
                binding.textLockGuidance.visibility = android.view.View.GONE
                binding.btnToolLock.text = "🧭 LOCK DIRECTION"
                binding.btnToolLock.backgroundTintList = android.content.res.ColorStateList.valueOf(Color.parseColor("#00bcd4"))
            } else {
                // Lock
                val currentAzim = -binding.compassNeedle.rotation
                val msg = survivalActions.lockDirection(currentAzim)
                binding.textLockGuidance.text = msg
                binding.textLockGuidance.visibility = android.view.View.VISIBLE
                binding.btnToolLock.text = "🔓 UNLOCK DIRECTION"
                binding.btnToolLock.backgroundTintList = android.content.res.ColorStateList.valueOf(Color.GREEN)
            }
        }
        
        binding.btnToolWater.setOnClickListener {
            val active = survivalActions.toggleWaterTimer(15) { alert ->
                android.widget.Toast.makeText(this, alert, android.widget.Toast.LENGTH_LONG).show()
            }
            binding.btnToolWater.text = if (active) "💧 TIMER ACTIVE (15m)" else "💧 WATER TIMER (OFF)"
            binding.btnToolWater.backgroundTintList = android.content.res.ColorStateList.valueOf(if (active) Color.BLUE else Color.parseColor("#2196f3"))
        }

        binding.btnToolBack.setOnClickListener { closeToolsDashboard() }

        binding.pttButton.setOnTouchListener(null)
    }
    
    // BATTERY SAVER OPTIMIZATION
    private fun activateBatterySaver() {
        // Dark Mode is already inherent in the UI (Black backgrounds)
        // We can disable heavy animations or background tasks if not needed
        // For now, we ensure the screen doesn't stay on unnecessarily unless in a mode
        window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }

    private fun showEmergencyDashboard() {
        binding.emergencyDashboard.visibility = android.view.View.VISIBLE
        binding.emergencyDashboard.bringToFront()
    }
    
    private fun showToolsDashboard() {
        binding.toolsDashboard.visibility = android.view.View.VISIBLE
        binding.toolsDashboard.bringToFront()
        isToolsOverlayVisible = true
    }

    private fun closeToolsDashboard() {
        binding.toolsDashboard.visibility = android.view.View.GONE
        isToolsOverlayVisible = false
    }

    private fun updateLanguageUI() {
        binding.btnLanguage.text = LanguageManager.currentLanguage.code.uppercase()
        binding.titleText.text = LanguageManager.get("welcome")
        
        // Dashboard Categories
        binding.textEmergencyTitle.text = LanguageManager.get("emergency_title")
        binding.textFarming.text = LanguageManager.get("farming")
        binding.textRepairing.text = LanguageManager.get("repairing")
        binding.textMedical.text = LanguageManager.get("medical")
        binding.textEducation.text = LanguageManager.get("education")
        binding.textCoding.text = LanguageManager.get("coding")
        binding.textChess.text = LanguageManager.get("chess")
        binding.textNavigator.text = LanguageManager.get("navigator")
        binding.textTools.text = LanguageManager.get("tools")
        binding.textDisclaimer.text = LanguageManager.get("disclaimer")
        
        binding.editManualInput.hint = LanguageManager.get("status_searching") // Reusing searching for hint
        binding.btnHome.text = "🔙 " + LanguageManager.get("welcome")
        
        // SOS Morse
        binding.btnEmMorse.text = if (isMorseActive) LanguageManager.get("sos_morse_stop") else LanguageManager.get("sos_morse_start")

        // Update mode text if active
        if (currentMode != AppMode.GENERAL) {
             binding.titleText.text = when(currentMode) {
                 AppMode.MEDICAL -> LanguageManager.get("medical_mode")
                 AppMode.FARMING -> LanguageManager.get("farming_mode")
                 AppMode.SOS -> LanguageManager.get("sos_mode")
                 else -> "${currentMode.name} MODE"
             }
        }
        
        if (binding.statusText.text == "Survival Database Ready." || binding.statusText.text == "Voice Assistant Ready") {
            binding.statusText.text = LanguageManager.get("status_ready")
        }
    }

    private fun startDecisionFlow(treeId: String) {
        val rootNode = DecisionEngine.startTree(treeId)
        if (rootNode != null) {
            binding.emergencyDashboard.visibility = android.view.View.GONE
            binding.decisionOverlay.visibility = android.view.View.VISIBLE
            binding.decisionOverlay.bringToFront()
            displayNode(rootNode)
        }
    }

    private fun processDecision(yes: Boolean) {
        val nextNode = DecisionEngine.processAnswer(yes)
        if (nextNode != null) {
            displayNode(nextNode)
        } else {
        }
    }

    private fun displayNode(node: DecisionNode) {
        binding.decisionQuestion.text = node.text
        
        if (node.type == DecisionType.END || node.type == DecisionType.ACTION) {
             binding.btnYes.visibility = android.view.View.GONE
             binding.btnNo.visibility = android.view.View.GONE
             binding.btnDecisionReset.visibility = android.view.View.VISIBLE
             
             if (node.type == DecisionType.ACTION) {
                 if (node.yesNodeId != null) {
                      binding.btnYes.visibility = android.view.View.VISIBLE
                      binding.btnYes.text = "NEXT >"
                      binding.btnNo.visibility = android.view.View.GONE
                 }
             }
        } else {
            binding.btnYes.visibility = android.view.View.VISIBLE
            binding.btnNo.visibility = android.view.View.VISIBLE
            binding.btnYes.text = "YES"
            binding.btnNo.text = "NO"
            binding.btnDecisionReset.visibility = android.view.View.GONE
        }
    }

    private fun endDecisionFlow() {
        binding.decisionOverlay.visibility = android.view.View.GONE
        binding.emergencyDashboard.visibility = android.view.View.VISIBLE // Go back to dashboard
    }

    private fun handleTextQuery(query: String) {
        binding.editManualInput.setText("")
        binding.statusText.text = LanguageManager.get("status_searching")
        
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
    
    // Legacy method - can remove or repurpose? 
    // Kept for minimizing diff but practically unused now as Tools has its own Dashboard
    // private fun showToolsDashboardOld() { ... }

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
        updateLanguageUI()
        
        binding.aiCard.setCardBackgroundColor(Color.parseColor("#22FFFFFF"))
        binding.btnHome.visibility = android.view.View.GONE
        if (binding.compassOverlay.visibility == android.view.View.VISIBLE) {
            toggleCompass()
        }
        engine.setDomainLocked(null)
    }

    private fun switchToMode(mode: AppMode) {
        currentMode = mode
        updateLanguageUI()
        // binding.titleText.text = "${mode.name} MODE" (Handled in updateLanguageUI)
        
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
