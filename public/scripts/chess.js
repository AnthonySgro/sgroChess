class Piece {
    constructor(color, chessTile, chessboard) {
        this.white = color;
        if (color === true) {
            this.color = 'white';
        } else {
            this.color = 'black';
        }
        this.hasMoved = false;
        this.currentChessTile = chessTile;
        this.currentChessTile.piece = this;
        this.validMoves = [];
        this.chessboard = chessboard;
    }

    //moves!
    movePiece(chessTile) {
        let enpassantHappened = false;

        //eliminate enPassant vulnerabilities
        if (this.color === 'white') {
            chessboard.whitePieces.forEach(piece => {
                if (piece instanceof Pawn) {
                    //all your pawns besides this exact one
                    //are now invulnerable to enPassant
                    if (this !== piece) {
                        piece.vulnerableToEnPassant = false;
                    }
                }
            });
        } else {
            chessboard.blackPieces.forEach(piece => {
                if (piece instanceof Pawn) {
                    if (this !== piece) {
                        piece.vulnerableToEnPassant = false;
                    }
                }
            });
        }

        //check for an enPassant move execution and new vulnerabilities
        if (this instanceof Pawn) {
            if (this.color === 'white') {
        
                //check for white enPassant Vulnerability
                if (this.currentChessTile.numCoord[1] === 1 && chessTile.numCoord[1] === 3) {
                    this.vulnerableToEnPassant = true;
                    this.moveTwoAvailable = false;
                } else {
                    this.vulnerableToEnPassant = false;
                }
        
                //checks if doing en-passant for white
                if (chessTile.numCoord[1] - 1 === this.currentChessTile.numCoord[1]) {
                    if (chessTile.numCoord[0] - 1 === this.currentChessTile.numCoord[0] || chessTile.numCoord[0] + 1 === this.currentChessTile.numCoord[0]) {
                        if (chessTile.piecePresent === false) {
                            chessTile.adjacentTile('down').piece.hidePiece();
                            chessboard.whitePieces.splice(chessboard.whitePieces.indexOf(chessTile.adjacentTile('down').piece), 1);
                            chessTile.adjacentTile('down').piece = null;
                            chessTile.adjacentTile('down').piecePresent = false;
                            enpassantHappened = true;
                            chessboard.updatePieces();
                        }
                    }
                }
            } else {
        
                //check for black enPassant Vulnerability
                if (this.currentChessTile.numCoord[1] === 6 && chessTile.numCoord[1] === 4) {
                    this.vulnerableToEnPassant = true;
                    this.moveTwoAvailable = false;
                } else {
                    this.vulnerableToEnPassant = false;
                }
        
                //checks if doing en-passant for black
                if (chessTile.numCoord[1] + 1 === this.currentChessTile.numCoord[1]) {
                            if (chessTile.numCoord[0] - 1 === this.currentChessTile.numCoord[0] || chessTile.numCoord[0] + 1 === this.currentChessTile.numCoord[0]) {
                                if (chessTile.piecePresent === false) {
                                    chessTile.adjacentTile('up').piece.hidePiece();
                                    chessboard.blackPieces.splice(chessboard.whitePieces.indexOf(chessTile.adjacentTile('up').piece), 1);
                                    chessTile.adjacentTile('up').piece = null;
                                    chessTile.adjacentTile('up').piecePresent = false;
                                    chessboard.updatePieces();
                                    enpassantHappened = true;
                                }
                            }
                }
            }
        }

        //analagous to picking up piece (resets the square it used to be on)
        this.hidePiece();

        //check for castling
        if (this instanceof King) {
            if (this.shortCastlingAvailable === true) {
                //if short castle
                if (this.currentChessTile.adjacentTile('right').adjacentTile('right') == chessTile) {
                    //moves kingside rook to correct location
                    this.currentChessTile.adjacentTile('right').adjacentTile('right').adjacentTile('right').piece.movePiece(this.currentChessTile.adjacentTile('right'));
                } else if (this.longCastlingAvailable === true) {
                    //long castle
                    if (this.currentChessTile.adjacentTile('left').adjacentTile('left') == chessTile) {
                        //moves queenside rook to correct location
                        this.currentChessTile.adjacentTile('left').adjacentTile('left').adjacentTile('left').adjacentTile('left').piece.movePiece(this.currentChessTile.adjacentTile('left'));
                    }
                }
            }
        }

        //check for pawn on last rank
        if (this instanceof Pawn) {
            //if on last rank
            if (chessTile.numCoord[1] === 0 || chessTile.numCoord[1] === 7) {
                this.queened = true;
                let queenedPawn = new Queen(this.white, chessTile, chessboard);

                if (this.white === true) {
                    chessboard.whitePieces.push(queenedPawn);
                    //chessboard.whitePieces.splice(chessboard.whitePieces.indexOf(this), 1);
                    chessboard.removePiece(this);
                } else {
                    chessboard.blackPieces.push(queenedPawn);
                    //chessboard.removePiece(this);
                    //chessboard.whitePieces.splice(chessboard.blackPieces.indexOf(this), 1);
                }

                queenedPawn.currentChessTile.piece = queenedPawn;
                queenedPawn.currentChessTile.piecePresent = true;
                queenedPawn.validMoves = [];
                queenedPawn.displayPiece();
                queenedPawn.hasMoved = true;
                playMoveSound();
                return;
            }
        }

        //check if piece is on the square you are moving it to
        //***ALSO MANAGES SOUND*** (one other sound item for pawn promotion elsewhere)
        if (chessTile.piecePresent) {

            //if yes, remove
            chessboard.removePiece(chessTile.piece);
            playCaptureSound();
        } else if (enpassantHappened === true) {
            playCaptureSound();
        } else {
            playMoveSound();
        }

        //--PIECE HAS NOW MOVED--//
        this.currentChessTile = chessTile;
        this.currentChessTile.piece = this;
        this.currentChessTile.piecePresent = true;
        this.displayPiece();
        this.hasMoved = true;

        //king loses castling rights if it moved
        if (this instanceof King) {
            this.shortCastlingAvailable = false;
            this.longCastlingAvailable = false;
        }

        //recalculates validMoves from new position
        this.validMoves = [];
        this.updateAttackingSquares();

        //refigures every piece's available moves now
        chessboard.findAllMoves();

        //checks if opposing king is in check now
        let opposingKing;
        if (this.color === 'white') {
            chessboard.blackPieces.forEach(piece => {
                if (piece.name === 'King') {
                    opposingKing = piece;
                }
            });
            if (chessboard.whiteControlledTiles.includes(opposingKing.currentChessTile)) {
                opposingKing.inCheck = true;
            } else {
                opposingKing.inCheck = false;
            }
        } else {
            chessboard.whitePieces.forEach(piece => {
                if (piece.name === 'King') {
                    opposingKing = piece;
                }
            });
            if (chessboard.blackControlledTiles.includes(opposingKing.currentChessTile)) {
                opposingKing.inCheck = true;
            } else {
                opposingKing.inCheck = false;
            }
        }
    }

    displayPiece() {
        document.getElementById(`${this.currentChessTile.name}-img`).src = this.imageFile;
        this.currentChessTile.updateImg();
    }

    hidePiece() {
        document.getElementById(`${piece.currentChessTile.name}-img`).src =  'images/placeholder.png';
        this.currentChessTile.piece = null;
        this.currentChessTile.piecePresent = false;
    }

    removePiece() {
        this.chessboard.removePiece(this);
    }
}

