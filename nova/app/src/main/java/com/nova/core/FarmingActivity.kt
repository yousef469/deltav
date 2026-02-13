package com.nova.core

import android.graphics.Color
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class FarmingActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.parseColor("#111111"))
            setPadding(32, 32, 32, 32)
        }

        val title = TextView(this).apply {
            text = "🌾 FARMING VAULT"
            textSize = 28f
            setTextColor(Color.GREEN)
            setTypeface(null, android.graphics.Typeface.BOLD)
            setPadding(0, 0, 0, 32)
        }
        layout.addView(title)
        
        val listView = ListView(this)
        layout.addView(listView)
        
        setContentView(layout)

        val topics = arrayOf(
            "Soil Prep: Nitrogen & pH",
            "Crops: Potato (High Yield)",
            "Crops: Beans (Protein/Nitrogen)",
            "Irrigation: Drip vs Canal",
            "Natural Pesticides (Neem/Ash)",
            "Seed Saving: Drying & Storage"
        )

        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, topics)
        listView.adapter = adapter
        
        listView.setOnItemClickListener { _, _, position, _ ->
             showContent(topics[position])
        }
    }

    private fun showContent(topic: String) {
        val content = when(topic) {
            "Soil Prep: Nitrogen & pH" -> "Check soil by texture. Use compost for nitrogen. If soil is too acidic, add crushed eggshells or wood ash."
            "Crops: Potato (High Yield)" -> "Best survival crop. High calories. Grow in loose soil. Can be grown in bags or tires if space is limited."
            "Crops: Beans (Protein/Nitrogen)" -> "Crucial for protein. They fix nitrogen back into the soil, helping future crops."
            "Irrigation: Drip vs Canal" -> "In drought, use drip irrigation (bottles with small holes) directly at the root to save 70% water."
            "Natural Pesticides (Neem/Ash)" -> "Chili water or soapy water for bugs. Wood ash for slugs and snails."
            "Seed Saving: Drying & Storage" -> "Dry seeds completely in shade. Store in airtight containers (glass is best) in a cool, dark place."
            else -> "Detailed info coming soon."
        }
        
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(topic)
            .setMessage(content)
            .setPositiveButton("OK", null)
            .show()
    }
}
