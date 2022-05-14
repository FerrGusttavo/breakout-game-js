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

    // inicializa o motor de física arcade do Phaser
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // adiciona o sprite da bola no game
    ball = game.add.sprite(50, 50, 'ball');

    // adiciona nossa bola para o sistema de física
    game.physics.enable(ball, Phaser.Physics.ARCADE);

    // ajusta a velocidade da bola
    ball.body.velocity.set(150, 150);
}

// é executado em cada quadro.
function update() {}