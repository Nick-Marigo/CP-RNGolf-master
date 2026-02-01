class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X_MIN = 100
        this.SHOT_VELOCITY_X_MAX = 400
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true);
        
        // I added this because I noticed that the cup would shift slightly sometimes when it was hit by the ball and doing some research into it looks like there is some bug in the arcade physics when its two circles colliding. I know it wasn't a big deal but it was bugging me
        this.cup.setPushable(false)

        // add ball
        this.ball = this.physics.add.sprite(width /2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width /2))
        wallA.body.setImmovable(true)

        this.wallB = this.physics.add.sprite(width / 2, height / 2, 'wall')
        this.wallB.setImmovable(true)
        this.wallB.setVelocityX(100)


        this.walls = this.add.group([wallA, this.wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width /2, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            this.shotCounter += 1
            this.shotText.setText('Shots: ' + this.shotCounter)
            this.shotPercentage = (this.score / this.shotCounter) * 100
            this.shotPercentageText.setText('Shot Percentage %' + this.shotPercentage.toFixed(1))
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X_MIN, this.SHOT_VELOCITY_X_MAX) * shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.score += 1
            this.scoreText.setText('Score: ' + this.score)
            this.shotPercentage = (this.score / this.shotCounter) * 100
            this.shotPercentageText.setText('Shot Percentage %' + this.shotPercentage.toFixed(1))
            this.ball.setVelocity(0)
            this.ball.setX(width /2)
            this.ball.setY(height - height / 10)
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

        // shot counter/score/shot percentage
        let textConfig = {
            fontFamily: 'Garamond',
            fontSize: '32px',
            backgroundColor: '#0000FF',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        this.shotCounter = 0
        this.shotText = this.add.text(width / 2.7, height / 1.07 , 'Shots: ' + this.shotCounter, textConfig).setOrigin(0.5, 0)

        this.score = 0
        this.scoreText = this.add.text(width / 25, height / 1.07 , 'Score: ' + this.score, textConfig)

        this.shotPercentage = 100
        this.shotPercentageText = this.add.text(width / 1.9, height / 1.07 , 'Shot Percentage %' + this.shotPercentage, textConfig)
    }

    update() {
        if(this.wallB.x <= this.wallB.width /2){
            this.wallB.setVelocityX(100)
        }
        else if(this.wallB.x >= width - this.wallB.width /2 ){
            this.wallB.setVelocityX(-100)
        }
        
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[Done] Add ball reset logic on successful shot
[Done] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[Done] Make one obstacle move left/right and bounce against screen edges
[Done] Create and display shot counter, score, and successful shot percentage
*/