class Pawn extends Piece {
    constructor(color, chessTile) {
        super(color, chessTile)
        this.imageFile = `../images/${this.color}-pawn.png`;
        this.moveTwoAvailable = true;
        this.queened = false;
        this.justMovedTwo = false;
        this.vulnerableToEnPassant = false;
        this.justPerformedEnPassant = false;
        this.name = 'Pawn';
        this.attackingSquares = [];
    }

    //finds all valid chess tiles to move to, returns array.
    findValidMoves() {

        //if white pawn else black pawn
        if (this.color === 'white') {

            //move forward one
            if (this.currentChessTile.adjacentTile('up') !== undefined) {
                let up = this.currentChessTile.adjacentTile('up');
                if (up.piecePresent === false) {
                    this.validMoves.push(this.currentChessTile.adjacentTile('up'));
    
                    //move forward two rule
                    if (this.moveTwoAvailable && !up.adjacentTile('up').piecePresent) {
                        this.validMoves.push(this.currentChessTile.adjacentTile('up').adjacentTile('up'));
                    }
                }
            }


            let upLeft;
            let upRight;
            let left = this.currentChessTile.adjacentTile('left');
            let right = this.currentChessTile.adjacentTile('right');
            //take opponent's piece if diagonal up
            if (this.currentChessTile.adjacentTile('up-left') !== undefined) {
                upLeft = this.currentChessTile.adjacentTile('up-left');
                if (upLeft.piecePresent === true && upLeft.color !== this.color) {
                    this.validMoves.push(upLeft);

                //adds capture if enpassant available
                } else if (left !== undefined) {
                    if (left.piece instanceof Pawn) {
                        if (left.piece.color !== this.color && left.piece.vulnerableToEnPassant === true) {
                            this.validMoves.push(upLeft);
                        }
                    }
                }
            }

            if (this.currentChessTile.adjacentTile('up-right') !== undefined) {
                upRight = this.currentChessTile.adjacentTile('up-right');
                if (upRight.piecePresent === true && upRight.color != this.color) {
                    this.validMoves.push(upRight);

                //adds capture if enpassant available
                } else if (right !== undefined) {
                    if (right.piece instanceof Pawn) {
                        if (right.piece.color !== this.color && right.piece.vulnerableToEnPassant === true) {
                            this.validMoves.push(upRight);
                        }
                    }
                }
            }

        //if black pawn
        } else {

            //move down one
            if (this.currentChessTile.adjacentTile('down') !== undefined) {
                let down = this.currentChessTile.adjacentTile('down');
                if (down.piecePresent === false) {
                    this.validMoves.push(this.currentChessTile.adjacentTile('down'));
                    
                    if (this.moveTwoAvailable && !down.adjacentTile('down').piecePresent) {
                        this.validMoves.push(this.currentChessTile.adjacentTile('down').adjacentTile('down'));
                    }
                }    
            }

            let downLeft;
            let downRight;
            let left = this.currentChessTile.adjacentTile('left');
            let right = this.currentChessTile.adjacentTile('right');

            //take opponent's piece if diagonal down
            if (this.currentChessTile.adjacentTile('down-left') !== undefined) {
                downLeft = this.currentChessTile.adjacentTile('down-left');
                if (downLeft.piecePresent === true && downLeft.color != this.color) {
                    this.validMoves.push(downLeft);
                } else if (left !== undefined) {
                    if (left.piece instanceof Pawn) {
                        if (left.piece.color !== this.color && left.piece.vulnerableToEnPassant === true) {
                            this.validMoves.push(downLeft);
                        }
                    }
                }
            }
            if (this.currentChessTile.adjacentTile('down-right') !== undefined) {
                downRight = this.currentChessTile.adjacentTile('down-right');
                if (downRight.piecePresent === true && downRight.color != this.color) {
                    this.validMoves.push(downRight);
                } else if (right !== undefined) {
                    if (right.piece instanceof Pawn) {
                        if (right.piece.color !== this.color && right.piece.vulnerableToEnPassant === true) {
                            this.validMoves.push(downRight);
                        }
                    }
                } 
            }
        }

        //gets rid of same color pieces
        let arr = [];
        this.validMoves.filter(element => {

            //if empty square, good
            if (element.piece === null) {
                arr.push(element);
            
            //if opponent piece, good
            } else if (element.piece.color !== this.color) {
                arr.push(element);
            }
        });


        this.validMoves = arr.filter((tile, index) => {
            return arr.indexOf(tile) === index;
        });

        this.updateAttackingSquares();

        return this.validMoves;
    }

    updateAttackingSquares() {
        this.attackingSquares = [];
        let rightUp = this.currentChessTile.adjacentTile('up-right');
        let leftUp = this.currentChessTile.adjacentTile('up-left');
        let downRight = this.currentChessTile.adjacentTile('down-right');
        let downLeft = this.currentChessTile.adjacentTile('down-left');

        if (this.color === 'white') {
            if (leftUp !== undefined) {
                    this.attackingSquares.push(leftUp);
            }
            if (rightUp !== undefined) {
                this.attackingSquares.push(rightUp);
            }
        } else {
            if (downRight !== undefined) {
                this.attackingSquares.push(downRight);
                } 
            if (downLeft !== undefined) {
                    this.attackingSquares.push(downLeft);
                }
            }
    }

    removeIllegalMoves(arr) {
        return arr;
    }
}

class Knight extends Piece {
    constructor(color, chessTile) {
        super(color, chessTile)
        this.imageFile = `../images/${this.color}-knight.png`;
        this.name = 'Knight'
        this.attackingSquares = [];
    }

    findValidMoves() {
        let movesUpRight;
        let movesRightUp;
        let movesRightDown;
        let movesDownRight;
        let movesDownLeft;
        let movesLeftDown;
        let movesLeftUp;
        let movesUpLeft;

        //make sure each square is defined on the board
        if (this.currentChessTile.adjacentTile('up-right') !== undefined) {
            if (this.currentChessTile.adjacentTile('up-right').adjacentTile('up') !== undefined) {
                movesUpRight = this.currentChessTile.adjacentTile('up-right').adjacentTile('up');
            }
            if (this.currentChessTile.adjacentTile('up-right').adjacentTile('right') !== undefined) {
                movesRightUp = this.currentChessTile.adjacentTile('up-right').adjacentTile('right');
            }
        }
        if (this.currentChessTile.adjacentTile('down-right') !== undefined) {
            if (this.currentChessTile.adjacentTile('down-right').adjacentTile('right') !== undefined) {
                movesRightDown = this.currentChessTile.adjacentTile('down-right').adjacentTile('right');
            }
            if (this.currentChessTile.adjacentTile('down-right').adjacentTile('down') !== undefined) {
                movesDownRight = this.currentChessTile.adjacentTile('down-right').adjacentTile('down');
            }
        }
        if (this.currentChessTile.adjacentTile('down-left') !== undefined) {
            if (this.currentChessTile.adjacentTile('down-left').adjacentTile('down') !== undefined) {
                movesDownLeft = this.currentChessTile.adjacentTile('down-left').adjacentTile('down');
            }
            if (this.currentChessTile.adjacentTile('down-left').adjacentTile('left') !== undefined) {
                movesLeftDown = this.currentChessTile.adjacentTile('down-left').adjacentTile('left');
            }
        }
        if (this.currentChessTile.adjacentTile('up-left') !== undefined) {
            if (this.currentChessTile.adjacentTile('up-left').adjacentTile('left') !== undefined) {
                movesLeftUp = this.currentChessTile.adjacentTile('up-left').adjacentTile('left');
            }
            if (this.currentChessTile.adjacentTile('up-left').adjacentTile('up') !== undefined) {
                movesUpLeft = this.currentChessTile.adjacentTile('up-left').adjacentTile('up');
            }
        }

        let arr = [];
        let tempArray = [movesUpRight, movesRightUp, movesRightDown, movesDownRight, movesDownLeft, movesLeftDown, movesLeftUp, movesUpLeft];
        tempArray.filter(element => {
            if (element !== undefined) {
                arr.push(element);
            };
        })

        //we want our attacking squares to include same color
        this.attackingSquares = [];
        arr.forEach(element => {
           this.attackingSquares.push(element);
        })

        //gets rid of same color pieces
        let arr2 = [];
        arr.filter(element => {
            //if empty square, good
            if (element.piece === null) {
                arr2.push(element);

            //if opponent piece, good
            } else if (element.piece.color !== this.color) {
                arr2.push(element);
            }
        });

        this.validMoves = arr2;
        return this.validMoves;
    }

