import {Entity} from './Entity.js';

export class Enemy extends Entity {
  constructor(game, x, y, width, height, imageSrc) {
    super(game, x, y, width, height, imageSrc)
    this.speed = 2
    this.dir = 'left'
    this.destination = {
      x: this.x,
      y: this.y
    }
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
      const newDir = Math.floor(Math.random() * 5)
      this.dir = ['right', 'left', 'top', 'down'][newDir]
      console.log(newDir)
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
    super.draw()
    this.game.ctx.fillStyle = this.health > this.width * .5 ? "green" : "red";
    this.game.ctx.fillRect(this.x, this.y - 10, this.health, 10);
  }
}