var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload: preload, create: create, update: update
});

var ball;

// cuida de pré-carregar os ativos
function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';

    // carrega o sprite da bola
    game.load.image('ball', 'img/ball.png');
}

// é executado uma vez quando tudo está carregado e pronto
function create() {

    // adiciona o sprite da bola no game
    ball = game.add.sprite(50, 50, 'ball');
}

// é executado em cada quadro.
function update() {

    // move a bola
    ball.x += 1;
    ball.y += 1;
}