package com.nova.core

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Bundle
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import kotlin.math.abs

class ChessActivity : AppCompatActivity() {
    private lateinit var chessView: ChessView
    private lateinit var statusText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.parseColor("#111111"))
            setPadding(16, 16, 16, 16)
        }

        val title = TextView(this).apply {
            text = "♟️ CHESS (2P)"
            textSize = 24f
            setTextColor(Color.WHITE)
            gravity = android.view.Gravity.CENTER
            setPadding(0, 0, 0, 32)
        }
        layout.addView(title)
        
        statusText = TextView(this).apply {
            text = "White's Turn"
            textSize = 20f
            setTextColor(Color.GREEN)
            gravity = android.view.Gravity.CENTER
            setPadding(0, 0, 0, 16)
        }
        layout.addView(statusText)

        chessView = ChessView(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, 
                LinearLayout.LayoutParams.MATCH_PARENT // Will adjust height in measure
            ).apply {
                 // Square aspect ratio handled in View
                 width = 1000 // Arb
                 height = 1000 // Arb
                 weight = 1f
            }
            onTurnChange = { whiteTurn ->
                 statusText.text = if (whiteTurn) "White's Turn" else "Black's Turn"
                 statusText.setTextColor(if (whiteTurn) Color.GREEN else Color.RED)
            }
        }
        layout.addView(chessView)
        
        val resetBtn = Button(this).apply {
            text = "RESET"
            setOnClickListener { 
                chessView.resetGame()
                statusText.text = "White's Turn"
            }
        }
        
        val guideBtn = Button(this).apply {
            text = "HOW TO PLAY"
            setOnClickListener {
                androidx.appcompat.app.AlertDialog.Builder(this@ChessActivity)
                    .setTitle("Chess Guide")
                    .setMessage("Goal: Checkmate the opponent's King.\n\n" +
                                "♟ Pawn: Moves 1 forward (2 on start). Captures diagonally.\n" +
                                "♜ Rook: Horizontal/Vertical.\n" +
                                "♞ Knight: L-shape (2x1). Jumps over pieces.\n" +
                                "♝ Bishop: Diagonals.\n" +
                                "♛ Queen: Line/Diagonal.\n" +
                                "♚ King: 1 square any direction.\n\n" +
                                "Touch a piece to select (Red highlight), then touch target square to move.")
                    .setPositiveButton("Got it", null)
                    .show()
            }
        }

        val btnLayout = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = android.view.Gravity.CENTER
            addView(resetBtn)
            addView(guideBtn)
        }
        layout.addView(btnLayout)

        setContentView(layout)
    }
}