    updateAttackingSquares() {
        this.findValidMoves();
    }
}

class Bishop extends Piece {
    constructor(color, chessTile) {
        super(color, chessTile)
        this.imageFile = `../images/${this.color}-bishop.png`;
        this.name = 'Bishop';
        this.attackingSquares = [];
    }

    findValidMoves() {
        let movesUpRight;
        let movesUpLeft;
        let movesDownRight;
        let movesDownLeft;

        //make sure first square in each direction is defined on the board
        if (this.currentChessTile.adjacentTile('up-right') !== undefined) {
            movesUpRight = [this.currentChessTile.adjacentTile('up-right')];
        }
        if (this.currentChessTile.adjacentTile('up-left') !== undefined) {
            movesUpLeft = [this.currentChessTile.adjacentTile('up-left')];
        }
        if (this.currentChessTile.adjacentTile('down-right') !== undefined) {
            movesDownRight = [this.currentChessTile.adjacentTile('down-right')];
        }
        if (this.currentChessTile.adjacentTile('down-left') !== undefined) {
            movesDownLeft = [this.currentChessTile.adjacentTile('down-left')];
        }

        //fill in all squares in each direction until end of board
        let i = 0;
        if (this.currentChessTile.adjacentTile('up-right') !== undefined) {
            while (movesUpRight[i] !== undefined) {
                movesUpRight.push(movesUpRight[i].adjacentTile('up-right'));
                i++;
            }
            movesUpRight = movesUpRight.filter(element => {
                return element !== undefined;
            })
        } else {
            movesUpRight = [];
        }
        
        i = 0;
        if (this.currentChessTile.adjacentTile('up-left') !== undefined) {
            while (movesUpLeft[i] !== undefined) {
                movesUpLeft.push(movesUpLeft[i].adjacentTile('up-left'));
                i++
            }
            movesUpLeft = movesUpLeft.filter(element => {
                return element !== undefined;
            })
        } else {
            movesUpLeft = [];
        }


        i = 0;
        if (this.currentChessTile.adjacentTile('down-right') !== undefined) {
            while (movesDownRight[i] !== undefined) {
                movesDownRight.push(movesDownRight[i].adjacentTile('down-right'));
                i++
            }
            movesDownRight = movesDownRight.filter(element => {
                return element !== undefined;
            })
        } else {
            movesDownRight = [];
        }

        i = 0;
        if (this.currentChessTile.adjacentTile('down-left') !== undefined) {
            while (movesDownLeft[i] !== undefined) {
                movesDownLeft.push(movesDownLeft[i].adjacentTile('down-left'));
                i++
            }
            movesDownLeft = movesDownLeft.filter(element => {
                return element !== undefined;
            })
        } else {
            movesDownLeft = [];
        }

        //filter out squares after a piece can be taken
        let stop = false;
        let movesUpRightPass = [];
        i = 0
        if (movesUpRight.length !== 0) {
            while (stop === false) {
                if (movesUpRight[i].piecePresent === true && movesUpRight[i].color != this.color) {
                    stop = true;
                }
                movesUpRightPass.push(movesUpRight[i]);
                i++;
                if (movesUpRight[i] === undefined) {
                    stop = true;
                }
            }
        }

        stop = false;
        let movesUpLeftPass = [];
        i = 0
        if (movesUpLeft.length !== 0) {
            while (stop === false) {
                if (movesUpLeft[i].piecePresent === true && movesUpLeft[i].color != this.color) {
                    stop = true;
                }
                movesUpLeftPass.push(movesUpLeft[i]);
                i++;
                if (movesUpLeft[i] === undefined) {
                    stop = true;
                }
            }
        }
        
        stop = false;
        let movesDownRightPass = [];
        i = 0
        if (movesDownRight.length !== 0) {
            while (stop === false) {
                if (movesDownRight[i].piecePresent === true && movesDownRight[i].color != this.color) {
                    stop = true;
                }
                movesDownRightPass.push(movesDownRight[i]);
                i++;
                if (movesDownRight[i] === undefined) {
                    stop = true;
                }
            }
        }

        stop = false;
        let movesDownLeftPass = [];
        i = 0
        if (movesDownLeft.length !== 0) {
            while (stop === false) {
                if (movesDownLeft[i].piecePresent === true && movesDownLeft[i].color != this.color) {
                    stop = true;
                }
                movesDownLeftPass.push(movesDownLeft[i]);
                i++;
                if (movesDownLeft[i] === undefined) {
                    stop = true;
                }
            }
        }



        let tempArray = [];
        this.validMoves = tempArray.concat(movesUpRightPass, movesUpLeftPass, movesDownRightPass, movesDownLeftPass);
        
        //get controlling squares
        tempArray = [];
        this.attackingSquares = [];
        this.attackingSquares = tempArray.concat(movesUpRightPass, movesUpLeftPass, movesDownRightPass, movesDownLeftPass);

        //gets rid of same color pieces
        let arr = [];
        this.validMoves.filter(element => {

            //if empty square, good
            if (element.piece === null) {
                arr.push(element);
            
            //if opponent piece, good
            } else if (element.piece.color !== this.color) {
                arr.push(element);
            }
        });

        this.validMoves = arr;
        return this.validMoves;

    }

    updateAttackingSquares() {
        this.findValidMoves();
    }
}

class Rook extends Piece {
    constructor(color, chessTile) {
        super(color, chessTile)
        this.imageFile = `../images/${this.color}-rook.png`;
        this.name = 'Rook';
        this.attackingSquares = [];
    }

