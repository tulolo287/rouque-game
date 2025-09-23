import { Entity } from './Entity.js';

export class Sword extends Entity {
  constructor(game, x, y, width, height, imageSrc) {
    super(game, x, y, width, height, imageSrc)
    this.image.src = imageSrc ?? "./images/tile-SW.png"
    this.delete = false
  }

  update() {
    if (this.x === this.game.player.x && this.y === this.game.player.y) {
      this.game.events.emit("PLAYER_GET_INVENTORY", {
        image: this.image
      })
      this.delete = true
    }
  }

}
