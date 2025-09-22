import { Entity } from './Entity.js';

export class Player extends Entity {
  constructor(game, x, y, width, height, imageSrc) {
    super(game, x, y, width, height, imageSrc)
    this.speed = 3
    this.destination = {
      x: this.x,
      y: this.y
    }
    this.dir = 'stop'
    this.image.src = imageSrc ?? "/images/tile-P.png"
    this.isAttacked = false
    this.attackStrength = 1

    this.health = this.width
    this.delete = false

    this.game.events.on("ENEMY_ATTACK", data => {
      this.health -= .5
    })
    this.game.events.on("PLAYER_GET_INVENTORY", data => {
      this.attackStrength *= 5
    })
    this.game.events.on("PLAYER_GET_HP", data => {
      this.health += 5
      this.health = this.health > this.width ? this.width : this.health
    })
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
    if (this.health <= 0) {
      this.game.gameOver()
    }
  }

  draw() {
    super.draw()
    this.game.ctx.fillStyle = this.health > this.width * .5 ? "green" : "red";
    this.game.ctx.fillRect(this.x, this.y - 10, this.health, this.healthHeight);
  }

}