    findValidMoves() {

        let movesUp;
        let movesLeft;
        let movesDown;
        let movesRight;

        //make sure first square in each direction is defined on the board
        if (this.currentChessTile.adjacentTile('up') !== undefined) {
            movesUp = [this.currentChessTile.adjacentTile('up')];
        }
        if (this.currentChessTile.adjacentTile('left') !== undefined) {
            movesLeft = [this.currentChessTile.adjacentTile('left')];
        }
        if (this.currentChessTile.adjacentTile('down') !== undefined) {
            movesDown = [this.currentChessTile.adjacentTile('down')];
        }
        if (this.currentChessTile.adjacentTile('right') !== undefined) {
            movesRight = [this.currentChessTile.adjacentTile('right')];
        }

        //fill in all squares in each direction until end of board
        let i = 0;
        if (this.currentChessTile.adjacentTile('up') !== undefined) {
            while (movesUp[i] !== undefined) {
                movesUp.push(movesUp[i].adjacentTile('up'));
                i++;
            }
            movesUp = movesUp.filter(element => {
                return element !== undefined;
            })
        } else {
            movesUp = [];
        }
        
        i = 0;
        if (this.currentChessTile.adjacentTile('left') !== undefined) {
            while (movesLeft[i] !== undefined) {
                movesLeft.push(movesLeft[i].adjacentTile('left'));
                i++
            }
            movesLeft = movesLeft.filter(element => {
                return element !== undefined;
            })
        } else {
            movesLeft = [];
        }


        i = 0;
        if (this.currentChessTile.adjacentTile('down') !== undefined) {
            while (movesDown[i] !== undefined) {
                movesDown.push(movesDown[i].adjacentTile('down'));
                i++
            }
            movesDown = movesDown.filter(element => {
                return element !== undefined;
            })
        } else {
            movesDown = [];
        }

        i = 0;
        if (this.currentChessTile.adjacentTile('right') !== undefined) {
            while (movesRight[i] !== undefined) {
                movesRight.push(movesRight[i].adjacentTile('right'));
                i++
            }
            movesRight = movesRight.filter(element => {
                return element !== undefined;
            })
        } else {
            movesRight = [];
        }

        //filter out squares after a piece can be taken
        let stop = false;
        let movesUpPass = [];
        i = 0
        if (movesUp.length !== 0) {
            while (stop === false) {
                if (movesUp[i].piecePresent === true && movesUp[i].color != this.color) {
                    stop = true;
                }
                movesUpPass.push(movesUp[i]);
                i++;
                if (movesUp[i] === undefined) {
                    stop = true;
                }
            }
        }

        stop = false;
        let movesLeftPass = [];
        i = 0
        if (movesLeft.length !== 0) {
            while (stop === false) {
                if (movesLeft[i].piecePresent === true && movesLeft[i].color != this.color) {
                    stop = true;
                }
                movesLeftPass.push(movesLeft[i]);
                i++;
                if (movesLeft[i] === undefined) {
                    stop = true;
                }
            }
        }
        
        stop = false;
        let movesRightPass = [];
        i = 0
        if (movesRight.length !== 0) {
            while (stop === false) {
                if (movesRight[i].piecePresent === true && movesRight[i].color != this.color) {
                    stop = true;
                }
                movesRightPass.push(movesRight[i]);
                i++;
                if (movesRight[i] === undefined) {
                    stop = true;
                }
            }
        }

        stop = false;
        let movesDownPass = [];
        i = 0
        if (movesDown.length !== 0) {
            while (stop === false) {
                if (movesDown[i].piecePresent === true && movesDown[i].color != this.color) {
                    stop = true;
                }
                movesDownPass.push(movesDown[i]);
                i++;
                if (movesDown[i] === undefined) {
                    stop = true;
                }
            }
        }
        let tempArray = [];
        this.validMoves = tempArray.concat(movesUpPass, movesLeftPass, movesDownPass, movesRightPass);
        tempArray = [];
        this.attackingSquares = [];
        this.attackingSquares = tempArray.concat(movesUpPass, movesLeftPass, movesDownPass, movesRightPass);
        
        //gets rid of same color pieces
        let arr = [];
        this.validMoves.filter(element => {

            //if empty square, good
            if (element.piece === null) {
                arr.push(element);
            
            //if opponent piece, good
            } else if (element.piece.color !== this.color) {
                arr.push(element);
            }
        });

        this.validMoves = arr;
        return this.validMoves;
    }

    updateAttackingSquares() {
        this.findValidMoves();
    }
}

class Queen extends Piece {
    constructor(color, chessTile) {
        super(color, chessTile)
        this.imageFile = `../images/${this.color}-queen.png`;
        this.name = 'Queen';
        this.attackingSquares = [];
    }

