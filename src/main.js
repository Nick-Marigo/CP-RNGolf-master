// Code Practice: RNGolf
// Name: Nick Marigo
// Date: 1/30/2026

'use strict'

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ Play ]
}

let game = new Phaser.Game(config)

let { width, height } = game.config