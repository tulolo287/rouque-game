import { Events } from "./Events.js"
import { Inventory } from "./Inventory.js"
import { InputController } from "./controller/InputController.js"
import { Enemy } from "./entities/Enemy.js"
import { HP } from "./entities/HP.js"
import { Player } from "./entities/Player.js"
import { Sword } from "./entities/Sword.js"
import { getRandom, loadImage } from "./utils/index.js"


export class Game {
  constructor() {
    this.canvas = document.createElement("canvas")
    this.field = document.querySelector(".field")
    this.inventoryDiv = document.querySelector(".inventory")
    this.ctx = this.canvas.getContext("2d")
    this.canvas.width = this.field.clientWidth
    this.canvas.height = this.field.clientHeight
    this.field.appendChild(this.canvas)

    this.cellSize = Math.floor(this.canvas.width / 40)
    this.cols = Math.ceil(this.canvas.width / this.cellSize)
    this.rows = Math.ceil(this.canvas.height / this.cellSize)
    this.enemiesAmount = 10
    this.hpsAmount = 10
    this.swordsAmount = 2

    this.events = new Events()
    this.inventory = new Inventory(this)
    this.inputController = new InputController(this)

    const imageUrls = [
      { name: 'wall', src: "/images/tile-W.png" },
      { name: 'bg', src: "/images/tile-.png" }
    ];

    const imageLoadPromises = imageUrls.map(item => loadImage(item));

    Promise.all(imageLoadPromises)
      .then(images => {
        images.forEach(item => {
          this[item.name] = item.img
        })
        this.loop()
      })
      .catch(error => {
        console.error('Error loading images:', error);
      });

  }

  init() {
    this.ground = {}
    this.walls = []
    this.enemies = []
    this.swords = []
    this.hps = []
    this.inventory.items = []
    this.groundKeys = null

    const groundXTotal = getRandom(3, 5)
    const groundYTotal = getRandom(3, 5)

    let groundX = 0
    for (let i = 0; i < groundXTotal; i++) {
      const dis = Math.floor((Math.random() * 3) + 2)
      groundX = groundX + dis * this.cellSize
      for (let y = 0; y < this.rows; y++) {
        const groundY = y * this.cellSize
        this.ground[`${groundX}:${groundY}`] = 'ground'
      }
    }

    let groundY = 0
    for (let i = 0; i < groundYTotal; i++) {
      const dis = Math.floor((Math.random() * 3) + 2)
      groundY = groundY + dis * this.cellSize
      for (let x = 0; x < this.cols; x++) {
        const groundX = x * this.cellSize
        this.ground[`${groundX}:${groundY}`] = 'ground'
      }
    }

    const roomsCount = getRandom(5, 10)
    const minRoomWidth = 3
    const maxRoomWidth = 8
    const minRoomHeight = 3
    const maxRoomHeight = 8
    const room = {
      x: 0,
      y: 500,
      width: 3,
      height: 3
    }
    for (let i = 0; i < roomsCount; i++) {
      const width = getRandom(minRoomWidth, maxRoomWidth)
      const height = getRandom(minRoomHeight, maxRoomHeight)
      const { x, y } = this.getGroundRandomPosition()
      room.x = x
      room.y = y
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let groundY = room.y + y * this.cellSize
          this.ground[`${room.x}:${groundY}`] = 'ground'
        }
        room.x += this.cellSize
      }

    }

    this.player = new Player(this, this.getGroundRandomPosition(1).x, this.getGroundRandomPosition(1).y)

    for (let i = 0; i < this.swordsAmount; i++) {
      this.createEntities(Sword, this.swords)
    }

    for (let i = 0; i < this.enemiesAmount; i++) {
      this.createEntities(Enemy, this.enemies)
    }

    for (let i = 0; i < this.hpsAmount; i++) {
      this.createEntities(HP, this.hps)
    }

  }


  createEntities(entity, entities) {
    const { x, y } = this.getGroundRandomPosition()
    entities.push(new entity(this, x, y))
  }

  getGroundRandomPosition(position = false) {
    const randPos = position || Math.floor(Math.random() * this.getGroundKeys().length - 1)
    const x = parseInt(this.getGroundKeys()[randPos].split(':')[0])
    const y = parseInt(this.getGroundKeys()[randPos].split(':')[1])
    return { x, y }
  }

  getGroundKeys(refresh = false) {
    if (!this.groundKeys || refresh) {
      this.groundKeys = Object.keys(this.ground)
    }
    return this.groundKeys
  }

  drawGround() {
    for (let cell of this.getGroundKeys(true)) {
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

  drawSwords() {
    for (let sword of this.swords) {
      sword.draw(this.ctx)
    }
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

    for (let i = 0; i < this.swords.length; i++) {
      this.swords[i].update()
      if (this.swords[i].delete) {
        this.swords.splice(i, 1)
        i--
      }
    }
  }

  draw() {
    this.drawWalls()
    this.drawGround()
    this.drawHPs()
    this.drawSwords()
    this.drawPlayer()
    this.drawEnemies()
  }

  gameOver() {
    this.events.emit("GAME_OVER", {})
    window.cancelAnimationFrame(this.rfID);
    this.inputController.removeEventListeners()
    this.init()
  }


  loop = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.update()
    this.draw()
    this.rfID = window.requestAnimationFrame(this.loop)
  }
}