    findValidMoves() {
        let movesUp;
        let movesLeft;
        let movesDown;
        let movesRight;
        let movesUpRight;
        let movesUpLeft;
        let movesDownRight;
        let movesDownLeft;

        //make sure first square in each direction is defined on the board
        if (this.currentChessTile.adjacentTile('up') !== undefined) {
            movesUp = [this.currentChessTile.adjacentTile('up')];
        }
        if (this.currentChessTile.adjacentTile('left') !== undefined) {
            movesLeft = [this.currentChessTile.adjacentTile('left')];
        }
        if (this.currentChessTile.adjacentTile('down') !== undefined) {
            movesDown = [this.currentChessTile.adjacentTile('down')];
        }
        if (this.currentChessTile.adjacentTile('right') !== undefined) {
            movesRight = [this.currentChessTile.adjacentTile('right')];
        }
        if (this.currentChessTile.adjacentTile('up-right') !== undefined) {
            movesUpRight = [this.currentChessTile.adjacentTile('up-right')];
        }
        if (this.currentChessTile.adjacentTile('up-left') !== undefined) {
            movesUpLeft = [this.currentChessTile.adjacentTile('up-left')];
        }
        if (this.currentChessTile.adjacentTile('down-right') !== undefined) {
            movesDownRight = [this.currentChessTile.adjacentTile('down-right')];
        }
        if (this.currentChessTile.adjacentTile('down-left') !== undefined) {
            movesDownLeft = [this.currentChessTile.adjacentTile('down-left')];
        }

        //fill in all squares in each direction until end of board
        let i = 0;
        if (this.currentChessTile.adjacentTile('up') !== undefined) {
            while (movesUp[i] !== undefined) {
                movesUp.push(movesUp[i].adjacentTile('up'));
                i++;
            }
            movesUp = movesUp.filter(element => {
                return element !== undefined;
            })
        } else {
            movesUp = [];
        }
        
        i = 0;
        if (this.currentChessTile.adjacentTile('left') !== undefined) {
            while (movesLeft[i] !== undefined) {
                movesLeft.push(movesLeft[i].adjacentTile('left'));
                i++
            }
            movesLeft = movesLeft.filter(element => {
                return element !== undefined;
            })
        } else {
            movesLeft = [];
        }

        i = 0;
        if (this.currentChessTile.adjacentTile('down') !== undefined) {
            while (movesDown[i] !== undefined) {
                movesDown.push(movesDown[i].adjacentTile('down'));
                i++
            }
            movesDown = movesDown.filter(element => {
                return element !== undefined;
            })
        } else {
            movesDown = [];
        }

        i = 0;
        if (this.currentChessTile.adjacentTile('right') !== undefined) {
            while (movesRight[i] !== undefined) {
                movesRight.push(movesRight[i].adjacentTile('right'));
                i++
            }
            movesRight = movesRight.filter(element => {
                return element !== undefined;
            })
        } else {
            movesRight = [];
        }

        i = 0;
        if (this.currentChessTile.adjacentTile('up-right') !== undefined) {
            while (movesUpRight[i] !== undefined) {
                movesUpRight.push(movesUpRight[i].adjacentTile('up-right'));
                i++;
            }
            movesUpRight = movesUpRight.filter(element => {
                return element !== undefined;
            })
        } else {
            movesUpRight = [];
        }
        
        i = 0;
        if (this.currentChessTile.adjacentTile('up-left') !== undefined) {
            while (movesUpLeft[i] !== undefined) {
                movesUpLeft.push(movesUpLeft[i].adjacentTile('up-left'));
                i++
            }
            movesUpLeft = movesUpLeft.filter(element => {
                return element !== undefined;
            })
        } else {
            movesUpLeft = [];
        }


        i = 0;
        if (this.currentChessTile.adjacentTile('down-right') !== undefined) {
            while (movesDownRight[i] !== undefined) {
                movesDownRight.push(movesDownRight[i].adjacentTile('down-right'));
                i++
            }
            movesDownRight = movesDownRight.filter(element => {
                return element !== undefined;
            })
        } else {
            movesDownRight = [];
        }

        i = 0;
        if (this.currentChessTile.adjacentTile('down-left') !== undefined) {
            while (movesDownLeft[i] !== undefined) {
                movesDownLeft.push(movesDownLeft[i].adjacentTile('down-left'));
                i++
            }
            movesDownLeft = movesDownLeft.filter(element => {
                return element !== undefined;
            })
        } else {
            movesDownLeft = [];
        }

        //filter out squares after a piece can be taken
        let stop = false;
        let movesUpPass = [];
        i = 0
        if (movesUp.length !== 0) {
            while (stop === false) {
                if (movesUp[i].piecePresent === true && movesUp[i].color != this.color) {
                    stop = true;
                }
                movesUpPass.push(movesUp[i]);
                i++;
                if (movesUp[i] === undefined) {
                    stop = true;
                }
            }
        }

        stop = false;
        let movesLeftPass = [];
        i = 0
        if (movesLeft.length !== 0) {
            while (stop === false) {
                if (movesLeft[i].piecePresent === true && movesLeft[i].color != this.color) {
                    stop = true;
                }
                movesLeftPass.push(movesLeft[i]);
                i++;
                if (movesLeft[i] === undefined) {
                    stop = true;
                }
            }
        }
        
        stop = false;
        let movesRightPass = [];
        i = 0
        if (movesRight.length !== 0) {
            while (stop === false) {
                if (movesRight[i].piecePresent === true && movesRight[i].color != this.color) {
                    stop = true;
                }
                movesRightPass.push(movesRight[i]);
                i++;
                if (movesRight[i] === undefined) {
                    stop = true;
                }
            }
        }

        stop = false;
        let movesDownPass = [];
        i = 0
        if (movesDown.length !== 0) {
            while (stop === false) {
                if (movesDown[i].piecePresent === true && movesDown[i].color != this.color) {
                    stop = true;
                }
                movesDownPass.push(movesDown[i]);
                i++;
                if (movesDown[i] === undefined) {
                    stop = true;
                }
            }
        }

        stop = false;
        let movesUpRightPass = [];
        i = 0
        if (movesUpRight.length !== 0) {
            while (stop === false) {
                if (movesUpRight[i].piecePresent === true && movesUpRight[i].color != this.color) {
                    stop = true;
                }
                movesUpRightPass.push(movesUpRight[i]);
                i++;
                if (movesUpRight[i] === undefined) {
                    stop = true;
                }
            }
        }

        stop = false;
        let movesUpLeftPass = [];
        i = 0
        if (movesUpLeft.length !== 0) {
            while (stop === false) {
                if (movesUpLeft[i].piecePresent === true && movesUpLeft[i].color != this.color) {
                    stop = true;
                }
                movesUpLeftPass.push(movesUpLeft[i]);
                i++;
                if (movesUpLeft[i] === undefined) {
                    stop = true;
                }
            }
        }
        
        stop = false;
        let movesDownRightPass = [];
        i = 0
        if (movesDownRight.length !== 0) {
            while (stop === false) {
                if (movesDownRight[i].piecePresent === true && movesDownRight[i].color != this.color) {
                    stop = true;
                }
                movesDownRightPass.push(movesDownRight[i]);
                i++;
                if (movesDownRight[i] === undefined) {
                    stop = true;
                }
            }
        }

        stop = false;
        let movesDownLeftPass = [];
        i = 0
        if (movesDownLeft.length !== 0) {
            while (stop === false) {
                if (movesDownLeft[i].piecePresent === true && movesDownLeft[i].color != this.color) {
                    stop = true;
                }
                movesDownLeftPass.push(movesDownLeft[i]);
                i++;
                if (movesDownLeft[i] === undefined) {
                    stop = true;
                }
            }
        }

        let tempArray = [];
        this.validMoves = tempArray.concat(movesUpPass, movesRightPass, movesDownPass, movesLeftPass, movesUpRightPass, movesUpLeftPass, movesDownRightPass, movesDownLeftPass);
        tempArray = [];
        this.attackingSquares = tempArray.concat(movesUpPass, movesRightPass, movesDownPass, movesLeftPass, movesUpRightPass, movesUpLeftPass, movesDownRightPass, movesDownLeftPass);

        let arr = [];
        this.validMoves.filter(element => {

            //if empty square, good
            if (element.piece === null) {
                arr.push(element);
            
            //if opponent piece, good
            } else if (element.piece.color !== this.color) {
                arr.push(element);
            }
        });

        this.validMoves = arr;
        return this.validMoves;
    }

    updateAttackingSquares() {
        this.findValidMoves();
    }
}

class King extends Piece {
    constructor(color, chessTile) {
        super(color, chessTile)
        this.imageFile = `../images/${this.color}-king.png`;
        this.shortCastlingAvailable = true;
        this.longCastlingAvailable = true;
        this.inCheck = false;
        this.name = 'King';
        this.attackingSquares = [];
    }

    findValidMoves() {

        //normal moves, not castling
        let up = this.currentChessTile.adjacentTile('up');
        let upRight = this.currentChessTile.adjacentTile('up-right');
        let right = this.currentChessTile.adjacentTile('right');
        let downRight = this.currentChessTile.adjacentTile('down-right');
        let down = this.currentChessTile.adjacentTile('down');
        let downLeft = this.currentChessTile.adjacentTile('down-left');
        let left = this.currentChessTile.adjacentTile('left');
        let upLeft = this.currentChessTile.adjacentTile('up-left');
        
        let avail = [up, upRight, right, downRight, down, downLeft, left, upLeft];

        avail = avail.filter(element => {
            return element !== undefined
        });

        //get attacking squares
        this.attackingSquares = [];
        this.attackingSquares = avail;

        for (let i = 0; i < avail.length; i++) {
            if (avail[i].piecePresent === false || (avail[i].piecePresent === true && avail[i].color != this.color)) {
                this.validMoves.push(avail[i]);
            }
        }

        let arr = [];
        this.validMoves.filter(element => {

            //if empty square, good
            if (element.piece === null) {
                arr.push(element);
            
            //if opponent piece, good
            } else if (element.piece.color !== this.color) {
                arr.push(element);
            }
        });
        
        //allows castling 
        //if king hasn't moved
        if (this.hasMoved === false) {
            //short castling
            //if rook is there
            if (this.currentChessTile.adjacentTile('right').adjacentTile('right').adjacentTile('right').piece !== null) {
                //and rook hasn't moved
                if (this.currentChessTile.adjacentTile('right').adjacentTile('right').adjacentTile('right').piece.hasMoved === false) {
                    //and no pieces are in the way
                    if (this.currentChessTile.adjacentTile('right').piecePresent === false && this.currentChessTile.adjacentTile('right').adjacentTile('right').piecePresent === false) {
                        arr.push(this.currentChessTile.adjacentTile('right').adjacentTile('right'));
                        this.shortCastlingAvailable = true;
                    }
                }
            }

            //long castling
            if (this.currentChessTile.adjacentTile('left').adjacentTile('left').adjacentTile('left').adjacentTile('left').piece !== null) {
                if (this.currentChessTile.adjacentTile('left').adjacentTile('left').adjacentTile('left').adjacentTile('left').piece.hasMoved === false) {
                    if (this.currentChessTile.adjacentTile('left').piecePresent === false && this.currentChessTile.adjacentTile('left').adjacentTile('left').piecePresent === false && this.currentChessTile.adjacentTile('left').adjacentTile('left').adjacentTile('left').piecePresent === false) {
                        arr.push(this.currentChessTile.adjacentTile('left').adjacentTile('left'));
                        this.longCastlingAvailable = true;
                    }
                }
            }         
        }
    
        this.validMoves = arr.filter((tile, index) => {
             return arr.indexOf(tile) === index;
        });

        //remove moves that go into check
        if (this.color === 'white') {
            this.validMoves = this.validMoves.filter(move => {
                if (!chessboard.blackControlledTiles.includes(move)) {
                    return move;
                }
            });
        } else {
            this.validMoves = this.validMoves.filter(move => {
                if (!chessboard.whiteControlledTiles.includes(move)) {
                    return move;
                }
            });
        }
        
        return this.validMoves;
    }

