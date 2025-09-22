export class Inventory {
  constructor(game) {
    this.game = game
    this.items = []

    this.game.events.on("PLAYER_GET_INVENTORY", data => {
      data.image.height = this.game.inventoryDiv.clientHeight
      this.items.push(data)
      this.drawInventory()
    })

    this.game.events.on("GAME_OVER", data => {
      this.clearInventory()
    })
  }

  drawInventory() {
    this.items.forEach(item => {
      this.game.inventoryDiv.appendChild(item.image)
    })
  }

  clearInventory() {
    if (this.game.inventoryDiv.childElementCount) {
      this.items.forEach(item => {
        this.game.inventoryDiv.removeChild(this.game.inventoryDiv.lastChild);
      })
    }
  }

}
