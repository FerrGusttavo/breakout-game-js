var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload: preload, create: create, update: update
});

// variável global da bola
var ball;

// variável global da raquete
var paddle;

// variáveis globais dos tijolos
var bricks;
var newBrick;
var brickInfo;

// variável global da pontuação
var scoreText;
var score = 0;

// variáveis globais das vidas do jogador

var lives = 3;
var livesText;
var lifeLostText;

// variáveis globais de botões
var playing = false;
var startButton;

// cuida de pré-carregar os ativos
function preload() {

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';

    // carrega sprite da bola
    game.load.image('ball', 'img/ball.png');
    game.load.spritesheet('ball', 'img/wobble.png', 20, 20);

    // carrega sprite da raquete
    game.load.image('paddle', 'img/paddle.png');

    // carrega sprite do tijolo
    game.load.image('brick', 'img/brick.png');

    // carrega sprite do botão start
    game.load.spritesheet('button', 'img/button.png', 120, 40);
}

// é executado uma vez quando tudo está carregado e pronto
function create() {

    // inicializa o motor de física arcade do Phaser
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // desativa a colisão com a parede abaixo da raquete = GAME OVER
    game.physics.arcade.checkCollision.down = false;

    // adiciona o sprite da bola no game
    ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
    ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);

    // centraliza a bola no centro
    ball.anchor.set(0.5);

    // adiciona nossa bola ao sistema de física
    game.physics.enable(ball, Phaser.Physics.ARCADE);

    // habilita colisão com os limites de tela estabelecidos
    ball.body.collideWorldBounds = true;

    // faz a bola quicar quando colidir com a parede
    ball.body.bounce.set(1);

    // verifica o limite da borda e executa função vinculada ao evento
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);

    
    // adiciona o spirte da raquete no game
    paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');

    // centraliza a raquete no centro
    paddle.anchor.set(0.5,1);

    // adiciona nossa raquete ao sistema de física
    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    // deixa a raquete fixada durante a colisão
    paddle.body.immovable = true;

    initBricks();

    // estilo global para textos
    textStyle = { font: '18px Arial', fill: '#0095DD'};

    // adiciona e configura o texto da pontuação
    scoreText = game.add.text(5, 5, 'Pontos: 0', textStyle);

    // adiciona e configura o texto de quantidade de vidas
    livesText = game.add.text(game.world.width-5, 5, 'Vidas: '+lives, textStyle);
    livesText.anchor.set(1,0);

    // adiciona e configura o texto de perda de vida
    lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'Você perdeu 1 vida, clique para continuar ', textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;

    // adiciona o sprite de start na tela chamando a função startGame()
    startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
    startButton.anchor.set(0.5);
}
// é executado em cada quadro.
function update() {

    // adiciona colisão da raquete com a bola
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);

    // verifica a colisão entre bola e tijolos
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    
    // adiciona a função de movimento e ponto inicial na raquete
    if(playing) {
        paddle.x = game.input.x || game.world.width*0.5;
    }
}

// função para imprimir cada tijolo na sua posição correta
function initBricks() {
    brickInfo = {
        width: 50,
        height: 20,
        count: {
            row: 3,
            col: 7
        },
        offset: {
            top: 50,
            left: 60
        },
        padding: 10
    }
    bricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++) {
        for(r=0; r<brickInfo.count.row; r++) {
            var brickX = (c*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (r*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}

// função que será executada quando a bola bate no tijolo
function ballHitBrick(ball, brick) {
    var killTween = game.add.tween(brick.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        brick.kill();
    }, this);
    killTween.start();
    score += 10;
    scoreText.setText('Pontos: '+score);
    if(score === brickInfo.count.row*brickInfo.count.col*10) {
        alert('Você ganhou o jogo. Parabéns!');
        location.reload();
    }
}

// função ligada ao evento de perder vidas
function ballLeaveScreen() {
    lives--;
    if(lives) {
        livesText.setText('Vidas: '+lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width*0.5, game.world.height-25);
        paddle.reset(game.world.width*0.5, game.world.height-5);
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            ball.body.velocity.set(150, -150);
        }, this);
    }
    else {
        alert('Você perdeu. Game over!');
        location.reload();
    }
}

// função de animação da bola com a raquete
function ballHitPaddle(ball, paddle) {
    ball.animations.play('wobble');
    ball.body.velocity.x = -1*5*(paddle.x-ball.x);
}

// função de começar jogo
function startGame() {
    startButton.destroy();
    ball.body.velocity.set(150, -150);
    playing = true;
}