    updateAttackingSquares() {
        this.findValidMoves();
    }
}

class chessTile {
    constructor(name, color, chessboard) {
        //chess properties
        this.name = name;
        this.white = color;
        this.column = name[0];
        this.row = name[1];

        //a1 = (a,1)
        this.chessCoord = [(this.column), parseInt(this.row)];

        //a1 = (0,0)
        this.numCoord = [this.column.charCodeAt(0) - 97, parseInt(this.row) - 1];

        //points to html element
        this.htmlElement = document.getElementById(this.chessCoord[0]+this.chessCoord[1]);

        //points to image source
        this.image = document.getElementById(`${this.name}-img`).src;
        //this.image === 'file:///Users/anthony/programming/sgroChess/public/images/placeholder.png'        

        //piece specific properties
        this.piece = null;
        this.controlledBySelectedPiece = false;
        this.attackingSquares = [];
        if (this.piece === null) {
            this.piecePresent = false;
        } else {
            this.piecePresent = true;
        }

        //self referential property to easily get chessboard
        this.chessboard = chessboard;
        }
        
    updateImg() {
        //this.htmlElement = document.getElementById(this.chessCoord[0]+this.chessCoord[1]);

        //updates this.image and this.piecePresent to check if a piece is here, displays piece too
        this.image = document.getElementById(`${this.name}-img`).src;
        if (this.image === 'file:///Users/anthony/programming/sgroChess/public/images/placeholder.png') {
            this.piecePresent = false;
        } else {
            this.piecePresent = true;
        }
    }

    //takes 'up','down','up-right','right','down-right','down-left','left','up-left' as possible inputs
    //returns the tile adjacent in the direction you asked
    adjacentTile(str) {
        //returns up or down tile
        if (str === 'up') {
            return chessboard.board[this.numCoord[0]][this.numCoord[1] + 1];
        } else if (str === 'down') {
            return chessboard.board[this.numCoord[0]][this.numCoord[1] - 1];
        }
    
        //checks to make sure row to right exists first
        if (chessboard.board[this.numCoord[0] + 1] !== undefined) {
            if (str === 'up-right') {
                return chessboard.board[this.numCoord[0] + 1][this.numCoord[1] + 1];
            } else if (str === 'right') {
                return chessboard.board[this.numCoord[0] + 1][this.numCoord[1]];
            } else if (str === 'down-right') {
                return chessboard.board[this.numCoord[0] + 1][this.numCoord[1] - 1];
            }
        }
    
        //checks to make sure row to left exists first
        if (chessboard.board[this.numCoord[0] - 1] !== undefined) {
            if (str === 'down-left') {
                return chessboard.board[this.numCoord[0] - 1][this.numCoord[1] - 1];
            } else if (str === 'left') {
                return chessboard.board[this.numCoord[0] - 1][this.numCoord[1]];
            } else if (str === 'up-left') {
                return chessboard.board[this.numCoord[0] - 1][this.numCoord[1] + 1];
            }    
        }
    }
} 

class Chessboard {
    constructor() {
        //all tiles
        this.board = [];

        //piece groups
        this.whitePieces = [];
        this.blackPieces = [];
        this.pieces = [];

        //tiles each side is attacking at least once
        this.whiteControlledTiles = [];
        this.blackControlledTiles = [];
    }

    generateBoard() {
        let color = false;
            //generate 64 chessTile objects and push them to Chessboard.board multi dim array
            for (let i = 0; i < 8; i++) {
                let boardRow = [];
                let tileNameGen = [];
                //j starts at 1 because our naming starts from 1 (ex. a1, b2... h8)
                for (let j = 1; j <= 8; j++) {
                    //generates chess coordinate system as object name 
                    let letterCol = String.fromCharCode(97 + i);
                    let chessTileName = letterCol + j;

                    //uses that variable name to create chessTile
                    tileNameGen.push(chessTileName);
                    tileNameGen[0] = new chessTile(chessTileName, color, this);

                    //put it in our current board row
                    boardRow.push(tileNameGen[0]);
                    tileNameGen.pop()

                    //alternates color every chessTile
                    color = !color;
                }
                //alternates starting tile color of each row... like a chess board
                color = !color;

                //push rows into board, this.board is a multiDim array
                this.board.push(boardRow);
            }
            
            /* this.board = [
            [a1, b1, c1, d1, e1, f1, g1, h1],
            [a2, b2, c2, d2, e2, f2, g2, h2],
            [a3, b3, c3, d3, e3, f3, g3, h3],
            [a4, b4, c4, d4, e4, f4, g4, h4],
            [a5, b5, c5, d5, e5, f5, g5, h5],
            [a6, b6, c6, d6, e6, f6, g6, h6],
            [a7, b7, c7, d7, e7, f7, g7, h7],
            [a8, b8, c8, d8, e8, f8, g8, h8],
            ] */
    }

    updatePieces() {
        this.pieces = [];
        this.pieces = this.pieces.concat(this.whitePieces, this.blackPieces);
    }

    removePiece(piece) {
        document.getElementById(`${piece.currentChessTile.name}-img`).src =  'images/placeholder.png';
        piece.currentChessTile.piecePresent = false;
        piece.currentChessTile = null;

        piece.validMoves = [];
        if (piece.color === 'white') {
            this.whitePieces.splice(this.whitePieces.indexOf(piece), 1);
        } else {
            this.blackPieces.splice(this.blackPieces.indexOf(piece), 1);
        }
        piece = null;
        this.updatePieces();
    }

    findAllMoves() {
        this.whiteControlledTiles = [];
        this.blackControlledTiles = [];

        chessboard.whitePieces.forEach(piece => {
            piece.validMoves = [];

            if (piece instanceof Pawn) {
                piece.findValidMoves();
            }
            piece.updateAttackingSquares()
            this.whiteControlledTiles.push(piece.attackingSquares);
        });

        chessboard.blackPieces.forEach(piece => {
            piece.validMoves = [];

            if (piece instanceof Pawn) {
                piece.findValidMoves();
            }
            piece.updateAttackingSquares()
            this.blackControlledTiles.push(piece.attackingSquares);
        });

        //flatten arrays and get unique values
        this.whiteControlledTiles = Array.from(new Set(this.whiteControlledTiles.flat()));
        this.blackControlledTiles = Array.from(new Set(this.blackControlledTiles.flat()));
    }
}

//converts chess coordinate notation to normal coordinate notation
function convertNotation(str) {
    let letter = str[0];
    let number = str[1];

    letter = (letter.charCodeAt(0) - 97)
    number = parseInt(number) - 1

    return [letter, number];
}

