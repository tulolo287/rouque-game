class Entity {
  constructor(game, x, y, width, height, imageSrc) {
    this.game = game
    this.x = x ?? 100
    this.y = y ?? 100
    this.width = width ?? game.cellSize
    this.height = height ?? game.cellSize
    this.destination = {
      x: this.x,
      y: this.y
    }
    this.speed = 5
    this.image = new Image()
    this.imageLoaded = false
    this.image.onload = () => {
      this.imageLoaded = true
    }
    this.flipImage = false
    this.healthHeight = 7
  }

  isGround(x, y) {
    const coord = `${x}:${y}`
    return this.game.ground[coord] === 'ground' ? true : false
  }

  checkDistance(delta) {
    let distanceToX = this.destination.x - this.x
    let distanceToY = this.destination.y - this.y

    let distance = Math.sqrt(distanceToX ** 2 + distanceToY ** 2)
    if (distance <= this.speed * delta) {
      this.x = this.destination.x
      this.y = this.destination.y
    } else {
      let normalizedX = distanceToX / distance;
      let normalizedY = distanceToY / distance;
      
      this.x += normalizedX * this.speed * delta;
      this.y += normalizedY * this.speed * delta;

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
      this.flipImage = false
      nextPosX += this.width
    }
    if (this.dir === 'left') {
      this.flipImage = true
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

  update(delta) {
    const distance = this.checkDistance(delta)
    if (distance <= 10) {
      this.move()
    }
  }
  
  draw() {
    if(this.imageLoaded) {
      this.game.ctx.save();
      this.game.ctx.scale(this.flipImage ? -1 : 1, 1);
      this.game.ctx.drawImage(this.image, this.flipImage ? (this.width + this.x) * -1 : this.x, this.y, this.width, this.height);
      this.game.ctx.restore();
    }
  }
}