// tetris.js
// 俄罗斯方块游戏核心逻辑

// 方块形状定义
const TETROMINOES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00f0f0' // 青色
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: '#f0f000' // 黄色
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: '#a000f0' // 紫色
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#00f000' // 绿色
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#f00000' // 红色
  },
  J: {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: '#0000f0' // 蓝色
  },
  L: {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: '#f0a000' // 橙色
  }
}

// 游戏常量
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_LEVEL = 1
const LINES_PER_LEVEL = 10
const BASE_FALL_SPEED = 1000 // 毫秒

// 计分规则
const SCORE_TABLE = {
  1: 100,  // 单行
  2: 300,  // 双行
  3: 500,  // 三行
  4: 800   // Tetris (四行)
}

Page({
  data: {
    // 游戏状态
    board: [],           // 游戏板 (20x10)
    currentPiece: null,  // 当前方块
    nextPiece: null,     // 下一个方块
    score: 0,           // 分数
    level: 1,           // 关卡
    lines: 0,           // 消除行数
    isPlaying: false,   // 游戏是否进行中
    isPaused: false,    // 是否暂停
    isGameOver: false,  // 游戏是否结束
    highScores: [],     // 高分记录

    // 方块位置
    currentX: 0,
    currentY: 0,

    // 触摸控制
    touchStartX: 0,
    touchStartY: 0,
    touchStartTime: 0
  },

  // 初始化游戏
  initGame: function() {
    // 创建空的游戏板
    const board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0))

    // 加载高分记录
    const highScores = wx.getStorageSync('tetrisHighScores') || []

    this.setData({
      board: board,
      score: 0,
      level: INITIAL_LEVEL,
      lines: 0,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      highScores: highScores
    })
  },

  // 生成随机方块
  generateRandomPiece: function() {
    const pieces = Object.keys(TETROMINOES)
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
    const pieceData = TETROMINOES[randomPiece]

    return {
      type: randomPiece,
      shape: pieceData.shape,
      color: pieceData.color
    }
  },

  // 获取下一个方块
  getNextPiece: function() {
    if (!this.data.nextPiece) {
      this.setData({
        nextPiece: this.generateRandomPiece()
      })
    }
    return this.data.nextPiece
  },

  // 生成新方块
  spawnNewPiece: function() {
    const nextPiece = this.getNextPiece()
    const piece = {
      type: nextPiece.type,
      shape: nextPiece.shape,
      color: nextPiece.color
    }

    // 计算初始位置（居中）
    const startX = Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2)
    const startY = 0

    // 检查是否可以放置新方块
    if (this.checkCollision(piece, startX, startY)) {
      this.gameOver()
      return false
    }

    // 设置新方块和下一个方块
    this.setData({
      currentPiece: piece,
      currentX: startX,
      currentY: startY,
      nextPiece: this.generateRandomPiece()
    })

    return true
  },

  // 碰撞检测
  checkCollision: function(piece, offsetX, offsetY) {
    if (!piece) return false

    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = x + offsetX
          const newY = y + offsetY

          // 边界检查
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true
          }

          // 重叠检查
          if (newY >= 0 && this.data.board[newY][newX]) {
            return true
          }
        }
      }
    }
    return false
  },

  // 旋转方块
  rotatePiece: function(piece) {
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
  },

  // 尝试旋转
  tryRotate: function() {
    if (!this.data.currentPiece || this.data.isPaused || this.data.isGameOver) return

    const rotatedPiece = this.rotatePiece(this.data.currentPiece)

    // 尝试旋转，如果碰撞则尝试墙踢
    if (!this.checkCollision(rotatedPiece, this.data.currentX, this.data.currentY)) {
      this.setData({
        currentPiece: rotatedPiece
      })
    } else {
      // 墙踢：尝试左右移动
      const kicks = [-1, 1, -2, 2]
      for (let kick of kicks) {
        if (!this.checkCollision(rotatedPiece, this.data.currentX + kick, this.data.currentY)) {
          this.setData({
            currentPiece: rotatedPiece,
            currentX: this.data.currentX + kick
          })
          break
        }
      }
    }
  },

  // 移动方块
  movePiece: function(dx, dy) {
    if (!this.data.currentPiece || this.data.isPaused || this.data.isGameOver) return false

    const newX = this.data.currentX + dx
    const newY = this.data.currentY + dy

    if (!this.checkCollision(this.data.currentPiece, newX, newY)) {
      this.setData({
        currentX: newX,
        currentY: newY
      })
      return true
    }

    return false
  },

  // 硬降（直接落到底部）
  hardDrop: function() {
    if (!this.data.currentPiece || this.data.isPaused || this.data.isGameOver) return

    let dropDistance = 0
    while (this.movePiece(0, 1)) {
      dropDistance++
    }

    // 硬降得分
    if (dropDistance > 0) {
      this.addScore(dropDistance * 2)
    }

    this.lockPiece()
  },

  // 锁定方块到游戏板
  lockPiece: function() {
    if (!this.data.currentPiece) return

    const piece = this.data.currentPiece
    const board = this.data.board.map(row => [...row])

    // 将方块放置到游戏板上
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = this.data.currentY + y
          const boardX = this.data.currentX + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            board[boardY][boardX] = piece.type
          }
        }
      }
    }

    this.setData({
      board: board,
      currentPiece: null,
      currentX: 0,
      currentY: 0
    })

    // 检查并清除完整行
    this.clearLines()

    // 生成新方块
    if (!this.data.isGameOver) {
      this.spawnNewPiece()
    }
  },

  // 清除完整行
  clearLines: function() {
    const board = this.data.board
    let linesCleared = 0
    const newBoard = []

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (board[y].every(cell => cell !== 0)) {
        linesCleared++
        // 在顶部插入空行
        newBoard.unshift(Array(BOARD_WIDTH).fill(0))
      } else {
        newBoard.push(board[y])
      }
    }

    if (linesCleared > 0) {
      // 更新游戏板
      this.setData({
        board: newBoard,
        lines: this.data.lines + linesCleared
      })

      // 计算得分
      const baseScore = SCORE_TABLE[linesCleared] || 0
      const levelMultiplier = this.data.level
      const score = baseScore * levelMultiplier
      this.addScore(score)

      // 检查是否升级
      this.checkLevelUp()

      // 显示消除提示
      this.showClearMessage(linesCleared)
    }
  },

  // 添加分数
  addScore: function(points) {
    this.setData({
      score: this.data.score + points
    })
  },

  // 检查是否升级
  checkLevelUp: function() {
    const newLevel = Math.floor(this.data.lines / LINES_PER_LEVEL) + 1
    if (newLevel > this.data.level && newLevel <= 10) {
      this.setData({
        level: newLevel
      })
      wx.showToast({
        title: `关卡 ${newLevel}`,
        icon: 'success',
        duration: 1500
      })
    }
  },

  // 显示消除行数提示
  showClearMessage: function(lines) {
    const messages = {
      1: '单行',
      2: '双行',
      3: '三行',
      4: 'TETRIS!'
    }

    if (messages[lines]) {
      wx.showToast({
        title: messages[lines],
        icon: 'none',
        duration: 1000
      })
    }
  },

  // 游戏循环
  gameLoop: function() {
    if (!this.data.isPlaying || this.data.isPaused || this.data.isGameOver) return

    // 尝试向下移动
    if (!this.movePiece(0, 1)) {
      // 无法移动，锁定方块
      this.lockPiece()
    }

    // 计算下落速度（基于关卡）
    const fallSpeed = Math.max(100, BASE_FALL_SPEED - (this.data.level - 1) * 100)

    // 继续游戏循环
    this.gameTimer = setTimeout(() => {
      this.gameLoop()
    }, fallSpeed)
  },

  // 开始游戏
  startGame: function() {
    if (this.data.isPlaying && !this.data.isPaused) return

    this.initGame()
    this.setData({
      isPlaying: true,
      isPaused: false,
      isGameOver: false
    })

    // 生成第一个方块
    this.spawnNewPiece()

    // 开始游戏循环
    this.gameLoop()

    wx.showToast({
      title: '游戏开始',
      icon: 'success',
      duration: 1000
    })
  },

  // 暂停游戏
  pauseGame: function() {
    if (!this.data.isPlaying || this.data.isGameOver) return

    this.setData({
      isPaused: !this.data.isPaused
    })

    if (this.data.isPaused) {
      // 清除游戏循环
      if (this.gameTimer) {
        clearTimeout(this.gameTimer)
      }
      wx.showToast({
        title: '游戏暂停',
        icon: 'none',
        duration: 1000
      })
    } else {
      // 恢复游戏循环
      this.gameLoop()
      wx.showToast({
        title: '游戏继续',
        icon: 'none',
        duration: 1000
      })
    }
  },

  // 游戏结束
  gameOver: function() {
    this.setData({
      isPlaying: false,
      isPaused: false,
      isGameOver: true
    })

    // 清除游戏循环
    if (this.gameTimer) {
      clearTimeout(this.gameTimer)
    }

    // 保存高分
    this.saveHighScore()

    wx.showModal({
      title: '游戏结束',
      content: `最终得分：${this.data.score}`,
      showCancel: false,
      confirmText: '确定'
    })
  },

  // 保存高分
  saveHighScore: function() {
    const highScores = this.data.highScores || []
    const newScore = {
      score: this.data.score,
      level: this.data.level,
      lines: this.data.lines,
      date: new Date().toLocaleString()
    }

    highScores.push(newScore)
    highScores.sort((a, b) => b.score - a.score)
    const topScores = highScores.slice(0, 10)

    wx.setStorageSync('tetrisHighScores', topScores)

    this.setData({
      highScores: topScores
    })

    // 检查是否是新纪录
    if (topScores.length > 0 && topScores[0].score === this.data.score) {
      wx.showToast({
        title: '新纪录！',
        icon: 'success',
        duration: 2000
      })
    }
  },

  // 触摸控制
  handleTouchStart: function(e) {
    const touch = e.touches[0]
    this.setData({
      touchStartX: touch.clientX,
      touchStartY: touch.clientY,
      touchStartTime: Date.now()
    })
  },

  handleTouchMove: function(e) {
    if (!this.data.isPlaying || this.data.isPaused || this.data.isGameOver) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - this.data.touchStartX
    const deltaY = touch.clientY - this.data.touchStartY
    const deltaTime = Date.now() - this.data.touchStartTime

    // 滑动控制
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        this.movePiece(1, 0) // 右移
      } else {
        this.movePiece(-1, 0) // 左移
      }
      this.setData({
        touchStartX: touch.clientX,
        touchStartTime: Date.now()
      })
    } else if (deltaY > 30 && deltaY > Math.abs(deltaX)) {
      this.movePiece(0, 1) // 下移
      this.setData({
        touchStartY: touch.clientY,
        touchStartTime: Date.now()
      })
    }
  },

  handleTouchEnd: function(e) {
    if (!this.data.isPlaying || this.data.isPaused || this.data.isGameOver) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - this.data.touchStartX
    const deltaY = touch.clientY - this.data.touchStartY
    const deltaTime = Date.now() - this.data.touchStartTime

    // 点击旋转（短时间、小位移）
    if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      this.tryRotate()
    }

    // 长按硬降（长时间、小位移）
    if (deltaTime > 500 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      this.hardDrop()
    }
  },

  // 按钮控制
  handleControl: function(e) {
    const action = e.currentTarget.dataset.action

    switch (action) {
      case 'left':
        this.movePiece(-1, 0)
        break
      case 'right':
        this.movePiece(1, 0)
        break
      case 'down':
        this.movePiece(0, 1)
        break
      case 'rotate':
        this.tryRotate()
        break
      case 'drop':
        this.hardDrop()
        break
      case 'start':
        this.startGame()
        break
      case 'pause':
        this.pauseGame()
        break
    }
  },

  // 获取单元格颜色
  getCellColor: function(cell) {
    if (!cell) return ''
    const pieceData = TETROMINOES[cell]
    return pieceData ? pieceData.color : '#666'
  },

  // 页面生命周期
  onLoad: function() {
    this.initGame()
  },

  onUnload: function() {
    // 清除游戏循环
    if (this.gameTimer) {
      clearTimeout(this.gameTimer)
    }
  }
})