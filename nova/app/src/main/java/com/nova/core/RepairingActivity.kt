package com.nova.core

import android.graphics.Color
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class RepairingActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.parseColor("#111111"))
            setPadding(32, 32, 32, 32)
        }

        val title = TextView(this).apply {
            text = "⚙️ REPAIRING VAULT"
            textSize = 28f
            setTextColor(Color.parseColor("#FFA500"))
            setTypeface(null, android.graphics.Typeface.BOLD)
            setPadding(0, 0, 0, 32)
        }
        layout.addView(title)
        
        val listView = ListView(this)
        layout.addView(listView)
        
        setContentView(layout)

        val topics = arrayOf(
            "Mechanical: Rope & Knots",
            "Shelter: Frame & Thatching",
            "Water: Charcoal Filtration",
            "Power: Solar Panel Care",
            "Basic Electronics: Soldering",
            "Tools: Sharpening Stones"
        )

        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, topics)
        listView.adapter = adapter
        
        listView.setOnItemClickListener { _, _, position, _ ->
             showContent(topics[position])
        }
    }

    private fun showContent(topic: String) {
        val content = when(topic) {
            "Mechanical: Rope & Knots" -> "Bowline for fixed loops. Clove hitch for poles. Learn the Taut-line for tent tension."
            "Shelter: Frame & Thatching" -> "A-frame is most stable. Use pine boughs or large leaves for 'shingling' to repel water."
            "Water: Charcoal Filtration" -> "Layer: Sand -> Charcoal -> Gravel. Boil after filtering to ensure safety."
            "Power: Solar Panel Care" -> "Keep clean of dust. Heat reduces efficiency; ensure airflow behind panels."
            "Basic Electronics: Soldering" -> "Heat the joint, not the solder. Ensure 'shiny' joints to avoid cold-solder failures."
            "Tools: Sharpening Stones" -> "Use water or oil. Maintain a 20-degree angle. Alternate sides every 5-10 strokes."
            else -> "Detailed info coming soon."
        }
        
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(topic)
            .setMessage(content)
            .setPositiveButton("OK", null)
            .show()
    }
}
