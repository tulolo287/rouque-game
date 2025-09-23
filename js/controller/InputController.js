class InputController {
    constructor(game) {
        this.game = game

        window.addEventListener('keydown', (e) => {
            this.keydownEventListener(e)
        })

        window.addEventListener('keyup', (e) => {
            this.keyupEventListener(e)
        })
    }

    keydownEventListener(e) {
        if (this.game.player.dir === 'stop') {
            switch (e.code) {
                case 'ArrowRight':
                case 'KeyD':
                    this.game.player.dir = 'right'
                    break
                case 'ArrowLeft':
                case 'KeyA':
                    this.game.player.dir = 'left'
                    break
                case 'ArrowUp':
                case 'KeyW':
                    this.game.player.dir = 'up'
                    break
                case 'ArrowDown':
                case 'KeyS':
                    this.game.player.dir = 'down'
                    break
                case 'Space':
                    this.game.player.isAttacked = false
                    this.game.player.attack()
                    break
            }
        }
    }

    keyupEventListener(e) {
        switch (e.code) {
            case 'ArrowRight':
            case 'KeyD':
            case 'ArrowLeft':
            case 'KeyA':
            case 'ArrowUp':
            case 'KeyW':
            case 'ArrowDown':
            case 'KeyS':
            case 'Space':
                this.game.player.dir = 'stop'
        }
    }
    removeEventListeners() {
        window.removeEventListener('keydown', this.keydownEventListener)
        window.removeEventListener('keyup', this.keyupEventListener)
    }
}