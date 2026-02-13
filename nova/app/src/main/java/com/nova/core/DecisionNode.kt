package com.nova.core

enum class DecisionType {
    QUESTION, ACTION, END
}

data class DecisionNode(
    val id: String,
    val text: String,
    val yesNodeId: String? = null,
    val noNodeId: String? = null,
    val type: DecisionType = DecisionType.QUESTION
)
