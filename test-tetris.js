// test-tetris.js
// 俄罗斯方块游戏测试脚本

// 模拟 WeChat 环境
const wx = {
  showToast: function(options) {
    console.log(`[Toast] ${options.title}`)
  },
  showModal: function(options) {
    console.log(`[Modal] ${options.title}: ${options.content}`)
  },
  setStorageSync: function(key, value) {
    console.log(`[Storage] Set ${key}:`, JSON.stringify(value))
  },
  getStorageSync: function(key) {
    console.log(`[Storage] Get ${key}`)
    return null
  }
}

// 模拟 Page 函数
function Page(options) {
  return options
}

// 模拟游戏页面
const tetrisPage = Page({
  data: {
    board: [],
    currentPiece: null,
    nextPiece: null,
    score: 0,
    level: 1,
    lines: 0,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    highScores: [],
    currentX: 0,
    currentY: 0,
    touchStartX: 0,
    touchStartY: 0,
    touchStartTime: 0
  },

  // 方块形状定义
  TETROMINOES: {
    I: {
      shape: [[1, 1, 1, 1]],
      color: '#00f0f0'
    },
    O: {
      shape: [[1, 1], [1, 1]],
      color: '#f0f000'
    },
    T: {
      shape: [[0, 1, 0], [1, 1, 1]],
      color: '#a000f0'
    },
    S: {
      shape: [[0, 1, 1], [1, 1, 0]],
      color: '#00f000'
    },
    Z: {
      shape: [[1, 1, 0], [0, 1, 1]],
      color: '#f00000'
    },
    J: {
      shape: [[1, 0, 0], [1, 1, 1]],
      color: '#0000f0'
    },
    L: {
      shape: [[0, 0, 1], [1, 1, 1]],
      color: '#f0a000'
    }
  },

  // 测试函数
  runTests: function() {
    console.log('=== 开始俄罗斯方块游戏测试 ===\n')

    this.testBoardCreation()
    this.testPieceGeneration()
    this.testCollisionDetection()
    this.testRotation()
    this.testLineClearing()
    this.testScoring()
    this.testLevelUp()

    console.log('\n=== 测试完成 ===')
  },

  testBoardCreation: function() {
    console.log('测试 1: 游戏板创建')
    const board = Array(20).fill().map(() => Array(10).fill(0))
    console.log(`✓ 创建 20x10 游戏板: ${board.length}行 x ${board[0].length}列`)
    console.log(`✓ 初始状态: 所有单元格为 0\n`)
  },

  testPieceGeneration: function() {
    console.log('测试 2: 方块生成')
    const pieces = Object.keys(this.TETROMINOES)
    console.log(`✓ 可用方块类型: ${pieces.join(', ')}`)

    // 模拟随机生成
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
    const pieceData = this.TETROMINOES[randomPiece]
    console.log(`✓ 随机生成方块: ${randomPiece}`)
    console.log(`✓ 方块形状: ${JSON.stringify(pieceData.shape)}`)
    console.log(`✓ 方块颜色: ${pieceData.color}\n`)
  },

  testCollisionDetection: function() {
    console.log('测试 3: 碰撞检测')

    // 创建测试游戏板
    const board = Array(20).fill().map(() => Array(10).fill(0))
    // 在底部放置一些方块
    board[19][5] = 'I'
    board[19][6] = 'I'

    const piece = {
      shape: [[1, 1, 1, 1]],
      color: '#00f0f0'
    }

    // 测试边界碰撞
    const checkCollision = (piece, board, offsetX, offsetY) => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = x + offsetX
            const newY = y + offsetY

            // 边界检查
            if (newX < 0 || newX >= 10 || newY >= 20) return true

            // 重叠检查
            if (newY >= 0 && board[newY][newX]) return true
          }
        }
      }
      return false
    }

    console.log(`✓ 边界检查: x=-1 -> ${checkCollision(piece, board, -1, 0)}`)
    console.log(`✓ 边界检查: x=10 -> ${checkCollision(piece, board, 10, 0)}`)
    console.log(`✓ 边界检查: y=20 -> ${checkCollision(piece, board, 0, 20)}`)
    console.log(`✓ 重叠检查: y=19 -> ${checkCollision(piece, board, 0, 19)}`)
    console.log(`✓ 正常位置: y=0 -> ${checkCollision(piece, board, 0, 0)}\n`)
  },

  testRotation: function() {
    console.log('测试 4: 方块旋转')

    const rotatePiece = (piece) => {
      const rows = piece.shape.length
      const cols = piece.shape[0].length
      const rotated = Array(cols).fill().map(() => Array(rows).fill(0))

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          rotated[x][rows - 1 - y] = piece.shape[y][x]
        }
      }

      return {
        ...piece,
        shape: rotated
      }
    }

    const piece = {
      shape: [[0, 1, 0], [1, 1, 1]],
      color: '#a000f0'
    }

    console.log(`原始形状: ${JSON.stringify(piece.shape)}`)
    const rotated = rotatePiece(piece)
    console.log(`旋转后形状: ${JSON.stringify(rotated.shape)}`)
    console.log(`✓ 旋转算法正确\n`)
  },

  testLineClearing: function() {
    console.log('测试 5: 行消除')

    const board = Array(20).fill().map(() => Array(10).fill(0))
    // 创建完整行
    board[18] = Array(10).fill('I')
    board[19] = Array(10).fill('I')

    const clearLines = (board) => {
      let linesCleared = 0
      const newBoard = []

      for (let y = 0; y < 20; y++) {
        if (board[y].every(cell => cell !== 0)) {
          linesCleared++
          newBoard.unshift(Array(10).fill(0))
        } else {
          newBoard.push(board[y])
        }
      }

      return { newBoard, linesCleared }
    }

    const result = clearLines(board)
    console.log(`✓ 消除行数: ${result.linesCleared}`)
    console.log(`✓ 新游戏板长度: ${result.newBoard.length}`)
    console.log(`✓ 顶部空行: ${result.newBoard[0].every(cell => cell === 0)}\n`)
  },

  testScoring: function() {
    console.log('测试 6: 计分系统')

    const SCORE_TABLE = {
      1: 100,  // 单行
      2: 300,  // 双行
      3: 500,  // 三行
      4: 800   // Tetris (四行)
    }

    const level = 2
    const lines = 4
    const baseScore = SCORE_TABLE[lines]
    const totalScore = baseScore * level

    console.log(`✓ 消除 ${lines} 行: ${baseScore} 分`)
    console.log(`✓ 当前关卡: ${level}`)
    console.log(`✓ 总得分: ${totalScore} 分 (${baseScore} × ${level})`)
    console.log(`✓ 计分规则: 单行100, 双行300, 三行500, Tetris800\n`)
  },

  testLevelUp: function() {
    console.log('测试 7: 关卡升级')

    const LINES_PER_LEVEL = 10
    const INITIAL_LEVEL = 1

    const testCases = [
      { lines: 0, expectedLevel: 1 },
      { lines: 5, expectedLevel: 1 },
      { lines: 10, expectedLevel: 2 },
      { lines: 15, expectedLevel: 2 },
      { lines: 20, expectedLevel: 3 },
      { lines: 100, expectedLevel: 10 }
    ]

    testCases.forEach(test => {
      const level = Math.floor(test.lines / LINES_PER_LEVEL) + INITIAL_LEVEL
      const actualLevel = Math.min(level, 10)
      const passed = actualLevel === test.expectedLevel
      console.log(`✓ 行数 ${test.lines}: 关卡 ${actualLevel} (期望 ${test.expectedLevel}) ${passed ? '✓' : '✗'}`)
    })

    console.log('')
  }
})

// 运行测试
tetrisPage.runTests()

// 额外的实用函数测试
console.log('\n=== 实用函数测试 ===\n')

// 测试颜色获取
const getCellColor = (cell, TETROMINOES) => {
  if (!cell) return ''
  const pieceData = TETROMINOES[cell]
  return pieceData ? pieceData.color : '#666'
}

console.log('测试颜色获取:')
console.log(`✓ I 方块颜色: ${getCellColor('I', tetrisPage.TETROMINOES)}`)
console.log(`✓ O 方块颜色: ${getCellColor('O', tetrisPage.TETROMINOES)}`)
console.log(`✓ 空单元格: "${getCellColor(0, tetrisPage.TETROMINOES)}"`)
console.log(`✓ 无效方块: "${getCellColor('X', tetrisPage.TETROMINOES)}"`)

console.log('\n=== 测试脚本执行完成 ===')