//creates chessboard object, loads chessTile objects and colors tiles on webpage
function initChessboard() {
    let chessboard = new Chessboard
    chessboard.generateBoard();

    //colors the board tiles
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            if (chessboard.board[col][row].white === true) {
                chessboard.board[col][row].htmlElement.style.backgroundColor = "#fffff0";
            } else {
                chessboard.board[col][row].htmlElement.style.backgroundColor = "#118ab2";
            }
        }
    }

    return chessboard;
}

//sets up initial piece positions and updates chessboard.pieces array
function initPieces() {
    //on load
    let whiteRook1 = new Rook(true, chessboard.board[0][0], chessboard);
    let whiteKnight1 = new Knight(true, chessboard.board[1][0], chessboard);
    let whiteBishop1 = new Bishop(true, chessboard.board[2][0], chessboard);
    let whiteQueen1 = new Queen(true, chessboard.board[3][0], chessboard);
    let whiteKing = new King(true, chessboard.board[4][0], chessboard);
    let whiteBishop2 = new Bishop(true, chessboard.board[5][0], chessboard);
    let whiteKnight2 = new Knight(true, chessboard.board[6][0], chessboard);
    let whiteRook2 = new Rook(true, chessboard.board[7][0], chessboard);
    let whitePawn1 = new Pawn(true, chessboard.board[0][1], chessboard);
    let whitePawn2 = new Pawn(true, chessboard.board[1][1], chessboard);
    let whitePawn3 = new Pawn(true, chessboard.board[2][1], chessboard);
    let whitePawn4 = new Pawn(true, chessboard.board[3][1], chessboard);
    let whitePawn5 = new Pawn(true, chessboard.board[4][1], chessboard);
    let whitePawn6 = new Pawn(true, chessboard.board[5][1], chessboard);
    let whitePawn7 = new Pawn(true, chessboard.board[6][1], chessboard);
    let whitePawn8 = new Pawn(true, chessboard.board[7][1], chessboard);

    let blackRook1 = new Rook(false, chessboard.board[0][7], chessboard);
    let blackKnight1 = new Knight(false, chessboard.board[1][7], chessboard);
    let blackBishop1 = new Bishop(false, chessboard.board[2][7], chessboard);
    let blackQueen1 = new Queen(false, chessboard.board[3][7], chessboard);
    let blackKing = new King(false, chessboard.board[4][7], chessboard);
    let blackBishop2 = new Bishop(false, chessboard.board[5][7], chessboard);
    let blackKnight2 = new Knight(false, chessboard.board[6][7], chessboard);
    let blackRook2 = new Rook(false, chessboard.board[7][7], chessboard);
    let blackPawn1 = new Pawn(false, chessboard.board[0][6], chessboard);
    let blackPawn2 = new Pawn(false, chessboard.board[1][6], chessboard);
    let blackPawn3 = new Pawn(false, chessboard.board[2][6], chessboard);
    let blackPawn4 = new Pawn(false, chessboard.board[3][6], chessboard);
    let blackPawn5 = new Pawn(false, chessboard.board[4][6], chessboard);
    let blackPawn6 = new Pawn(false, chessboard.board[5][6], chessboard);
    let blackPawn7 = new Pawn(false, chessboard.board[6][6], chessboard);
    let blackPawn8 = new Pawn(false, chessboard.board[7][6], chessboard);

    chessboard.whitePieces = [whiteRook1, whiteKnight1, whiteBishop1, whiteQueen1, whiteKing, whiteBishop2, whiteKnight2, whiteRook2, whitePawn1, whitePawn2, whitePawn3, whitePawn4, whitePawn5, whitePawn6, whitePawn7, whitePawn8]
    chessboard.blackPieces = [blackRook1, blackKnight1, blackBishop1, blackQueen1, blackKing, blackBishop2, blackKnight2, blackRook2, blackPawn1, blackPawn2, blackPawn3, blackPawn4, blackPawn5, blackPawn6, blackPawn7, blackPawn8]
    chessboard.updatePieces();

    //testing...
    whiteRook1.displayPiece();
    whiteKnight1.displayPiece();
    whiteBishop1.displayPiece();
    whiteQueen1.displayPiece();
    whiteKing.displayPiece();
    whiteBishop2.displayPiece();
    whiteKnight2.displayPiece();
    whiteRook2.displayPiece();
    whitePawn1.displayPiece();
    whitePawn2.displayPiece();
    whitePawn3.displayPiece();
    whitePawn4.displayPiece();
    whitePawn5.displayPiece();
    whitePawn6.displayPiece();
    whitePawn7.displayPiece();
    whitePawn8.displayPiece();
    
    blackRook1.displayPiece();
    blackKnight1.displayPiece();
    blackBishop1.displayPiece();
    blackQueen1.displayPiece();
    blackKing.displayPiece();
    blackBishop2.displayPiece();
    blackKnight2.displayPiece();
    blackRook2.displayPiece();
    blackPawn1.displayPiece();
    blackPawn2.displayPiece();
    blackPawn3.displayPiece();
    blackPawn4.displayPiece();
    blackPawn5.displayPiece();
    blackPawn6.displayPiece();
    blackPawn7.displayPiece();
    blackPawn8.displayPiece();
}

//limited piece set up for manageable debugging
function debugInitPieces() {
    let whiteRook1 = new Rook(true, chessboard.board[0][0], chessboard);
    let whiteKnight1 = new Knight(true, chessboard.board[1][0], chessboard);
    let whiteKing = new King(true, chessboard.board[4][0], chessboard);
    let whitePawn1 = new Pawn(true, chessboard.board[0][1], chessboard);

    let blackKing = new King(false, chessboard.board[4][7], chessboard);
    let blackBishop2 = new Bishop(false, chessboard.board[5][7], chessboard);
    let blackPawn1 = new Pawn(false, chessboard.board[0][6], chessboard);
    let blackPawn2 = new Pawn(false, chessboard.board[1][6], chessboard);

    whiteRook1.displayPiece();
    whiteKnight1.displayPiece();
    whiteKing.displayPiece();
    whitePawn1.displayPiece();
    blackKing.displayPiece();
    blackBishop2.displayPiece();
    blackPawn1.displayPiece();
    blackPawn2.displayPiece();

    chessboard.whitePieces = [whiteRook1, whiteKnight1, whiteKing, whitePawn1];
    chessboard.blackPieces = [blackKing, blackBishop2, blackPawn1, blackPawn2];
    chessboard.updatePieces();

}

//when you click on an eligible piece during your selecting phase
function displayMoves(tile) {
    displayFeedback('Moving Phase:')
    piece = tile.piece;
    piece.findValidMoves();
    highlightAttackedSquares(piece.validMoves);
}

//<--------------------------------------DOM STUFF--------------------------------------------->

//initializing chessgame info
let chessboard;
let selectingPhase = true;
let whiteTurn = true;
let draggingPiece = null;


let enterInitBtn = document.getElementById('init-game');
enterInitBtn.addEventListener('click', function() {
    chessboard = initChessboard();
    initPieces();
});

let chessApp = document.getElementById('chess-app');
chessApp.addEventListener('click', (ev) => {

})

