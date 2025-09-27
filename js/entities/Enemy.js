class Enemy extends Entity {
  constructor(game, x, y, width, height, imageSrc) {
    super(game, x, y, width, height, imageSrc)
    this.dir = 'left'
    this.image.src = imageSrc ?? "./images/tile-E.png"

    this.state = ['walk', 'attack']
    this.walkSpeed = 5
    this.attackSpeed = 15
    this.attackDistance = 150
    this.disX = 0
    this.disY = 0
    this.distance = 0
    this.health = this.width
    this.delete = false
    this.distanceTravel = Math.floor(Math.random() * 50 + 10)
    this.step = 0

    this.game.events.on("PLAYER_ATTACK", data => {
      if (this.distance <= this.game.cellSize) {
        this.health -= data.item.attackStrength
        if (Math.abs(this.disX) > Math.abs(this.disY)) {
          this.x = data.item.faceLeft === false ? this.x += this.game.cellSize : this.x -= this.game.cellSize
        } else if (Math.abs(this.disX) < Math.abs(this.disY)) {
          this.y = this.disY > 0 ? this.y += this.game.cellSize : this.y -= this.game.cellSize
        } 
        data.item.isAttacked = false
      }
    })
  }


  update(delta) {
    super.update(delta)

    const { disX, disY, distance } = getDistance(this, this.game.player)
    this.disX = disX
    this.disY = disY
    this.distance = distance

    if (this.distance < this.attackDistance) {
      this.speed = this.attackSpeed
      if (Math.abs(this.disX) > Math.abs(this.disY)) {
        this.dir = this.disX > 0 ? 'left' : 'right'
      } else {
        this.dir = this.disY > 0 ? 'up' : 'down'
      }
    } else {
      this.speed = this.walkSpeed
      this.step += 1
      if (this.step % this.distanceTravel === 0) {
        this.step = 0
        const newDir = Math.floor(Math.random() * 5)
        this.dir = ['right', 'left', 'up', 'down'][newDir]
      }
    }


    if (this.distance < this.game.cellSize) {
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