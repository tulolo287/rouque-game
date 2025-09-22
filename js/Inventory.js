export class Inventory {
  constructor(game) {
    this.game = game
    this.items = []

    this.game.events.on("PLAYER_GET_HP", data => {
      data.image.height = this.game.inventoryDiv.clientHeight
      this.items.push(data)
      this.drawInventory()
    })
    
    this.game.events.on("PLAYER_GET_SWORD", data => {
      data.image.height = this.game.inventoryDiv.clientHeight
      this.items.push(data)
      this.drawInventory()
    })
    
    this.game.events.on("ENEMY_ATTACK", data => {
      this.items.pop()
      this.removeHP()
    })
    
  }
  
  drawInventory() {
    this.items.forEach(item => {
      console.log(item)
      this.game.inventoryDiv.appendChild(item.image)
    })
   }
   
  removeHP() {
     this.game.inventoryDiv.removeChild(this.game.inventoryDiv.lastChild);
   }

}