class ChessView @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null
) : View(context, attrs) {

    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG)
    private var boardSize = 0f
    private var squareSize = 0f
    
    // Board Representation: 8x8
    // Upper case = White, Lower case = Black
    // P=Pawn, R=Rook, N=Knight, B=Bishop, Q=Queen, K=King
    // .=Empty
    private val initialBoard = arrayOf(
        charArrayOf('r','n','b','q','k','b','n','r'),
        charArrayOf('p','p','p','p','p','p','p','p'),
        charArrayOf('.','.','.','.','.','.','.','.'),
        charArrayOf('.','.','.','.','.','.','.','.'),
        charArrayOf('.','.','.','.','.','.','.','.'),
        charArrayOf('.','.','.','.','.','.','.','.'),
        charArrayOf('P','P','P','P','P','P','P','P'),
        charArrayOf('R','N','B','Q','K','B','N','R')
    )
    
    private var board = Array(8) { CharArray(8) }
    private var selectedRow = -1
    private var selectedCol = -1
    private var isWhiteTurn = true
    
    var onTurnChange: ((Boolean) -> Unit)? = null

    init {
        resetGame()
        textPaint.textAlign = Paint.Align.CENTER
    }

    fun resetGame() {
        for (i in 0..7) {
            board[i] = initialBoard[i].clone()
        }
        isWhiteTurn = true
        selectedRow = -1
        invalidate()
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val w = MeasureSpec.getSize(widthMeasureSpec)
        setMeasuredDimension(w, w) // Make it square
    }

    override fun onDraw(canvas: Canvas) {
        boardSize = width.toFloat()
        squareSize = boardSize / 8

        for (row in 0..7) {
            for (col in 0..7) {
                // Draw Square
                val isDark = (row + col) % 2 == 1
                paint.color = if (isDark) Color.parseColor("#8B4513") else Color.parseColor("#F0D9B5")
                
                // Highlight selection
                if (row == selectedRow && col == selectedCol) {
                    paint.color = Color.parseColor("#88FF0000") // Red highlight
                }
                
                canvas.drawRect(
                    col * squareSize, 
                    row * squareSize, 
                    (col + 1) * squareSize, 
                    (row + 1) * squareSize, 
                    paint
                )
                
                // Draw Piece
                val piece = board[row][col]
                if (piece != '.') {
                    drawPiece(canvas, piece, col, row)
                }
            }
        }
    }

    private fun drawPiece(canvas: Canvas, piece: Char, col: Int, row: Int) {
        val symbol = when(piece) {
            'R' -> "♜"; 'N' -> "♞"; 'B' -> "♝"; 'Q' -> "♛"; 'K' -> "♚"; 'P' -> "♟"
            'r' -> "♜"; 'n' -> "♞"; 'b' -> "♝"; 'q' -> "♛"; 'k' -> "♚"; 'p' -> "♟"
            else -> ""
        }
        // White pieces are White text, Black pieces are Black text
        textPaint.color = if (piece.isUpperCase()) Color.WHITE else Color.BLACK
        textPaint.textSize = squareSize * 0.8f
        
        // Center text
        val x = col * squareSize + squareSize / 2
        val y = row * squareSize + squareSize * 0.75f
        
        canvas.drawText(symbol, x, y, textPaint)
        
        // Add basic outline for visibility
        val strokePaint = Paint(textPaint).apply { 
            style = Paint.Style.STROKE
            strokeWidth = 2f
            color = if (piece.isUpperCase()) Color.BLACK else Color.WHITE
        }
        canvas.drawText(symbol, x, y, strokePaint)
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (event.action == MotionEvent.ACTION_DOWN) {
            val col = (event.x / squareSize).toInt()
            val row = (event.y / squareSize).toInt()
            
            if (col in 0..7 && row in 0..7) {
                handleTap(row, col)
            }
            return true
        }
        return super.onTouchEvent(event)
    }

    private fun handleTap(row: Int, col: Int) {
        if (selectedRow == -1) {
            // Select logic
            val piece = board[row][col]
            if (piece == '.') return // Can't select empty
            
            // Check turn
            val isPieceWhite = piece.isUpperCase()
            if (isPieceWhite != isWhiteTurn) return // Wrong turn
            
            selectedRow = row
            selectedCol = col
            invalidate()
        } else {
            // Move logic
            if (row == selectedRow && col == selectedCol) {
                // Deselect
                selectedRow = -1
                invalidate()
                return
            }
            
            val success = tryMove(selectedRow, selectedCol, row, col)
            if (success) {
                isWhiteTurn = !isWhiteTurn
                onTurnChange?.invoke(isWhiteTurn)
                selectedRow = -1
            } else {
                 // Invalid move, either deselect or select new piece if own color
                 val targetPiece = board[row][col]
                 if (targetPiece != '.' && targetPiece.isUpperCase() == isWhiteTurn) {
                      selectedRow = row
                      selectedCol = col // Change selection
                 }
            }
            invalidate()
        }
    }
    
    private fun tryMove(fromR: Int, fromC: Int, toR: Int, toC: Int): Boolean {
        val piece = board[fromR][fromC]
        val target = board[toR][toC]
        
        // Cannot capture own piece
        if (target != '.' && target.isUpperCase() == piece.isUpperCase()) return false
        
        val dr = toR - fromR
        val dc = toC - fromC
        val absDr = abs(dr)
        val absDc = abs(dc)
        
        val valid = when (piece.toUpperCase()) {
            'P' -> validatePawn(piece, fromR, fromC, toR, toC, target)
            'R' -> (dr == 0 || dc == 0) && isPathClear(fromR, fromC, toR, toC)
            'B' -> (absDr == absDc) && isPathClear(fromR, fromC, toR, toC)
            'Q' -> (dr == 0 || dc == 0 || absDr == absDc) && isPathClear(fromR, fromC, toR, toC)
            'K' -> absDr <= 1 && absDc <= 1
            'N' -> (absDr == 2 && absDc == 1) || (absDr == 1 && absDc == 2)
            else -> false
        }
        
        if (valid) {
            board[toR][toC] = piece
            board[fromR][fromC] = '.'
            
            // Promotion (Simple: Auto-Queen)
            if (piece == 'P' && toR == 0) board[toR][toC] = 'Q'
            if (piece == 'p' && toR == 7) board[toR][toC] = 'q'
            
            return true
        }
        return false
    }
    
    private fun validatePawn(p: Char, r1: Int, c1: Int, r2: Int, c2: Int, target: Char): Boolean {
        val forward = if (p == 'P') -1 else 1 // White moves UP (-1), Black moves DOWN (+1)
        val startRow = if (p == 'P') 6 else 1
        
        // Move forward 1
        if (c1 == c2 && r2 == r1 + forward && target == '.') return true
        
        // Move forward 2
        if (c1 == c2 && r1 == startRow && r2 == r1 + 2 * forward && target == '.' && board[r1+forward][c1] == '.') return true
        
        // Capture diagonal
        if (abs(c2 - c1) == 1 && r2 == r1 + forward && target != '.') return true
        
        return false
    }
    
    private fun isPathClear(r1: Int, c1: Int, r2: Int, c2: Int): Boolean {
        val dr = Integer.signum(r2 - r1)
        val dc = Integer.signum(c2 - c1)
        
        var r = r1 + dr
        var c = c1 + dc
        
        while (r != r2 || c != c2) {
            if (board[r][c] != '.') return false
            r += dr
            c += dc
        }
        return true
    }
}
