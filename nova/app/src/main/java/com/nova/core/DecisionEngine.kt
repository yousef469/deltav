package com.nova.core

object DecisionEngine {
    private var currentTree: Map<String, DecisionNode>? = null
    private var currentNodeId: String? = null

    fun startTree(treeId: String): DecisionNode? {
        currentTree = EmergencyTrees.getTree(treeId)
        currentNodeId = "start"
        return currentTree?.get("start")
    }

    fun processAnswer(yes: Boolean): DecisionNode? {
        val current = currentTree?.get(currentNodeId) ?: return null
        
        val nextId = if (yes) current.yesNodeId else current.noNodeId
        
        return if (nextId != null) {
            currentNodeId = nextId
            currentTree?.get(nextId)
        } else {
            null // End of flow
        }
    }
}

object EmergencyTrees {
    fun getTree(id: String): Map<String, DecisionNode> {
        return when(id) {
            "bleeding" -> bleedingTree
            "heat_stroke" -> heatStrokeTree
            "cpr" -> cprTree
            "lost" -> lostTree
            else -> emptyMap()
        }
    }

    private val bleedingTree = mapOf(
        "start" to DecisionNode("start", "Is the bleeding soaking through clothes?", "heavy_pressure", "clean_wound"),
        "heavy_pressure" to DecisionNode("heavy_pressure", "ACTION: Apply direct pressure immediately with cloth/hand.", "tourniquet_check", null, DecisionType.ACTION),
        "tourniquet_check" to DecisionNode("tourniquet_check", "Is it on an arm or leg AND pressure isn't working?", "apply_tourniquet", "continue_pressure"),
        "apply_tourniquet" to DecisionNode("apply_tourniquet", "ACTION: Apply Tourniquet 2 inches above wound. Tighten until bleeding stops.", null, null, DecisionType.END),
        "continue_pressure" to DecisionNode("continue_pressure", "ACTION: Hold pressure for 10+ minutes. Do not peek.", null, null, DecisionType.END),
        "clean_wound" to DecisionNode("clean_wound", "ACTION: Wash with clean water. Apply bandage.", null, null, DecisionType.END)
    )

    private val heatStrokeTree = mapOf(
        "start" to DecisionNode("start", "Is the person confused, hot, and NOT sweating?", "emergency_cool", "heat_exhaustion"),
        "emergency_cool" to DecisionNode("emergency_cool", "ACTION: HEAT STROKE. Cool immediately! Water on skin, fan them.", "call_help", null, DecisionType.ACTION),
        "call_help" to DecisionNode("call_help", "ACTION: Call Emergency. Do not give water to drink if unconscious.", null, null, DecisionType.END),
        "heat_exhaustion" to DecisionNode("heat_exhaustion", "ACTION: Move to shade. Give water slowly. Elevate legs.", null, null, DecisionType.END)
    )

    private val cprTree = mapOf(
        "start" to DecisionNode("start", "Is the person breathing?", "recovery_pos", "start_compressions"),
        "recovery_pos" to DecisionNode("recovery_pos", "ACTION: Place in recovery position (on side). Wait for help.", null, null, DecisionType.END),
        "start_compressions" to DecisionNode("start_compressions", "ACTION: Start CPR. 30 Chest Compressions. Push hard and fast.", "breaths", null, DecisionType.ACTION),
        "breaths" to DecisionNode("breaths", "Give 2 rescue breaths? (Only if trained)", "continue_cycle", "continue_cycle"),
        "continue_cycle" to DecisionNode("continue_cycle", "ACTION: Continue 30:2 cycle until help arrives.", null, null, DecisionType.END)
    )

    private val lostTree = mapOf(
        "start" to DecisionNode("start", "Do you know which direction you came from?", "backtrack", "stop_moving"),
        "backtrack" to DecisionNode("backtrack", "ACTION: Carefully backtrack only if tracks are visible.", null, null, DecisionType.END),
        "stop_moving" to DecisionNode("stop_moving", "ACTION: STOP. Do not move further. You are now \"Subject Zero\".", "shelter", null, DecisionType.ACTION),
        "shelter" to DecisionNode("shelter", "Can you build a fire/signal?", "build_signal", "find_shelter"),
        "build_signal" to DecisionNode("build_signal", "ACTION: Build 3 fires in a triangle (International Distress Signal).", null, null, DecisionType.END),
        "find_shelter" to DecisionNode("find_shelter", "ACTION: Find natural shelter. Conserve energy/water.", null, null, DecisionType.END)
    )
}
