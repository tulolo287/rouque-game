import {Events} from "./Events.js"
import {Inventory} from "./Inventory.js"
import {Player} from "./entities/Player.js"
import {Sword} from "./entities/Sword.js"
import {HP} from "./entities/HP.js"
import {Enemy} from "./entities/Enemy.js"

export class Game {
  constructor() {
    this.canvas = document.createElement("canvas")
    this.field = document.querySelector(".field")
    this.inventoryDiv = document.querySelector(".inventory")
    this.ctx = this.canvas.getContext("2d")
    this.canvas.width = this.field.clientWidth
    this.canvas.height = this.field.clientHeight
    this.field.appendChild(this.canvas)
    
    this.cellSize = 50
    this.cols = this.canvas.width / this.cellSize
    this.rows = this.canvas.height / this.cellSize
    this.ground = {}
    this.walls = []
    this.enemies = []
    this.hps = []
    this.enemiesAmount = 15
    this.hpsAmount = 2

    this.events = new Events()

    this.bg = new Image()
    this.wall = new Image()

    this.groundKeys = null

    this.player = new Player(this)
    this.sword = new Sword(this)
    this.inventory = new Inventory(this)

    this.wall.src = "/images/tile-W.png"
    this.bg.src = "/images/tile-.png"
  }

  init() {
    const fieldWidth = Math.floor(this.canvas.width / this.cellSize)
    const fieldHeight = Math.floor(this.canvas.height / this.cellSize)

    const groundXTotal = Math.floor((Math.random() * 10) + 5)
    const groundYTotal = Math.floor((Math.random() * 10) + 5)

    let groundX = 0
    for (let i = 0; i < groundXTotal; i++) {
      const dis = Math.floor((Math.random() * 5) + 2)
      groundX = groundX + dis * this.cellSize
      for (let y = 0; y < fieldHeight; y++) {
        const groundY = y * this.cellSize
        this.ground[`${groundX}:${groundY}`] = 'ground'
      }
    }

    let groundY = 0
    for (let i = 0; i < groundYTotal; i++) {
      const dis = Math.floor((Math.random() * 5) + 2)
      groundY = groundY + dis * this.cellSize
      for (let x = 0; x < fieldWidth; x++) {
        const groundX = x * this.cellSize
        this.ground[`${groundX}:${groundY}`] = 'ground'
      }
    }

    const minRooms = 3
    const maxRooms = 5
    const roomsCount = Math.floor(Math.random() * maxRooms + minRooms)
    const minRoomWidth = 3
    const maxRoomWidth = 5
    const minRoomHeight = 3
    const maxRoomHeight = 5


    const room = {
      x: 0,
      y: 500,
      width: 3,
      height: 3
    }

    for (let i = 0; i < roomsCount; i++) {

      for (let x = 0; x < room.width; x++) {
        for (let y = 0; y < room.height; y++) {
          let groundY = room.y + y * this.cellSize
          this.ground[`${room.x}:${groundY}`] = 'ground'
        }
        room.x += this.cellSize
      }
      const dis = Math.floor((Math.random() * 3) + 2)
      room.width = Math.floor(Math.random() * maxRoomWidth + minRoomWidth)
      room.height = Math.floor(Math.random() * maxRoomHeight + minRoomHeight)

      if (room.x > 1000) room.x = 0
      room.x += dis * this.cellSize
      room.y -= dis * this.cellSize
    }

    //this.spawnEntity(this.player)

    for (let i = 0; i < this.enemiesAmount; i++) {
      const dirX = Math.floor(Math.random() * 3 - 1)
      this.createEntities(Enemy, this.enemies)
    }

    for (let i = 0; i < this.hpsAmount; i++) {
      const dirX = Math.floor(Math.random() * 3 - 1)
      this.createEntities(HP,this.hps)
    }

    window.addEventListener('keydown', (e) => {
      if (this.player.dir === 'stop') {
        switch (e.code) {
          case 'ArrowRight':
            this.player.dir = 'right'
            break
          case 'ArrowLeft':
            this.player.dir = 'left'
            break
          case 'ArrowUp':
            this.player.dir = 'up'
            break
          case 'ArrowDown':
            this.player.dir = 'down'
            break
          case 'Space':
            this.player.isAttacked = false
            this.player.attack()
            break
        }
      }
    })
    
    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'Space':
          this.player.dir = 'stop'
      }
    })

    this.wall.onload = () => {
      this.loop()
    }
  }

  createEntities(entity, entities) {
    const randomPos = Math.floor(Math.random() * this.getGroundKeys().length - 1)
    const x = parseInt(this.getGroundKeys()[randomPos].split(':')[0])
    const y = parseInt(this.getGroundKeys()[randomPos].split(':')[1])
    
    entities.push(new entity(this, x, y))
  }
  
  getGroundKeys(refresh = false) {
    if (!this.groundKeys || refresh) {
      this.groundKeys = Object.keys(this.ground)
    }
    return this.groundKeys
  }

  drawGround() {
    for (let cell of this.getGroundKeys()) {
      const x = cell.split(':')[0]
      const y = cell.split(':')[1]
      this.ctx.drawImage(this.bg, x, y, this.cellSize, this.cellSize);
    }
  }

  drawWalls() {
    for (let x = 0; x < this.cols; x++) {
      const posX = x * this.cellSize
      for (let y = 0; y < this.rows; y++) {
        const posY = y * this.cellSize
        this.ctx.drawImage(this.wall, posX, posY, this.cellSize, this.cellSize);
      }
    }
  }

  drawPlayer() {
    this.player.draw(this.ctx)
  }
  
  drawSword() {
    if(this.sword) this.sword.draw(this.ctx)
  }

  drawEnemies() {
    for (let enemy of this.enemies) {
      enemy.draw(this.ctx)
    }
  }

  drawHPs() {
    for (let hp of this.hps) {
      hp.draw(this.ctx)
    }
  }

  update() {
    this.player.update()
    for (let i = 0; i < this.hps.length; i++) {
      this.hps[i].update()
      if (this.hps[i].delete) {
        this.hps.splice(i, 1)
        i--
      }
    }

    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update()
      if (this.enemies[i].delete) {
        this.enemies.splice(i, 1)
        i--
      }
    }
    
    if(this.sword) {
      this.sword.update()
    }
  }

  draw() {
    this.drawWalls()
    this.drawGround()
    this.drawEnemies()
    this.drawHPs()
    this.drawPlayer()
    this.drawSword()
  }


  loop = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.update()
    this.draw()
    window.requestAnimationFrame(this.loop)
  }
}
