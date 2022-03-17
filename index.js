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
    const position = {
        x: Math.floor((Math.random() * (game.maxWidth - 0) + 0) / 100) * 100,
        y: random(-100, -20)
    }
    
    return new Tiles(timer, position)
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
        this.bar = [
            new Bar({x: 0, y: canvas.height - 100}, 'rgba(255, 255, 255, .5)'),
            new Bar({x: 100, y: canvas.height - 100}, 'rgba(255, 255, 255, .5)'),
            new Bar({x: 200, y: canvas.height - 100}, 'rgba(255, 255, 255, .5)'),
            new Bar({x: 300, y: canvas.height - 100}, 'rgba(255, 255, 255, .5)'),
        ]
        
        this.InputHandler = new InputHandler(this)
        this.reset()
    }

    reset(){
        this.tiles = []
        this.score = 0
        this.tilesVanish = 0
        this.totalScore = 0
        this.spawnTimeOut = null
    }


    // notCrashed(object1, object2){
    //     return object1.position.x > object2.position.x + object2.width ||
    //         object1.position.x + object1.width < object2.position.x ||
    //         object1.height > object2.position.y + object2.height ||
    //         object1.height + object1.position.y < object2.height
    // }

    isCrashed(object1, object2){
        console.log(object1.position.x, object2.position.x, object1.position.x + object1.width, object2.position.x + object2.width)
        if(object1.position.y + 100 + 30 > object2.position.y && (object1.position.x == object2.position.x && object1.position.x + object1.width == object2.position.x + object2.width)){
            return true
        }

        return false
    }

    draw(ctx){
        if(this.state == GAME_STATE.RUNNING){
            [...this.tiles, ...this.keyNotes, ...this.bar].forEach(e => e.draw(ctx));
        }

        if(this.tilesVanish > 0){
            this.totalScore = Math.round((this.score / this.tilesVanish * 100))
        }else{
            this.totalScore = 0
        }
        // localStorage.setItem('score', this.totalScore)
        // (this.tilesVanish > 0 && this.totalScore < 50) ? console.log('end') : ''
        ctx.font = '30px Arial'
        ctx.fillStyle = 'white'
        ctx.fillText(this.totalScore, canvas.width / 2 - 20, 50, 50)
    }

    update(timer){
        [...this.keyNotes, ...this.bar].forEach(e => e.update())
        const timerMultiplier = Math.floor(timer) / 100
        console.log(timerMultiplier)
        const speedMultiplier = speedProgress / 100 / 2
        this.tiles.forEach(e => e.update(3, timerMultiplier, speedMultiplier))
        // if(this.tiles.length <= 0){

        // }
        // setInterval(() => {
        // }, 1000);
        if(this.spawnTimeOut == null){
            let timeout = (1000 - (1000 * timerMultiplier))
            console.log('time', timeout, 'speed', speedMultiplier, timeout - (timeout * speedMultiplier))
            this.spawnTimeOut = setTimeout(() => {
                this.spawnTimeOut = null
                this.tiles.push(spawnTiles(Math.floor(timer / 10), this))
            }, timeout - (timeout * speedMultiplier))
        }
        this.tiles.forEach((e, index) => {
            if(e.position.y > this.maxHeight - 50){
                this.tiles.splice(index, 1)
                this.tilesVanish += 1
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
        this.width = 100
        this.height = 100
    }

    draw(ctx){
        ctx.fillStyle = 'cyan'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.stroke()
    }

    update(speed, timerMultiplier, speedMultiplier){
        const totalSpeed = speed + (speed * timerMultiplier)
        this.position.y += totalSpeed + (totalSpeed * speedMultiplier)
    }
}

class Keynote{
    constructor(position, positionText, sizeBlock, text, color){
        this.position = position
        this.positionText = positionText
        this.width = sizeBlock
        this.height = sizeBlock
        this.text = text
        this.color = color
    }

    draw(ctx){
        // Block
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        // Text
        ctx.fillStyle = 'white'
        ctx.font = '30px Arial'
        ctx.fillText(this.text, this.positionText.x, this.positionText.y)
    }

    update(){
        
    }
}

class Bar{
    constructor(position, color){
        this.position = position
        this.color = color
    }

    draw(ctx){
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, 100, 10)
    }x

    update(){

    }
}

class InputHandler{
    constructor(game){
        this.isValid = {
            d: true,
            f: true,
            j: true,
            k: true,
        }
        document.addEventListener('keydown', e => {
            e.preventDefault()
            // new Bar({x: 0, y: canvas.height - 100}, 'rgba(255, 255, 255, .5)'),
            // new Bar({x: 100, y: canvas.height - 100}, 'rgba(255, 255, 255, .5)'),
            // new Bar({x: 200, y: canvas.height - 100}, 'rgba(255, 255, 255, .5)'),
            // new Bar({x: 300, y: canvas.height - 100}, 'rgba(255, 255, 255, .5)'),
            switch (e.key) {
                case 'd':
                    game.tiles.forEach((tile, index) => {
                        // console.log(game.isCrashed(tile, game.keyNotes[0]))
                        console.log(this.isValid.d)
                        if(this.isValid.d && game.isCrashed(tile, game.keyNotes[0])){
                            game.score += 1
                            game.tilesVanish += 1
                            game.tiles.splice(index, 1)
                            const audio = new Audio('./audio/zapsplat_multimedia_game_sound_thin_harsh_metal_tone_hit_003_81129.mp3')
                            audio.play()
                        }else{
                            this.isValid.d = false
                        }
                    })

                    // const gradient = ctx.createLinearGradient(0, 0, 0, 90)
                    // gradient.addColorStop(0, 'rgba(0, 0, 0, .2)')
                    // gradient.addColorStop(1, 'rgba(0, 0, 0, .2)')

                    game.bar[0].color = 'white'
                    break;
                case 'f':
                    game.tiles.forEach((tile, index) => {
                        if(game.isCrashed(tile, game.keyNotes[1])){
                            game.score += 1
                            game.tilesVanish += 1
                            game.tiles.splice(index, 1)
                            const audio = new Audio('./audio/zapsplat_multimedia_game_sound_thin_harsh_metal_tone_hit_003_81129.mp3')
                            audio.play()
                        }
                    })

                    game.bar[1].color = 'white'
                    break;
                case 'j':
                    game.tiles.forEach((tile, index) => {
                        if(game.isCrashed(tile, game.keyNotes[2])){
                            game.score += 1
                            game.tilesVanish += 1
                            game.tiles.splice(index, 1)
                            const audio = new Audio('./audio/zapsplat_multimedia_game_sound_thin_harsh_metal_tone_hit_003_81129.mp3')
                            audio.play()
                        }
                    })

                    game.bar[2].color = 'white'
                    break;
                case 'k':
                    game.tiles.forEach((tile, index) => {
                        if(game.isCrashed(tile, game.keyNotes[3])){
                            game.score += 1
                            game.tilesVanish += 1
                            game.tiles.splice(index, 1)
                            const audio = new Audio('./audio/zapsplat_multimedia_game_sound_thin_harsh_metal_tone_hit_003_81129.mp3')
                            audio.play()
                        }
                    })

                    game.bar[3].color = 'white'
                    break;
                case 'Escape':
                    if(isPaused){
                        unpause()
                    }else{
                        pause()
                    }
                    break;

                case e.ctrlKey && '+':
                    speedProgress += 10
                    setSpeedProgress()
                    break;

                case e.ctrlKey && '-':
                    speedProgress -= 10
                    setSpeedProgress()
                    break;

                case 'r':
                    restart()
                    break;
            
                default:
                    break;
            }
        })

        document.addEventListener('keyup', e => {
            switch(e.keyCode){
                case 68:
                    this.isValid.d = true
                    game.bar[0].color = 'rgba(255, 255, 255, .5)'
                    break;
                case 70:
                    
                    game.bar[1].color = 'rgba(255, 255, 255, .5)'
                    break;
                case 74:

                    game.bar[2].color = 'rgba(255, 255, 255, .5)'
                    break;
                case 75:

                    game.bar[3].color = 'rgba(255, 255, 255, .5)'
                    break;
                default:
                    break;
            }
        })
    }
}

function restart(){
    game.reset()
    countdown = 0
    timer = 0
    timerInterval = null
    isPaused = true
    startCountdown()
}

function setSpeedProgress(){
    document.getElementById('speedMultiplier').value = speedProgress
}

const game = new Game(canvas.width, canvas.height)
let countdown = 0
let textTimer = document.getElementById('timer')
let timer = 0
let speedProgress = document.getElementById('speedMultiplier').value
let isPaused = false
let timerInterval = null


function pause(){
    isPaused = true
    countdown = 0
    clearInterval(timerInterval)
}

function unpause(){
    isPaused = false
    startCountdown()
}

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

    if(!isPaused){
        requestAnimationFrame(animate)
    }
}

let countdownInterval = null

function startCountdown(){
    countdownInterval = setInterval(() => {
        if(countdown == 3){
            isPaused = false
            clearInterval(countdownInterval)
    
            const audio = new Audio('./audio/0140. Avalanche - AShamaluevMusic.mp3')
            audio.play()
            audio.addEventListener('ended', function(){
                alert('Game ended, your score is ' + game.score)
            })
    
            timerInterval = setInterval(() => {
                if(!isPaused){
                    timer += 1
                    textTimer.innerHTML = 'Time: ' + timer
                }
            }, 1000);
    
    
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

startCountdown()