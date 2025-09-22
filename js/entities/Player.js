import {Entity} from './Entity.js';

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
    this.lives = 1
    this.isAttacked = false
    
    this.health = this.width
    this.delete = false
    
    this.game.events.on("ENEMY_ATTACK", data => {
          this.health -= 10
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