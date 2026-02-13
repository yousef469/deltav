package com.nova.core

import android.content.Context
import android.util.Log
import com.nova.db.SQLiteDomainDB
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import java.io.File
import kotlin.math.roundToInt

class NovaProductionEngine(
    private val context: Context,
    private val deviceProfile: DeviceProfile
) {

    private val celestialNavigator = CelestialNavigator()
    private var currentDomain: SQLiteDomainDB? = null
    private var currentDomainLocked: String? = null

    init {
        setDomain("nova_knowledge.db")
    }

    fun setDomainLocked(domain: String?) {
        currentDomainLocked = domain
        Log.d("NovaEngine", "Domain locked to: $domain")
    }

    suspend fun preWarmAI() {
        // No-op in Lite Edition
    }

    fun setDomain(dbName: String) {
        currentDomain?.close()
        currentDomain = SQLiteDomainDB(context, dbName)
    }

    fun browseCategory(category: String): String {
        val entries = currentDomain?.browseByCategory(category) ?: emptyList()
        if (entries.isEmpty()) return "No records found for $category."
        
        return entries.joinToString("\n\n") { (q, a) ->
            "Q: $q\nA: $a"
        }
    }

    suspend fun processVoiceCommand(audioFile: File): String {
        return "Voice interaction disabled in Lite Edition."
    }

    suspend fun processTextCommand(userInput: String): String {
        return try {
            val analyzer = QueryAnalyzer()
            val intent = analyzer.analyze(userInput)
            Log.d("NovaEngine", "Lite Intent: $intent | Input: $userInput")

            // 1. ALWAYS SEARCH THE VAULT FIRST (User requested behavior)
            // We search for broad matches to ensure "every request goes to the database"
            val searchResults = currentDomain?.search(userInput, limit = 1) ?: emptyList()
            
            if (searchResults.isNotEmpty()) {
                // Determine header based on intent roughly
                val header = when(intent) {
                    QueryIntent.MEDICAL -> "🚑 [MEDICAL DATABASE]"
                    QueryIntent.FARMING -> "🌾 [AGRI-VAULT]"
                    QueryIntent.MECHANICAL -> "⚙️ [MECHANICAL DB]"
                    else -> "🛡️ [SILICON VAULT]"
                }
                return "$header\n\n${searchResults[0]}"
            }

            // 2. Navigation Handling (If no direct DB match)
            if (intent == QueryIntent.NAVIGATION) {
                return handleSurvivalNav(userInput)
            }

            // 3. Fallback to Expert System (Only if DB failed)
            if (intent == QueryIntent.EMERGENCY || (intent == QueryIntent.MEDICAL)) {
                val ruleResult = ExpertSystem.getDecision(intent, userInput)
                if (!ruleResult.contains("fallback", true)) {
                    return "🧠 [EXPERT SYSTEM]\n\n$ruleResult"
                }
            }

            // 4. Last Resort
            HardcodedSurvival.getEmergencyTip(userInput)

        } catch (e: Exception) {
            Log.e("NovaEngine", "Lite Pipeline error", e)
            HardcodedSurvival.getEmergencyTip(userInput)
        }
    }

    private fun handleSurvivalNav(userInput: String): String {
        // Mock current location (Egypt Western Desert example)
        val currentLat = 25.0
        val currentLon = 29.0
        
        val keyword = if (userInput.contains("egypt", true)) "egypt" 
                     else if (userInput.contains("sahara", true)) "sahara"
                     else if (userInput.contains("gobi", true)) "gobi"
                     else "rescue"

        val landmarks = currentDomain?.browseByCategory("landmark")?.filter { it.first.contains(keyword, true) } ?: emptyList()
        if (landmarks.isEmpty()) {
            return "I couldn't find a rescue point in my database for that area. Orient yourself using the Sun (Morning: East, Evening: West) or Polaris (North)."
        }
        
        val firstLandmark = landmarks[0]
        val coordMatch = Regex("Coordinates: ([0-9.-]+), ([0-9.-]+)").find(firstLandmark.second)
        
        return if (coordMatch != null) {
            val targetLat = coordMatch.groupValues[1].toDouble()
            val targetLon = coordMatch.groupValues[2].toDouble()
            
            val bearing = celestialNavigator.calculateBearing(currentLat, currentLon, targetLat, targetLon)
            val starGuide = celestialNavigator.getPolarisInstruction(bearing)
            val sunGuide = celestialNavigator.getSunInstruction(bearing, isMorning = true)
            
            "RESCUE MISSION CALIBRATED.\nDestination: ${firstLandmark.first}\nBearing: ${bearing.roundToInt()}°\n\nGUIDE:\n1. $starGuide\n2. $sunGuide\n\nWalk steadily towards the target."
        } else {
            "Found rescue point: ${firstLandmark.first}. Follow the North Star for general orientation."
        }
    }
}
