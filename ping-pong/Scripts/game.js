var initialDirection = false;
var firstPlayer = 0;
var secondPlayer = 0;
var singlePlayer = $("#gameMode").text();
var multyPlayer = false;
var WIDTH = 700, HEIGHT = 600, pi = Math.PI;
var UpArrow = 38, DownArrow = 40;
var canvas, ctx, keystate;
var player, ai, ball;
var ballSound = document.getElementById("ballAudio");
var winSound = document.getElementById("winAudio");
var failAlpha = -1;
var start = false;
var rendering = true;


player = {
    x: null,
    y: null,
    width: 20,
    height: 100,

    update: function () {
        
        if (keystate[87])
            if (this.y >= 0)
                this.y -= 7;

        if (keystate[83])
            if(this.y <= HEIGHT-100)
                this.y += 7;
    },
    render: function () {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

if (singlePlayer == "False") {
    $("#first").text(prompt("Please enter your name", "Player"));
    $("#second").text("Computer");
    ai = {

        x: null,
        y: null,
        width: 20,
        height: 100,

        update: function () {
            var desty = ball.y - (this.height - ball.side) * 0.5;
            var newDesty = this.y + (desty - this.y) * 0.1;
            if (newDesty >= 0 && newDesty <= HEIGHT - 100)
                this.y = newDesty;
        },
        render: function () {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    } else {
        $("#first").text(prompt("Please enter your name", "Player 1"));
        $("#second").text(prompt("Please enter your name", "Player 2"));
        ai = {
            x: null,
            y: null,
            width: 20,
            height: 100,

            update: function () {

                if (keystate[UpArrow])
                    if (this.y >= 0)
                        this.y -= 7;

                if (keystate[DownArrow])
                    if (this.y <= HEIGHT - 100)
                        this.y += 7;
            },
            render: function () {
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        };
    }


ball = {
    x: null,
    y: null,
    side: 20,
    val: null,
    speed: 10,
    update: function () {
        if (rendering == true) {
            this.x += this.vel.x;
            this.y += this.vel.y;

            if (0 > this.y || this.y + this.side > HEIGHT) {
                var offset = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y + this.side);
                this.y += 2 * offset;
                this.vel.y *= -1;
                ballSound.play();
            }

            var BoundBoxIntersectionp = function (ax, ay, aw, ah, bx, by, bw, bh) {
                return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
            }

            var col = this.vel.x < 0 ? player : ai;
            if (BoundBoxIntersectionp(col.x, col.y, col.width, col.height,
                this.x, this.y, this.side, this.side)) {
                this.x = col === player ? player.x + player.width : ai.x - this.side;
                var n = (this.y + this.side - col.y) / (col.height + this.side);
                var phi = 0.25 * pi * (2 * n - 1);
                var smash = Math.abs(phi) > 0.2 * pi ? 1.5 : 1;
                this.vel.x = smash * (col === player ? 1 : -1) * this.speed * Math.cos(phi);
                this.vel.y = smash * this.speed * Math.sin(phi);
                ballSound.play();
            }

            if (0 > this.x + this.side || this.x > WIDTH) {
                if (this.x + this.side < 0){
                    if (singlePlayer == "True")
                        winSound.play();
                    secondPlayer++;
                    failAnimation.player = false;
                    
                }
                else
                {
                    winSound.play();
                    firstPlayer++;
                    failAnimation.player = true;
                }
                start = true;
                failAlpha = 0;
                document.getElementById("first-player").textContent = firstPlayer.toString();
                document.getElementById("second-player").textContent = secondPlayer.toString();
                
                initialDirection = !initialDirection;
                if (initialDirection == false) {
                    ball.x = (WIDTH - ball.side) / 2;
                    ball.y = (HEIGHT - ball.side) / 2;
                    ball.vel = {
                        y: 0,
                        x: ball.speed
                    }
                } else {
                   
                    ball.x = (WIDTH - ball.side) / 2;
                    ball.y = (HEIGHT - ball.side) / 2;
                    ball.vel = {
                        y: 0,
                        x: -ball.speed
                    }
                }
            }
        }
       
    },
    render: function () {
        if (rendering == true) {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(this.x, this.y, this.side, this.side);
        }
    }
};

failAnimation = {
    running: null,
    player : null,
    render: function () {
        if(this.player == true)
            var grd = ctx.createLinearGradient(WIDTH / 2, 0, WIDTH, 0);
        else
            var grd = ctx.createLinearGradient(WIDTH/2, 0, 0, 0);
        if (failAlpha >= 0 && start == true) {
            rendering = false;
            failAlpha += 0.5;
            grd.addColorStop(0, "white");
            grd.addColorStop(1, "rgba(255,0,0," + failAlpha / 100 + ")");
            ctx.fillStyle = grd;
            if(this.player == true)
                ctx.fillRect(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
            if(this.player == false)
                ctx.fillRect(0, 0, WIDTH / 2, HEIGHT);
            failAlpha++;
            if (failAlpha >= 50) {
                start = false
                failAlpha += 50;
            }

        } else if (failAlpha >= 0) {
            failAlpha--;
            grd.addColorStop(0, "white");
            grd.addColorStop(1, "rgba(255,0,0," + failAlpha / 100 + ")");
            ctx.fillStyle = grd;
            if (this.player == true)
                ctx.fillRect(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
            if(this.player == false)
                ctx.fillRect(0, 0, WIDTH / 2, HEIGHT);
            if (failAlpha == 0) {
                rendering = true;
            }
                
        }

    }
};


function main() {
    canvas = document.getElementById("gameCanvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    $("#game-score").addClass("game-status");
    console.log(singlePlayer);
   
    keystate = {};
    document.addEventListener("keydown", function (evt) {
        keystate[evt.keyCode] = true;
    });


    document.addEventListener("keyup", function (evt) {
        delete keystate[evt.keyCode];
    });

    init();

    var gameLive = function () {
        update();
        render();
        window.requestAnimationFrame(gameLive, canvas);
    }
    window.requestAnimationFrame(gameLive, canvas);
}

function init() {
    player.x = player.width;
    player.y = (HEIGHT - player.height) / 2;


    ai.x = WIDTH - (player.width + ai.width);
    ai.y = (HEIGHT - ai.height) / 2



    ball.x = (WIDTH - ball.side) / 2;
    ball.y = (HEIGHT - ball.side) / 2;

    ball.vel = {
        y: 0,
        x: ball.speed
    }

}

function update() {
    ball.update();
    player.update();
    ai.update();
}

function render() {
    ctx.fillStyle = "#fff";
    
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.save();
    failAnimation.render();
    ball.render();
    ctx.fillStyle = "#000000";
    player.render();
    ai.render();


    var w = 4;
    var x = (WIDTH - w) * 0.5;
    var y = 0;
    var step = HEIGHT / 15;
    while (y < HEIGHT) {
        ctx.fillRect(x, y + step * 0.25, w, step * 0.5);
        y += step;
    }
   
    

    ctx.restore();
}
main();