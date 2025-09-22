export class Entity {
  constructor(game, x, y, width, height, imageSrc) {
    this.game = game
    this.x = x ?? 100
    this.y = y ?? 100
    this.width = width ?? game.cellSize
    this.height = height ?? game.cellSize
    this.image = new Image()
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

draw() {
  this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
}
}