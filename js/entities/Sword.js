import {Entity} from './Entity.js';

export class Sword extends Entity {
  constructor(game, id, x, y, width, height, imageSrc) {
    super(game, x, y, width, height, imageSrc)
    this.id = id
    this.image.src = imageSrc ?? "/images/tile-SW.png"
    this.delete = false
  }

  update() {
    if (this.x === this.game.player.x && this.y === this.game.player.y) {
      this.game.events.emit("PLAYER_GET_SWORD", {
        image: this.image
      })
      delete this.game.sword
    }
  }

}
