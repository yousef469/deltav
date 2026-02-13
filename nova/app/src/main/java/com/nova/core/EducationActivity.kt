package com.nova.core

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import android.graphics.Color
import android.view.Gravity
import android.widget.LinearLayout

class EducationActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Programmatic Layout for simplicity and speed
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.parseColor("#111111"))
            setPadding(32, 32, 32, 32)
        }

        val title = TextView(this).apply {
            text = "📚 " + if (LanguageManager.currentLanguage == AppLanguage.ARABIC) "التعليم" else "EDUCATION"
            textSize = 32f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 48)
        }
        layout.addView(title)
        
        val listView = ListView(this)
        layout.addView(listView)
        
        setContentView(layout)

        val topics = if (LanguageManager.currentLanguage == AppLanguage.ARABIC) {
            arrayOf("الرياضيات: الأساسيات (المستوى 5)", "الفيزياء: قوانين نيوتن", "الرياضيات: الجبر", "الفيزياء: الديناميكا الحرارية", "الرياضيات: التفاضل والتكامل", "الهندسة الميكانيكية: مبادئ")
        } else {
            arrayOf("Math: Basics (Grade 5)", "Physics: Newton's Laws", "Math: Algebra", "Physics: Thermodynamics", "Math: Calculus", "Mech Eng: Principles")
        }

        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, topics)
        listView.adapter = adapter
        
        // Customizing list item colors would require a custom adapter, 
        // but for high contrast/survival, default is often okay if theme is black.
        // Let's force a light text color if needed by using a custom view in adapter, 
        // but standard android.R.layout.simple_list_item_1 might be dark text on light bg.
        // Safest is to handle click and show content.
        
        listView.setOnItemClickListener { _, _, position, _ ->
             showContent(topics[position])
        }
    }

    private fun showContent(topic: String) {
        val content = when {
            topic.contains("Basics") || topic.contains("الأساسيات") -> 
                "MATH BASICS\n\nOrder of Ops: PEMDAS\n(Parentheses, Exponents, Multiply, Divide, Add, Subtract)\n\nFractions:\n1/2 + 1/4 = 3/4\n\nPercent:\n50% = 0.5"
            topic.contains("Newton") || topic.contains("نيوتن") ->
                "PHYSICS: NEWTON\n\n1. Inertia: Object at rest stays at rest.\n2. F = ma (Force = mass * acceleration)\n3. Action/Reaction: For every action there is an equal & opposite reaction.\n\nGravity: 9.8 m/s²"
            topic.contains("Algebra") || topic.contains("الجبر") ->
                "ALGEBRA\n\nLinear:\ny = mx + b\n(m=slope, b=intercept)\n\nQuadratic:\nax² + bx + c = 0\nx = (-b ± √(b²-4ac)) / 2a"
            topic.contains("Thermodynamics") || topic.contains("الحرارية") ->
                "THERMODYNAMICS\n\n1. Energy cannot be created/destroyed.\n2. Entropy always increases.\n3. Absolute zero cannot be reached.\n\nPV = nRT (Ideal Gas Law)"
            topic.contains("Calculus") || topic.contains("التفاضل") ->
                "CALCULUS\n\nDerivative (Slope):\nd/dx (x^n) = nx^(n-1)\n\nIntegral (Area):\n∫ x^n dx = (x^(n+1))/(n+1) + C"
            topic.contains("Mech") || topic.contains("الميكانيكية") ->
                "MECH ENG\n\nStress = Force / Area (σ = F/A)\nStrain = ΔL / L (ε)\n\nTorque = Force * Distance\nPower = Torque * Angular Velocity"
            else -> "Content loading..."
        }
        
        val dialog = androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle(topic)
            .setMessage(content)
            .setPositiveButton("OK", null)
            .create()
        dialog.show()
    }
}
