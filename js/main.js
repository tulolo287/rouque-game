class Game {
  init() {
    const canvas = document.createElement("canvas")
    const field = document.querySelector(".field")
    canvas.width = field.clientWidth
    canvas.height = field.clientHeight

    const ctx = canvas.getContext("2d")

    const bg = new Image()
    bg.src = "/images/tile-.png"

    const player = {
      x: 100,
      y: 100,
      image: new Image()
    }

    player.image.src = "/images/tile-P.png"

    const wall = new Image()
    wall.src = "/images/tile-W.png"

    const cellSize = 50


    const cells2 = {
      x: {
        100: 'ground',
        150: 'ground',
      },
      y: {
        124: 'ground'
      }
    }

    function drawBg() {

      let x = 0
      let y = 0
      const rows = canvas.width / cellSize//canvas.width / bg.width
      const cols = canvas.height / cellSize
      const fieldWidth = 100

      const cells = []

      const groundXTotal = Math.floor((Math.random() * 10) + 5)
      const groundYTotal = Math.floor((Math.random() * 10) + 5)

      let groundX = 0
      for (let i = 0; i < groundXTotal; i++) {
        const dis = Math.floor((Math.random() * 5) + 2)
        groundX = groundX + dis * cellSize
        for (let y = 0; y < fieldWidth; y++) {
          cells.push({ x: groundX, y: y * cellSize })
        }
      }

      let groundY = 0
      for (let i = 0; i < groundYTotal; i++) {
        const dis = Math.floor((Math.random() * 5) + 2)
        groundY = groundY + dis * cellSize
        for (let x = 0; x < fieldWidth; x++) {
          cells.push({ x: x * cellSize, y: groundY })
        }
      }

      const room = {
        width: 5,
        height: 3
      }

      let roomX = 0
      for (let x = 0; x < room.width; x++) {
        roomX += cellSize
        for (let y = 0; y < room.height; y++) {
          cells.push({ x: roomX, y: y * cellSize })
        }
      }



      for (let cell of cells) {
        // console.log(cell)

        ctx.drawImage(bg, cell.x, cell.y, cellSize, cellSize);

      }

    }



    function drawWalls() {
      let x = 0
      let y = 0
      const rows = canvas.width / cellSize
      const cols = canvas.height / cellSize

      for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
          ctx.drawImage(wall, x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    function drawPlayer(ctx) {
      ctx.drawImage(player.image, player.x, player.y, cellSize, cellSize);
    }

    function playerMove() {
      console.log(player)
      if (cells2.x[player.x + cellSize] === 'ground') {
        player.x += 10
      }

    }

    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'ArrowRight':
          playerMove()
          break
        case 'ArrowLeft':
          player.x -= 10
          break
      }
    })

    wall.onload = () => {

      drawWalls()
      drawBg()
      drawPlayer()
    }



    field.appendChild(canvas)

    const loop = () => {
      drawPlayer(ctx)
      window.requestAnimationFrame(loop)
    }

    loop()

  }
}