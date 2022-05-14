var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload: preload, create: create, update: update
});

var ball;

var paddle;

// cuida de pré-carregar os ativos
function preload() {

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';

    // carrega o sprite da bola
    game.load.image('ball', 'img/ball.png');

    // carrega o sprite da raquete
    game.load.image('paddle', 'img/paddle.png');
}

// é executado uma vez quando tudo está carregado e pronto
function create() {

    // inicializa o motor de física arcade do Phaser
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // adiciona o sprite da bola no game
    ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');

    // adiciona o spirte da raquete no game
    paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');

    // centraliza a bola no centro

    ball.anchor.set(0.5);

    // centraliza a raquete no centro
    paddle.anchor.set(0.5,1);

    // adiciona nossa bola ao sistema de física
    game.physics.enable(ball, Phaser.Physics.ARCADE);

    // adiciona nossa raquete ao sistema de física
    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    // habilita colisão com os limites de tela estabelecidos
    ball.body.collideWorldBounds = true;

    // faz a bola quicar quando colidir com a parede
    ball.body.bounce.set(1);

    // ajusta a velocidade da bola
    ball.body.velocity.set(150, -150);

    // deixa a raquete fixada durante a colisão
    paddle.body.immovable = true;
}

// é executado em cada quadro.
function update() {

    // adiciona colisão da raquete com a bola
    game.physics.arcade.collide(ball, paddle);
    
    // adiciona a função de movimento e ponto inicial na raquete
    paddle.x = game.input.x || game.world.width*0.5;
}