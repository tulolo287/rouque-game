import { Entity } from './Entity.js';

export class Enemy extends Entity {
  constructor(game, x, y, width, height, imageSrc) {
    super(game, x, y, width, height, imageSrc)
    this.speed = 1
    this.dir = 'left'
    this.destination = {
      x: this.x,
      y: this.y
    }
    this.image.src = imageSrc ?? "/images/tile-E.png"
    this.health = this.width
    this.delete = false
    this.distanceTravel = Math.floor(Math.random() * 50 + 10)
    this.step = 0

    this.game.events.on("PLAYER_ATTACK", data => {
      if (this.isCollidedWith(this, this.game.cellSize, data.item) ||
        this.x === data.item.x && this.y === data.item.y) {
        this.health -= data.item.attackStrength
        data.item.isAttacked = false
      }
    })
  }

  isCollidedWith(obj1, distance, obj2) {
    if (obj1.x + distance === obj2.x && obj1.y === obj2.y) {
      return 'right'
    }
    if (obj1.x - distance === obj2.x && obj1.y === obj2.y) {
      return 'left'
    }
    if (obj1.y + distance === obj2.y && obj1.x === obj2.x) {
      return 'down'
    }
    if (obj1.y - distance === obj2.y && obj1.x === obj2.x) {
      return 'up'
    }
    return false
  }

  update() {
    this.step += 1
    if (this.step % this.distanceTravel === 0) {
      this.step = 0
      const newDir = Math.floor(Math.random() * 5)
      this.dir = ['right', 'left', 'top', 'down'][newDir]
    }
    const distance = this.checkDistance()
    if (distance <= 1) {
      this.move()
    }

    const playerDir = this.isCollidedWith(this, this.game.cellSize, this.game.player)
    if (playerDir) {
      this.x = this.game.player.x
      this.y = this.game.player.y
      this.dir = playerDir
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
    super.draw()
    this.game.ctx.fillStyle = this.health > this.width * .5 ? "green" : "red";
    this.game.ctx.fillRect(this.x, this.y - 10, this.health, this.healthHeight);
  }
}