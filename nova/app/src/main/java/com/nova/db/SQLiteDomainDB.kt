package com.nova.db

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.util.Log

data class DomainEntry(
    val id: Int,
    val keywords: String,
    val question: String,
    val answer: String,
    val priority: Int
)

class SQLiteDomainDB(
    private val context: Context,
    dbName: String
) : SQLiteOpenHelper(context, dbName, null, 2), AutoCloseable {

    override fun onCreate(db: SQLiteDatabase) {
        // --- NAVIGATION & ASTRONOMY ---
        db.execSQL("CREATE TABLE stars (id INTEGER PRIMARY KEY, name TEXT NOT NULL, common_name TEXT, constellation TEXT, magnitude REAL, right_ascension TEXT, declination TEXT, visible_hemisphere TEXT, description TEXT, navigation_use TEXT)")
        db.execSQL("CREATE TABLE star_visibility (id INTEGER PRIMARY KEY, star_id INTEGER, country TEXT, region TEXT, latitude_min REAL, latitude_max REAL, best_month INTEGER, best_time TEXT, position_guide TEXT, FOREIGN KEY (star_id) REFERENCES stars(id))")
        db.execSQL("CREATE TABLE navigation_methods (id INTEGER PRIMARY KEY, method_name TEXT, stars_required TEXT, region TEXT, season TEXT, instructions TEXT, accuracy TEXT, difficulty TEXT)")
        db.execSQL("CREATE TABLE constellations (id INTEGER PRIMARY KEY, name TEXT NOT NULL, common_name TEXT, hemisphere TEXT, visible_months TEXT, major_stars TEXT, shape_description TEXT, finding_guide TEXT, cultural_significance TEXT)")
        db.execSQL("CREATE TABLE direction_finding (id INTEGER PRIMARY KEY, method_name TEXT, celestial_object TEXT, hemisphere TEXT, instructions TEXT, accuracy_degrees REAL, required_conditions TEXT)")
        db.execSQL("CREATE TABLE navigation_quick_guide (id INTEGER PRIMARY KEY, country TEXT, region TEXT, latitude REAL, longitude REAL, north_guide TEXT, south_guide TEXT, east_west_guide TEXT, key_stars TEXT, seasonal_notes TEXT)")

        // --- MEDICAL ---
        db.execSQL("CREATE TABLE symptoms (id INTEGER PRIMARY KEY, name TEXT NOT NULL, synonyms TEXT, description TEXT, severity_level INTEGER, body_system TEXT, keywords TEXT)")
        db.execSQL("CREATE TABLE conditions (id INTEGER PRIMARY KEY, name TEXT NOT NULL, common_name TEXT, description TEXT, causes TEXT, severity TEXT, contagious INTEGER, keywords TEXT)")
        db.execSQL("CREATE TABLE symptom_condition_map (id INTEGER PRIMARY KEY, symptom_id INTEGER, condition_id INTEGER, typical INTEGER, FOREIGN KEY (symptom_id) REFERENCES symptoms(id), FOREIGN KEY (condition_id) REFERENCES conditions(id))")
        db.execSQL("CREATE TABLE treatments (id INTEGER PRIMARY KEY, condition_id INTEGER, treatment_type TEXT, description TEXT, steps TEXT, materials_needed TEXT, when_to_use TEXT, warnings TEXT, FOREIGN KEY (condition_id) REFERENCES conditions(id))")
        db.execSQL("CREATE TABLE medications (id INTEGER PRIMARY KEY, name TEXT NOT NULL, generic_name TEXT, brand_names TEXT, purpose TEXT, dosage_adult TEXT, dosage_child TEXT, how_to_take TEXT, side_effects TEXT, warnings TEXT, interactions TEXT, keywords TEXT)")
        db.execSQL("CREATE TABLE emergency_procedures (id INTEGER PRIMARY KEY, emergency_type TEXT NOT NULL, severity TEXT, recognition_signs TEXT, immediate_steps TEXT, detailed_procedure TEXT, what_not_to_do TEXT, when_to_call_help TEXT, materials_needed TEXT, keywords TEXT)")
        db.execSQL("CREATE TABLE first_aid (id INTEGER PRIMARY KEY, injury_type TEXT NOT NULL, severity TEXT, symptoms TEXT, immediate_action TEXT, step_by_step TEXT, materials TEXT, warning_signs TEXT, prevention TEXT, keywords TEXT)")

        // --- AGRICULTURE ---
        db.execSQL("CREATE TABLE crops (id INTEGER PRIMARY KEY, name TEXT NOT NULL, scientific_name TEXT, crop_type TEXT, climate TEXT, growing_season TEXT, water_needs TEXT, soil_type TEXT, keywords TEXT)")
        db.execSQL("CREATE TABLE planting_guide (id INTEGER PRIMARY KEY, crop_id INTEGER, region TEXT, best_months TEXT, soil_preparation TEXT, seed_treatment TEXT, planting_method TEXT, spacing TEXT, depth TEXT, watering_schedule TEXT, FOREIGN KEY (crop_id) REFERENCES crops(id))")
        db.execSQL("CREATE TABLE pests_diseases (id INTEGER PRIMARY KEY, name TEXT NOT NULL, type TEXT, affects_crops TEXT, symptoms TEXT, identification TEXT, damage TEXT, keywords TEXT)")

        // --- MECHANICAL ---
        db.execSQL("CREATE TABLE mechanical_issues (id INTEGER PRIMARY KEY, item TEXT, problem TEXT, symptoms TEXT, diagnosis TEXT, difficulty TEXT)")
        db.execSQL("CREATE TABLE repair_procedures (id INTEGER PRIMARY KEY, issue_id INTEGER, procedure_name TEXT, tools_needed TEXT, materials_needed TEXT, steps TEXT, time_estimate TEXT, safety_warnings TEXT, FOREIGN KEY (issue_id) REFERENCES mechanical_issues(id))")
        db.execSQL("CREATE TABLE emergency_repairs (id INTEGER PRIMARY KEY, problem TEXT, severity TEXT, immediate_action TEXT, secondary_steps TEXT, tools_required TEXT)")

        // --- SURVIVAL SKILLS (Water & Flora) ---
        db.execSQL("CREATE TABLE water_filtration (id INTEGER PRIMARY KEY, method_name TEXT, power_source TEXT, instructions TEXT, output_estimate TEXT)")
        db.execSQL("CREATE TABLE flora (id INTEGER PRIMARY KEY, name TEXT, type TEXT, description TEXT, use_case TEXT)")

        // Legacy Flat Table (Keeping for compatibility)
        db.execSQL("CREATE TABLE knowledge (id INTEGER PRIMARY KEY, keywords TEXT NOT NULL, question TEXT NOT NULL, answer TEXT NOT NULL, priority INTEGER DEFAULT 5)")
        
        db.execSQL("CREATE INDEX idx_keywords_legacy ON knowledge(keywords)")
        db.execSQL("CREATE INDEX idx_stars_name ON stars(name)")
        db.execSQL("CREATE INDEX idx_symptoms_name ON symptoms(name)")
        db.execSQL("CREATE INDEX idx_crops_name ON crops(name)")

        // Seed the database
        com.nova.db.SeedData.populate(db)
        
        // Load Massive Infinite Library from Assets
        loadFromAssets(db)
    }

    private fun loadFromAssets(db: SQLiteDatabase) {
        try {
            val fileName = "knowledge_base.sql"
            context.assets.open(fileName).bufferedReader().useLines { lines ->
                db.beginTransaction()
                try {
                    lines.forEach { line ->
                        if (line.trim().isNotEmpty() && !line.startsWith("--")) {
                            db.execSQL(line)
                        }
                    }
                    db.setTransactionSuccessful()
                } finally {
                    db.endTransaction()
                }
            }
            Log.d("NovaDB", "Infinite Library loaded from assets.")
        } catch (e: Exception) {
            Log.e("NovaDB", "Error loading absolute knowledge asset", e)
        }
    }

    override fun onUpgrade(db: SQLiteDatabase, old: Int, new: Int) {
        db.execSQL("DROP TABLE IF EXISTS knowledge")
        onCreate(db)
    }

    fun browseByCategory(category: String): List<Pair<String, String>> {
        val results = mutableListOf<Pair<String, String>>()
        try {
            val cursor = readableDatabase.query(
                "knowledge",
                arrayOf("question", "answer"),
                "keywords LIKE ?",
                arrayOf("%$category%"),
                null,
                null,
                "priority ASC",
                "20"
            )

            cursor.use {
                while (it.moveToNext()) {
                    results.add(it.getString(0) to it.getString(1))
                }
            }
        } catch (e: Exception) {
            Log.e("NovaDB", "Browse category error", e)
        }
        return results
    }

    fun searchLandmarks(query: String): List<String> {
        return search("landmark $query", limit = 5)
    }

    fun search(query: String, limit: Int = 3): List<String> {
        val db = readableDatabase
        val q = query.lowercase().trim()
        val results = mutableListOf<String>()

        // 1. Search Stars / Navigation
        val starCursor = db.rawQuery("""
            SELECT s.name, s.navigation_use, s.description, v.position_guide
            FROM stars s
            LEFT JOIN star_visibility v ON s.id = v.star_id
            WHERE s.name LIKE ? OR s.common_name LIKE ? OR s.constellation LIKE ? OR v.country LIKE ? OR s.description LIKE ?
        """, arrayOf("%$q%", "%$q%", "%$q%", "%$q%", "%$q%"))
        
        starCursor.use {
            if (it.moveToFirst()) {
                results.add("✨ [NAVIGATION: ${it.getString(0)}]\n${it.getString(1)}\n\nDESC: ${it.getString(2)}\n\nGUIDE: ${it.getString(3) ?: "Check local charts."}")
            }
        }

        // 2. Search Medical (Symptom -> Condition -> Treatment)
        val medCursor = db.rawQuery("""
            SELECT c.name, t.steps, t.warnings
            FROM conditions c
            JOIN symptom_condition_map scm ON c.id = scm.condition_id
            JOIN symptoms s ON scm.symptom_id = s.id
            JOIN treatments t ON c.id = t.condition_id
            WHERE s.name LIKE ? OR s.keywords LIKE ? OR c.name LIKE ? OR t.description LIKE ?
        """, arrayOf("%$q%", "%$q%", "%$q%", "%$q%"))

        medCursor.use {
            if (it.moveToFirst() && results.size < limit) {
                results.add("🚑 [MEDICAL: ${it.getString(0)}]\n\nPROTOCOL:\n${it.getString(1)}\n\n⚠️ WARNING: ${it.getString(2)}")
            }
        }

        // 3. Search Water & Flora
        val waterCursor = db.query("water_filtration", null, "method_name LIKE ? OR instructions LIKE ?", arrayOf("%$q%", "%$q%"), null, null, null, "1")
        waterCursor.use {
            if (it.moveToFirst() && results.size < limit) {
                results.add("💧 [WATER: ${it.getString(1)}]\n\nSOURCE: ${it.getString(2)}\n\nSTEPS: ${it.getString(3)}")
            }
        }

        val floraCursor = db.query("flora", null, "name LIKE ? OR description LIKE ? OR use_case LIKE ?", arrayOf("%$q%", "%$q%", "%$q%"), null, null, null, "1")
        floraCursor.use {
            if (it.moveToFirst() && results.size < limit) {
                results.add("🌿 [FLORA: ${it.getString(1)}]\n\nTYPE: ${it.getString(2)}\n\nDESC: ${it.getString(3)}\n\nUSE: ${it.getString(4)}")
            }
        }

        // 4. Fallback to First Aid
        if (results.isEmpty()) {
            val faCursor = db.query("first_aid", arrayOf("injury_type", "step_by_step"), "injury_type LIKE ? OR keywords LIKE ? OR immediate_action LIKE ?", arrayOf("%$q%", "%$q%", "%$q%"), null, null, null, "1")
            faCursor.use {
                if (it.moveToFirst()) {
                    results.add("🩹 [FIRST AID: ${it.getString(0)}]\n\n${it.getString(1)}")
                }
            }
        }
        
        // 5. Broad Search in Survival Tips (Wiki)
        if (results.isEmpty()) {
            val tipCursor = db.query("survival_tips", arrayOf("category", "tip"), "tip LIKE ? OR category LIKE ?", arrayOf("%$q%", "%$q%"), null, null, null, "1")
            tipCursor.use {
                if (it.moveToFirst()) {
                    results.add("📖 [SURVIVAL WIKI: ${it.getString(0)}]\n${it.getString(1)}")
                }
            }
        }

        // 6. Legacy Fallback
        if (results.isEmpty()) {
            val legacyCursor = db.query("knowledge", arrayOf("answer"), "keywords LIKE ? OR question LIKE ? OR answer LIKE ?", arrayOf("%$q%", "%$q%", "%$q%"), null, null, "priority ASC", "1")
            legacyCursor.use {
                if (it.moveToFirst()) {
                    results.add(it.getString(0))
                }
            }
        }

        return results
    }

    private fun extractKeywords(text: String): List<String> {
        val stopWords = setOf("the", "is", "are", "what", "how", "why", "when", "please", "nova")
        return text.lowercase()
            .replace(Regex("[^a-z0-9 ]"), "")
            .split(" ")
            .filter { it.length > 3 && it !in stopWords }
            .distinct()
            .take(5)
    }
}
