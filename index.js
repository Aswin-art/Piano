const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 400
canvas.height = 605

const GAME_STATE = {
    GAMEOVER: 0,
    RUNNING: 1,
    MENU: 2
}
function spawnTiles(timer, game){
    let tiles = []
    const position = {
        x: Math.floor((Math.random() * (game.maxWidth - 0) + 0) / 100) * 100,
        y: random(-100, -20)
    }
    tiles.push(new Tiles(timer, position))
    return tiles
}

function random(min, max){
    return Math.floor(Math.random() * (min - 1) + max)
}

class Game{
    constructor(maxWidth, maxHeight){
        this.maxWidth = maxWidth
        this.maxHeight = maxHeight
        this.state = GAME_STATE.RUNNING
        this.keyNotes = [
            new Keynote({x: 0, y: canvas.height - 100}, {x: 100 / 2 - 10, y: canvas.height - 30}, 100, 'D', 'rgb(1, 44, 136)'),
            new Keynote({x: 100, y: canvas.height - 100}, {x: 300 / 2 - 10, y: canvas.height - 30}, 100, 'F', 'rgb(0, 33, 105)'),
            new Keynote({x: 200, y: canvas.height - 100}, {x:500 / 2 - 10, y: canvas.height - 30}, 100, 'J', 'rgb(1, 44, 136)'),
            new Keynote({x: 300, y: canvas.height - 100}, {x: 700 / 2 - 10, y: canvas.height - 30}, 100, 'K', 'rgb(0, 33, 105)'),
        ]
        this.tiles = spawnTiles(0,this)
        this.score = 0
        this.InputHandler = new InputHandler(this)
    }

    // notCrashed(object1, object2){
    //     return object1.position.x > object2.position.x + object2.width ||
    //         object1.position.x + object1.width < object2.position.x ||
    //         object1.height > object2.position.y + object2.height ||
    //         object1.height + object1.position.y < object2.height
    // }

    isCrashed(object1, object2){
        if(object1.position.y + 100 + 30 > object2.position.y){
            return true
        }

        return false
    }

    draw(ctx){
        if(this.state == GAME_STATE.RUNNING){
            [...this.tiles, ...this.keyNotes].forEach(e => e.draw(ctx));
            ctx.font = '30px Arial'
            ctx.fillText(this.score, canvas.width / 2 - 20, 50, 50);
        }
    }

    update(timer){
        [...this.tiles, ...this.keyNotes].forEach(e => e.update())
        if(this.tiles.length <= 0){
            this.tiles = spawnTiles(Math.floor(timer / 10), this)
        }
        this.tiles.forEach((e, index) => {
            if(e.position.y > this.maxHeight - 50){
                this.tiles.splice(index, 1)
                if(this.score > 0){
                    this.score -= 10
                }
            }
        })

        // this.tiles.forEach((tile, index) => {
        //     this.keyNotes.forEach((keyNote) => {
        //         if(!this.notCrashed(tile, keyNote)){
        //             (this.score == 0) ? this.score -= 10 : this.score = 0
        //             this.tiles.splice(index, 1)
        //         }
        //     })
        // })

    }
}
class Tiles{
    constructor(timer, position){
        this.position = position
        this.size = 100
        this.speed = 3
        this.timer = timer
    }

    draw(ctx){
        ctx.fillStyle = 'cyan'
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    update(){
        this.position.y += this.speed + this.timer
    }
}

class Keynote{
    constructor(position, positionText, sizeBlock, text, color){
        this.position = position
        this.positionText = positionText
        this.sizeBlock = sizeBlock
        this.text = text
        this.color = color
    }

    draw(ctx){
        // Block
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.sizeBlock, this.sizeBlock)

        // Text
        ctx.fillStyle = 'white'
        ctx.font = '30px Arial'
        ctx.fillText(this.text, this.positionText.x, this.positionText.y)
    }

    update(){
        
    }
}

class InputHandler{
    constructor(game){
        document.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 68:
                    game.tiles.forEach((tile, index) => {
                        if(game.isCrashed(tile, game.keyNotes[0])){
                            game.score += 10
                            game.tiles.splice(index, 1)
                            const audio = new Audio('./audio/zapsplat_multimedia_game_sound_thin_harsh_metal_tone_hit_003_81129.mp3')
                            audio.play()
                        }
                    })
                    break;
                case 70:
                    game.tiles.forEach((tile, index) => {
                        if(game.isCrashed(tile, game.keyNotes[1])){
                            game.score += 10
                            game.tiles.splice(index, 1)
                            const audio = new Audio('./audio/zapsplat_multimedia_game_sound_thin_harsh_metal_tone_hit_003_81129.mp3')
                            audio.play()
                        }
                    })
                    break;
                case 74:
                    game.tiles.forEach((tile, index) => {
                        if(game.isCrashed(tile, game.keyNotes[2])){
                            game.score += 10
                            game.tiles.splice(index, 1)
                            const audio = new Audio('./audio/zapsplat_multimedia_game_sound_thin_harsh_metal_tone_hit_003_81129.mp3')
                            audio.play()
                        }
                    })
                    break;
                case 75:
                    game.tiles.forEach((tile, index) => {
                        if(game.isCrashed(tile, game.keyNotes[3])){
                            game.score += 10
                            game.tiles.splice(index, 1)
                            const audio = new Audio('./audio/zapsplat_multimedia_game_sound_thin_harsh_metal_tone_hit_003_81129.mp3')
                            audio.play()
                        }
                    })
                    break;
                case 27:
                    game.state = GAME_STATE.MENU
                    localStorage.setItem('pause', true)
                    break;
            
                default:
                    break;
            }
        })
    }
}

const game = new Game(canvas.width, canvas.height)
let countdown = 0
let textTimer = document.getElementById('timer')
let timer = 0

if(!localStorage.getItem('pause')){
    const countDownInterval = setInterval(() => {
        if(countdown == 3){
            clearInterval(countDownInterval)
    
            const audio = new Audio('./audio/0140. Avalanche - AShamaluevMusic.mp3')
            audio.play()
    
            setInterval(() => {
                timer += 1
                textTimer.innerHTML = 'Time: ' + timer
            }, 1000);
    
            function animate(){
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                game.update(timer)
                game.draw(ctx)
    
                // ctx.fillStyle = 'white'
                // ctx.font = '50px Arial'
                // ctx.fillText(timer, 10, 60)
    
                ctx.beginPath()
                ctx.strokeStyle = 'rgba(255, 255, 255, .25)'
                ctx.lineWidth = 1
                ctx.moveTo(100, 0)
                ctx.lineTo(100, canvas.height - 100)
    
                ctx.moveTo(200, 0)
                ctx.lineTo(200, canvas.height - 100)
    
                ctx.moveTo(300, 0)
                ctx.lineTo(300, canvas.height - 100)
                ctx.stroke()
                requestAnimationFrame(animate)
            }
    
            requestAnimationFrame(animate)
    
        }else{
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            countdown += 1
            ctx.fillStyle = 'white'
            ctx.font = '50px Arial'
            ctx.fillText(countdown, canvas.width / 2 - 25, canvas.height / 2)
        }
    }, 1000)
}

// const play = document.getElementById('play')
// play.addEventListener('click', function(){
// })