//------------------------------
//dragging events on chessboard
let chessboardDisplay = document.getElementById('chessboard-backdrop');
chessboardDisplay.addEventListener('dragstart', (ev) => {
    let target = ev.target;

    //gets position of click in cartesian plane notation (0,0) start, (7,7) last
    let id = convertNotation(target.id[0] + target.id[1]);

    //grab chessTile we clicked
    let tile = chessboard.board[id[0]][id[1]]

    //if you grabbed a piece...
    if (tile.piecePresent === true) {

        //and it is the correct color
        if (tile.piece.white === whiteTurn) {

            //grab the piece to reference in the 'drop' event
            draggingPiece = tile.piece;
            console.log(draggingPiece);

            //centers the dragged image to mouse
            ev.dataTransfer.setDragImage(target, 30, 30);
            ev.dataTransfer.setData("image/pgn", target.src);

    
            //if it is selecting phase...
            if (selectingPhase === true) {

                //white's turn
                if (whiteTurn === true) {

                    //if we selected a piece and it is the right color...
                    if (tile.piece !== null && chessboard.whitePieces.includes(tile.piece)) {
                    
                        //makes original image a bit opaque and adds filter
                        target.style.opacity = ".5";
                        addFilterDiv(target, '#997d3d');

                        //displays moves with red circle
                        displayMoves(tile);

                        //moves to moving phase
                        selectingPhase = !selectingPhase;
                    } 

                //black's turn
                } else {
                    if (tile.piece !== null && chessboard.blackPieces.includes(tile.piece)) {

                        //makes original image a bit opaque
                        target.style.opacity = ".5";
                        addFilterDiv(target, '#ffd166', true);

                        //displays moves with red circle
                        displayMoves(tile);

                        //moves to moving phase
                        selectingPhase = !selectingPhase;
                    }
                }
            }
        } else {
            selectingPhase = false;
        }
    }
})

chessboardDisplay.addEventListener('drop', (ev) => {

    ev.preventDefault()
    let target = ev.target;
    let id = convertNotation(target.id[0] + target.id[1]);
    let tile = chessboard.board[id[0]][id[1]];

    let successfulMove = false;
    let correctTurn;

    //we can only see if it's the correct turn if we are dragging a piece!
    if (draggingPiece !== null) {
        correctTurn = draggingPiece.white === whiteTurn;
    }
    

    //if moving phase...
    selectingPhase = !selectingPhase;

    //if this was a valid move...
    if (correctTurn && draggingPiece.findValidMoves().includes(tile)) {

        //move piece and change turn!
        draggingPiece.movePiece(chessboard.board[id[0]][id[1]]);
        ev.target.classList.remove('darkened');
        whiteTurn = !whiteTurn;
        displayTurn(whiteTurn);
        successfulMove = true;
    }

    //always remove visual cues even and go to 
    //selecting phase if move didn't execute
    resetBoardStyles()
    displayFeedback('Selecting Phase');
    draggingPiece = null;

    if (successfulMove) {
        //target.style.opacity = ".5";
        //addFilterDiv(target, '#ffd166', false);
    }
})

chessboardDisplay.addEventListener('dragover', (ev) => {

    ev.preventDefault();
    let [...chessTileElementClasses] = ev.target.parentNode.classList;

    //if we drag over a chess tile,
    if (chessTileElementClasses.includes('chess-tile')) {

        //and it is a valid move without a piece on it
        if (chessTileElementClasses.includes('empty-moveable')) {
            ev.target.src = 'images/placeholder.png';
            ev.target.classList.add('darkened');

        //if it is a valid move and it has a piece on it
        } else if (chessTileElementClasses.includes('nonempty-moveable')) {
            ev.target.parentNode.style.borderRadius = "0px";
            ev.target.classList.add('darkened');
        }
    }
})

chessboardDisplay.addEventListener('dragleave', (ev) => {
    ev.preventDefault();
    let [...chessTileElementClasses] = ev.target.parentNode.classList;

    //if we leave a chess tile
    if (chessTileElementClasses.includes('chess-tile')) {
        
        //and it was from a tile we could move to that didn't have a piece on it
        if (chessTileElementClasses.includes('empty-moveable')) {
            ev.target.src = 'images/validMoveDot.png';
            ev.target.classList.remove('darkened');

        //and it was from a tile we could move to that had a piece on it
        } else if (chessTileElementClasses.includes('nonempty-moveable')) {
            ev.target.parentNode.style.borderRadius = "25px";
            ev.target.classList.remove('darkened');
        }
    }  
});
//------------------------------

//clicking event
chessboardDisplay.addEventListener('click', (ev) => {
    let target = ev.target;

    //gets position of click in cartesian plane notation (0,0) start, (7,7) last
    let id = convertNotation(target.id[0] + target.id[1]);

    //grab chessTile we clicked
    let tile = chessboard.board[id[0]][id[1]];


});

//sound
function playMoveSound() {
    let moveSound = new Audio('../sounds/Move.mp3');
    let playMove = moveSound.play();
    if (playMove !== undefined) {
        playMove.then(function() {

        }).catch(function(error) {
            console.log('Failed to load move sound');
        })
    }
}

//sound
function playCaptureSound() {
    let captureSound = new Audio('../sounds/Capture.mp3');
    let playCapture = captureSound.play();
    if (playCapture !== undefined) {
        playCapture.then(function() {

        }).catch(function(error) {
            console.log('Failed to load capture sound');
        })
    }
}

function displayFeedback(str) {
    document.getElementById('phase-information').innerHTML = str;
}

function displayTurn(boolean) {
    if (boolean) {
        document.getElementById('turn-information').innerHTML = "White's Turn";

    } else {
        document.getElementById('turn-information').innerHTML = "Black's Turn";
    }
}

function highlightAttackedSquares(arrOfMoves) {
    arrOfMoves.forEach(validMove => {
        if (validMove.piece === null) {
            document.getElementById(`${validMove.name}-img`).src =  'images/validMoveDot.png';
            document.getElementById(validMove.name).classList.add('empty-moveable');
        } else {
            document.getElementById(validMove.name).style.borderRadius = "25px";
            document.getElementById(validMove.name).classList.add('nonempty-moveable');
        }
        
    })
}

function resetBoardStyles() {

    //de-colors the board tiles
    for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
            if (chessboard.board[col][row].white === true) {
                chessboard.board[col][row].htmlElement.style.backgroundColor = "#fffff0";
            } else {
                chessboard.board[col][row].htmlElement.style.backgroundColor = "#118ab2";
            }

            //resets tileDivs
            let tileDivElement = document.getElementById(chessboard.board[col][row].name);
            tileDivElement.style.borderRadius = "0px";
            tileDivElement.classList.remove('darkened');
            tileDivElement.classList.remove('empty-moveable');
            tileDivElement.classList.remove('nonempty-moveable');

            //if there's a wrapper, get rid of it
            if (tileDivElement.children[0].id === `${tileDivElement.id + '-wrapper'}`) {
                let imgElement = tileDivElement.children[0].children[0];
                tileDivElement.replaceChild(imgElement, tileDivElement.children[0]);
            }

            tileDivElement.children[0].style.opacity = "1";

            

            if (chessboard.board[col][row].piece === null) {
                document.getElementById(`${chessboard.board[col][row].name}-img`).src =  'images/placeholder.png';
            } else {
            }
        }
    }
}

function justMovedHighlight(tile) {
    //console.log(tile.numCoord, tile.row);
}

function addFilterDiv(imgElement, color, bool) {
    let parent = imgElement.parentNode;
    let wrapper = document.createElement('div');
    wrapper.id = `${parent.id + '-wrapper'}`;
    wrapper.classList = parent.classList;
    parent.replaceChild(wrapper, imgElement);
    wrapper.appendChild(imgElement);
    wrapper.style.backgroundColor = `${color}`;
    if (bool) {
        wrapper.style.opacity = '.4';
    }
}