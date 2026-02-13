package com.nova.core

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import android.graphics.Color
import android.view.Gravity
import android.widget.LinearLayout

class CodingActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.parseColor("#111111"))
            setPadding(32, 32, 32, 32)
        }

        val title = TextView(this).apply {
            text = "💻 " + if (LanguageManager.currentLanguage == AppLanguage.ARABIC) "البرمجة" else "CODING"
            textSize = 32f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 48)
        }
        layout.addView(title)
        
        val listView = ListView(this)
        layout.addView(listView)
        
        setContentView(layout)

        val topics = arrayOf(
            "Python: Hello World",
            "Python: Variables",
            "Python: Loops",
            "Python: Functions",
            "Python: Classes (OOP)",
            "Java: Hello World",
            "Java: Variables",
            "Java: Loops",
            "Java: Methods",
            "Java: Classes (OOP)"
        )

        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, topics)
        listView.adapter = adapter
        
        listView.setOnItemClickListener { _, _, position, _ ->
             showContent(topics[position])
        }
    }

    private fun showContent(topic: String) {
        val content = when {
            topic.contains("Python: Hello") -> 
                "PYTHON: HELLO WORLD\n\nprint(\"Hello, World!\")\n\n# Note: Python uses indentation, not braces."
            topic.contains("Python: Var") ->
                "PYTHON: VARIABLES\n\nx = 5\nname = \"Nova\"\npi = 3.14\n\n# Dynamic typing.\nprint(f\"Value: {x}\")"
            topic.contains("Python: Loops") ->
                "PYTHON: LOOPS\n\nfor i in range(5):\n    print(i)\n\nwhile x > 0:\n    x -= 1"
            topic.contains("Python: Func") ->
                "PYTHON: FUNCTIONS\n\ndef greet(name):\n    return \"Hello \" + name\n\nval = greet(\"User\")"
            topic.contains("Python: Classes") ->
                "PYTHON: OOP\n\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n    \n    def bark(self):\n        print(\"Woof!\")\n\nd = Dog(\"Buddy\")\nd.bark()"
            
            topic.contains("Java: Hello") ->
                "JAVA: HELLO WORLD\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}"
            topic.contains("Java: Var") ->
                "JAVA: VARIABLES\n\nint x = 5;\nString name = \"Nova\";\ndouble pi = 3.14;\n\n// Statically typed."
            topic.contains("Java: Loops") ->
                "JAVA: LOOPS\n\nfor (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}\n\nwhile (x > 0) {\n    x--;\n}"
            topic.contains("Java: Meth") ->
                "JAVA: METHODS\n\npublic static String greet(String name) {\n    return \"Hello \" + name;\n}"
            topic.contains("Java: Classes") ->
                "JAVA: OOP\n\npublic class Dog {\n    String name;\n    public Dog(String n) { this.name = n; }\n    public void bark() { System.out.println(\"Woof!\"); }\n}"
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
