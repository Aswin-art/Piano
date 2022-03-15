window.onload = function(){
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 400
    canvas.height = 500

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
            this.keyNotes = [
                new Keynote({x: 0, y: canvas.height - 100}, {x: 100 / 2 - 20, y: canvas.height - 30}, 100, 'D', 'red'),
                new Keynote({x: 100, y: canvas.height - 100}, {x: 300 / 2 - 20, y: canvas.height - 30}, 100, 'F', 'black'),
                new Keynote({x: 200, y: canvas.height - 100}, {x:500 / 2 - 20, y: canvas.height - 30}, 100, 'J', 'red'),
                new Keynote({x: 300, y: canvas.height - 100}, {x: 700 / 2 - 20, y: canvas.height - 30}, 100, 'K', 'black'),
            ]
            this.tiles = spawnTiles(0,this)
        }

        notCrashed(object1, object2){
            return object1.position.x > object2.position.x + object2.width ||
                object1.position.x + object1.width < object2.position.x ||
                object1.height > object2.position.y + object2.height ||
                object1.height + object1.position.y < object2.height
        }

        draw(ctx){
            [...this.tiles, ...this.keyNotes].forEach(e => e.draw(ctx));
        }

        update(timer){
            [...this.tiles, ...this.keyNotes].forEach(e => e.update())
            if(this.tiles.length <= 0){
                this.tiles = spawnTiles(Math.floor(timer / 10), this)
            }
            this.tiles.forEach((e, index) => {
                if(e.position.y > this.maxHeight){
                    this.tiles.splice(index, 1)
                }
            })

            document.addEventListener('keydown', e => {
                switch (e.keyCode) {
                    case 68:
                        this.tiles.forEach((tile, index) => {
                            if(!this.notCrashed(tile, this.keyNotes[0])){
                                this.score += 10
                                this.tiles.splice(index, 1)
                            }
                        })
                        break;
                    case 70:
                        this.tiles.forEach((tile, index) => {
                            if(!this.notCrashed(tile, this.keyNotes[1])){
                                this.score += 10
                                this.tiles.splice(index, 1)
                            }
                        })
                        break;
                    case 74:
                        this.tiles.forEach((tile, index) => {
                            if(!this.notCrashed(tile, this.keyNotes[2])){
                                this.score += 10
                                this.tiles.splice(index, 1)
                            }
                        })
                        break;
                    case 75:
                        this.tiles.forEach((tile, index) => {
                            if(!this.notCrashed(tile, this.keyNotes[3])){
                                this.score += 10
                                this.tiles.splice(index, 1)
                            }
                        })
                        break;
                
                    default:
                        break;
                }
            })

            this.tiles.forEach((tile, index) => {
                this.keyNotes.forEach((keyNote) => {
                    if(!this.notCrashed(tile, keyNote)){
                        (this.score == 0) ? this.score -= 10 : this.score = 0
                        this.tiles.splice(index, 1)
                    }
                })
            })

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
            ctx.fillStyle = 'blue'
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
            ctx.fillStyle = 'yellow'
            ctx.font = '30px Arial'
            ctx.fillText(this.text, this.positionText.x, this.positionText.y)
        }

        update(){
            
        }
    }


    const game = new Game(canvas.width, canvas.height)
    let countdown = 0
    let timer = 0

    const countDownInterval = setInterval(() => {
        if(countdown == 3){
            clearInterval(countDownInterval)

            document.getElementById('music').play()
            setInterval(() => {
                timer += 1
            }, 1000);


            function animate(){
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                game.update(timer)
                game.draw(ctx)

                ctx.fillStyle = 'black'
                ctx.font = '50px Arial'
                ctx.fillText(timer, 10, 60)

                ctx.beginPath()
                ctx.moveTo(100, 0)
                ctx.lineTo(100, canvas.height)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(200, 0)
                ctx.lineTo(200, canvas.height)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(300, 0)
                ctx.lineTo(300, canvas.height)
                ctx.stroke()
                requestAnimationFrame(animate)
            }
            requestAnimationFrame(animate)
        }else{
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            countdown += 1
            ctx.fillStyle = 'black'
            ctx.font = '50px Arial'
            ctx.fillText(countdown, canvas.width / 2 - 25, canvas.height / 2)
        }
    }, 1000)
}