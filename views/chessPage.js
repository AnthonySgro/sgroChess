const html = require("html-template-tag");

module.exports = chessPage = () => {
    const htmlExport = html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Play Game</title>
        <link rel="stylesheet" href="../stylesheets/gamepage.css">
        <link href="https://fonts.googleapis.com/css?family=Poppins:500" rel="stylesheet">
        <script defer src='../scripts/chess.js'></script>

    </head>
    <body>
        <div id="chess-app">
            <div id="chessboard-container">
                <div id="chessboard-backdrop">
                    <div class="row" id="row-8">
                        <div class="chess-tile" id="a8">
                            <img id="a8-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="b8">
                            <img id="b8-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="c8">
                            <img id="c8-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="d8">
                            <img id="d8-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="e8">
                            <img id="e8-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="f8">
                            <img id="f8-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="g8">
                            <img id="g8-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="h8">
                            <img id="h8-img" src="../images/placeholder.png">
                        </div>
                    </div>
                    <div class="row" id="row-7">
                        <div class="chess-tile" id="a7">
                            <img id="a7-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="b7">
                            <img id="b7-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="c7">
                            <img id="c7-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="d7">
                            <img id="d7-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="e7">
                            <img id="e7-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="f7">
                            <img id="f7-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="g7">
                            <img id="g7-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="h7">
                            <img id="h7-img" src="../images/placeholder.png">
                        </div>
                    </div>
                    <div class="row" id="row-6">
                        <div class="chess-tile" id="a6">
                            <img id="a6-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="b6">
                            <img id="b6-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="c6">
                            <img id="c6-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="d6">
                            <img id="d6-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="e6">
                            <img id="e6-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="f6">
                            <img id="f6-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="g6">
                            <img id="g6-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="h6">
                            <img id="h6-img" src="../images/placeholder.png">
                        </div>
    
                    </div>
                    <div class="row" id="row-5">
                        <div class="chess-tile" id="a5">
                            <img id="a5-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="b5">
                            <img id="b5-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="c5">
                            <img id="c5-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="d5">
                            <img id="d5-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="e5">
                            <img id="e5-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="f5">
                            <img id="f5-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="g5">
                            <img id="g5-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="h5">
                            <img id="h5-img" src="../images/placeholder.png">
                        </div>
                    </div>
                    <div class="row" id="row-4">
                        <div class="chess-tile" id="a4">
                            <img id="a4-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="b4">
                            <img id="b4-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="c4">
                            <img id="c4-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="d4">
                            <img id="d4-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="e4">
                            <img id="e4-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="f4">
                            <img id="f4-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="g4">
                            <img id="g4-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="h4">
                            <img id="h4-img" src="../images/placeholder.png">
                        </div>
                    </div>
                    <div class="row" id="row-3">
                        <div class="chess-tile" id="a3">
                            <img id="a3-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="b3">
                            <img id="b3-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="c3">
                            <img id="c3-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="d3">
                            <img id="d3-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="e3">
                            <img id="e3-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="f3">
                            <img id="f3-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="g3">
                            <img id="g3-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="h3">
                            <img id="h3-img" src="../images/placeholder.png">
                        </div>
                    </div>
                    <div class="row" id="row-2">
                        <div class="chess-tile" id="a2">
                            <img id="a2-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="b2">
                            <img id="b2-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="c2">
                            <img id="c2-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="d2">
                            <img id="d2-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="e2">
                            <img id="e2-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="f2">
                            <img id="f2-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="g2">
                            <img id="g2-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="h2">
                            <img id="h2-img" src="../images/placeholder.png">
                        </div>
                    </div>
                    <div class="row" id="row-1">
                        <div class="chess-tile" id="a1">
                            <img id="a1-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="b1">
                            <img id="b1-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="c1">
                            <img id="c1-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="d1">
                            <img id="d1-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="e1">
                            <img id="e1-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="f1">
                            <img id="f1-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="g1">
                            <img id="g1-img" src="../images/placeholder.png">
                        </div>
                        <div class="chess-tile" id="h1">
                            <img id="h1-img" src="../images/placeholder.png">
                        </div>
                    </div>
                </div>
                <div id="user-interface">
                    <button class="greenbtn" id="init-game">Setup Pieces</button>
                    <div id="phase-information">Selecting Phase</div>
                    <div id="turn-information">White's Turn</div>
                    <button class="redbtn" id="back">&lt;</button>
                    <button class="redbtn" id="forward">&gt;</button>
                    <div id="user-feedback"></div>
                </div>
            </div>
    
        </div>
    </body>
    </html>
`

return htmlExport;
}