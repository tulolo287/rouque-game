class Events {
  callbacks = [];

  emit(name, value) {
    this.callbacks.forEach(event => {
      if (event.name === name) {
        event.callback(value)
      }
    })
  }

  on(name, callback) {
    this.callbacks.push({
      name,
      callback,
    });
  }

}


class Inventory {
  constructor(game) {
    this.game = game
    this.items = []

    this.game.events.on("PLAYER_GET_HP", data => {
      data.item.x = this.items.length * data.item.width
      data.item.y = 0
      this.items.push(data.item)
    })
    this.game.events.on("ENEMY_ATTACK", data => {
      this.items.pop()
    })
  }
  draw() {
    this.items.forEach(item => { item.draw() }
    )
  }

}


class Game {

  constructor() {
    this.canvas = document.createElement("canvas")
    this.field = document.querySelector(".field")
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

    this.events = new Events()

    this.bg = new Image()
    this.wall = new Image()



    this.groundKeys = null

    this.player = new Player(this)
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

    for (let i = 0; i < 15; i++) {
      const dirX = Math.floor(Math.random() * 3 - 1)
      this.createEnemy()
    }

    for (let i = 0; i < 5; i++) {
      const dirX = Math.floor(Math.random() * 3 - 1)
      this.createHP(i)
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

  createHP(id) {
    const randomPos = Math.floor(Math.random() * this.getGroundKeys().length - 1)
    const x = parseInt(this.getGroundKeys()[randomPos].split(':')[0])
    const y = parseInt(this.getGroundKeys()[randomPos].split(':')[1])
    const hp = new HP(this, id, x, y)
    this.hps.push(hp)
  }
  createEnemy() {
    const randomPos = Math.floor(Math.random() * this.getGroundKeys().length - 1)
    const x = parseInt(this.getGroundKeys()[randomPos].split(':')[0])
    const y = parseInt(this.getGroundKeys()[randomPos].split(':')[1])
    const enemy = new Enemy(this, x, y)
    this.enemies.push(enemy)
  }

  configureEnemy(entity) {
    const randomPos = Math.floor(Math.random() * this.getGroundKeys().length - 1)
    entity.x = parseInt(this.getGroundKeys()[randomPos].split(':')[0])
    entity.y = parseInt(this.getGroundKeys()[randomPos].split(':')[1])
  }

  getGroundKeys() {
    //  if (!this.groundKeys) {
    this.groundKeys = Object.keys(this.ground)
    //  }
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

  drawInventory() {
    this.inventory.draw(this.ctx)
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
  }

  draw() {
    this.drawWalls()
    this.drawGround()
    this.drawEnemies()
    this.drawHPs()
    this.drawPlayer()
    this.drawInventory()
  }


  loop = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.update()
    this.draw()
    window.requestAnimationFrame(this.loop)
  }
}


class Player {
  constructor(game, x, y, width, height, imageSrc) {
    this.game = game
    this.x = x ?? 100
    this.y = y ?? 100
    this.width = width ?? game.cellSize
    this.height = height ?? game.cellSize
    this.speed = 3
    this.destination = {
      x: this.x,
      y: this.y
    }
    this.dir = 'stop'
    this.image = new Image()
    this.image.src = imageSrc ?? "/images/tile-P.png"
    this.lives = 0
    this.isAttacked = false
  }

  isGround(x, y) {
    const coord = `${x}:${y}`
    return true
    return this.game.ground[coord] === 'ground' ? true : false
  }

  checkDistance() {
    let distanceToX = this.destination.x - this.x
    let distanceToY = this.destination.y - this.y

    let distance = Math.sqrt(distanceToX ** 2 + distanceToY ** 2)
    if (distance <= this.speed) {
      this.x = this.destination.x
      this.y = this.destination.y
    } else {
      let normalizedX = distanceToX / distance;
      this.x += normalizedX * this.speed;
      let normalizedY = distanceToY / distance;
      this.y += normalizedY * this.speed;

      distanceToX = this.destination.x - this.x;
      distanceToY = this.destination.y - this.y;

      distance = Math.sqrt(distanceToX ** 2 + distanceToY ** 2)
    }

    return distance
  }

  move() {
    let nextPosX = this.destination.x
    let nextPosY = this.destination.y

    if (this.dir === 'right') {
      nextPosX += this.width
    }
    if (this.dir === 'left') {
      nextPosX -= this.width
    }
    if (this.dir === 'up') {
      nextPosY -= this.height
    }
    if (this.dir === 'down') {
      nextPosY += this.height
    }
    if (this.isGround(nextPosX, nextPosY)) {
      this.destination.x = nextPosX
      this.destination.y = nextPosY
    }
  }

  attack() {
    if (!this.isAttacked) {
      this.game.events.emit("PLAYER_ATTACK", {
        item: this
      })
      this.isAttacked = true
    }
  }

  update() {
    const distance = this.checkDistance()
    if (distance <= 1) {
      this.move()
    }

  }

  draw() {
    this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class HP {
  constructor(game, id, x, y, width, height, imageSrc) {
    this.game = game
    this.x = x ?? 100
    this.y = y ?? 100
    this.id = id
    this.width = width ?? game.cellSize
    this.height = height ?? game.cellSize
    this.image = new Image()
    this.image.src = imageSrc ?? "/images/tile-HP.png"
    this.delete = false
  }

  update() {
    if (this.x === this.game.player.x && this.y === this.game.player.y) {
      this.game.events.emit("PLAYER_GET_HP", {
        item: this
      })
      this.game.player.lives += 1
      this.delete = true
    }
  }

  draw() {
    this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

}


class Enemy {
  constructor(game, x, y, width, height, imageSrc) {
    this.game = game
    this.x = x ?? 100
    this.y = y ?? 100
    this.width = width ?? game.cellSize
    this.height = height ?? game.cellSize
    this.speed = 2
    this.dir = 'left'
    this.destination = {
      x: this.x,
      y: this.y
    }
    this.image = new Image()
    this.image.src = imageSrc ?? "/images/tile-E.png"
    this.health = this.width
    this.delete = false

    this.game.events.on("PLAYER_ATTACK", data => {
      if (this.x + this.game.cellSize === data.item.x ||
        this.x - this.game.cellSize === data.item.x
      ) {
        if (this.y === data.item.y) {
          this.health -= 10
          data.item.isAttacked = false
        }
      }
    })
  }

  isGround(x, y) {
    const coord = `${x}:${y}`
    return this.game.ground[coord] === 'ground' ? true : false
  }

  checkDistance() {
    let distanceToX = this.destination.x - this.x
    let distanceToY = this.destination.y - this.y

    let distance = Math.sqrt(distanceToX ** 2 + distanceToY ** 2)
    if (distance <= this.speed) {
      this.x = this.destination.x
      this.y = this.destination.y
    } else {
      let normalizedX = distanceToX / distance;
      this.x += normalizedX * this.speed;
      let normalizedY = distanceToY / distance;
      this.y += normalizedY * this.speed;

      distanceToX = this.destination.x - this.x;
      distanceToY = this.destination.y - this.y;

      distance = Math.sqrt(distanceToX ** 2 + distanceToY ** 2)
    }

    return distance
  }

  move() {
    let nextPosX = this.destination.x
    let nextPosY = this.destination.y

    if (this.dir === 'right') {
      nextPosX += this.width
    }
    if (this.dir === 'left') {
      nextPosX -= this.width
    }
    if (this.dir === 'up') {
      nextPosY -= this.height
    }
    if (this.dir === 'down') {
      nextPosY += this.height
    }
    if (this.isGround(nextPosX, nextPosY)) {
      this.destination.x = nextPosX
      this.destination.y = nextPosY
    } else {
      this.dir = 'up'
    }
  }

  update() {
    const distance = this.checkDistance()
    if (distance <= 10) {
      this.move()
    }
    if (this.x === this.game.player.x && this.y === this.game.player.y) {
      this.game.events.emit("ENEMY_ATTACK", {
        item: this
      })
    }
    if (this.health <= 0) {
      this.delete = true
    }
  }

  draw() {
    this.game.ctx.fillStyle = this.health > this.width * .5 ? "green" : "red";
    this.game.ctx.fillRect(this.x, this.y - 10, this.health, 10);
    this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}