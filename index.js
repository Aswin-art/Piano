const canvas = document.getElementById('game')
const maxWidth = canvas.width = 500
const maxHeight = canvas.height = 500
const ctx = canvas.getContext('2d')

function spawnEnemy(game){
    let enemies = [];
    const position = {
        x: Math.round((Math.random()*(game.maxWidth-0)+0)/100)*100,
        y: random(-50, -10)
    }
    enemies.push(new Enemy(position, game))

    return enemies;
}

function random(min, max){
    return Math.floor(Math.random() * ((max - 1) - min) + min)
}

class Game{
    constructor(maxWidth, maxHeight){
        this.maxWidth = maxWidth
        this.maxHeight = maxHeight
        this.enemies = [];
        this.ship = new Ship(this)
        new InputHandle(this)
    }

    draw(ctx){
        [this.ship, ...this.enemies].forEach(e => e.draw(ctx))
    }

    update(){
        [this.ship, ...this.enemies].forEach(e => e.update())
        if(this.enemies.length <= 0){
            this.enemies = spawnEnemy(this)
        }

        this.enemies.forEach((e, index) => {
            if(e.position.y > this.maxHeight){
                this.enemies.splice(index, 1)
            }
        })

    }
}

class Ship{
    constructor(game){
        this.maxWidth = game.maxWidth;
        this.maxHeight = game.maxHeight;

        this.image = document.getElementById('ship');
        this.width = 40;
        this.height = 40;
        this.position = {
            x: this.maxWidth / 2 - this.width / 2,
            y: this.maxHeight - this.height - 10
        }

        this.speed = 0;
        this.maxSpeed = 6;
    }

    moveLeft(){
        this.speed = -this.maxSpeed
    }

    moveRight(){
        this.speed = this.maxSpeed
    }

    stop(){
        this.speed = 0
    }

    draw(ctx){
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(){
        if(this.position.x + this.width > this.maxWidth){
            this.position.x = this.maxWidth - this.width
        }

        if(this.position.x < 0){
            this.position.x = 0
        }

        this.position.x += this.speed
    }
}

class InputHandle{
    constructor(game){
        document.addEventListener('keydown', e => {
            switch(e.keyCode){
                case 37:
                    game.ship.moveLeft()
                    break;
                case 39:
                    game.ship.moveRight()
                    break;
                default:
                    break;
            }
        })
        document.addEventListener('keyup', e => {
            switch(e.keyCode){
                case 37:
                    if(game.ship.speed < 0){
                        game.ship.stop()
                    }
                    break;
                case 39:
                    if(game.ship.speed > 0){
                        game.ship.stop()
                    }
                    break;
                default:
                    break;
            }
        })
    }
}

class Enemy{
    constructor(position, game){
        this.size = game.maxWidth / 5
        this.image = document.getElementById('musuh')
        this.speed = 3
        this.position = position,
        this.maxHeight = game.maxHeight
    }

    draw(ctx){
        ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size)
    }

    update(){
        this.position.y += this.speed
    }
}

const game = new Game(maxWidth, maxHeight)
let count = 0
setInterval(() => {
    ctx.clearRect(0, 0, maxWidth, maxHeight)
    count += 1
    ctx.font = 'bold 50px Arial'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#fff'
    ctx.baseine = 'bottom'
    ctx.fillText(count, game.maxWidth / 2 - 20, game.maxHeight / 2)
}, 1000)

let timer = 0

setTimeout(() => {
    setInterval(() => {
        timer += 1
    }, 1000)
    function animate(){
        ctx.clearRect(0, 0, maxWidth, maxHeight)
        ctx.font = 'bold 15px Arial'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#fff'
        ctx.baseine = 'bottom'
        ctx.fillText('Time: ' + timer + ' s', 40, 20)
        let addSpeed = Math.floor(timer / 10);
        console.log('add', addSpeed)
        game.enemies.forEach(e => {
            e.speed + addSpeed
            console.log('speed', e.speed)
        })
        // console.log(game.enemies.forEach(e => console.log('enemy', e.speed + addSpeed)))
        game.update()
        game.draw(ctx)
    
        requestAnimationFrame(animate)
    }
    
    requestAnimationFrame(animate)    
}, 3200);
