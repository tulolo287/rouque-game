import {Entity} from './Entity.js';

export class HP extends Entity {
  constructor(game, x, y, width, height, imageSrc) {
    super(game, x, y, width, height, imageSrc)
    this.image.src = imageSrc ?? "/images/tile-HP.png"
    this.delete = false
  }

  update() {
    if (this.x === this.game.player.x && this.y === this.game.player.y) {
      this.game.events.emit("PLAYER_GET_HP", {
        image: this.image
      })
      this.delete = true
    }
  }

}
