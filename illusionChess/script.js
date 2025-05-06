"use strict";

var selectedsquare = null;
var difficultysettings = {
    easy: { skill: 1 },
    inter: { skill: 2 },
    hard: { skill: 3 }
};

var game = new Chess();
var board = Chessboard("chessboard", {
    draggable: false,
    position: "start",
    onSnapEnd: function onSnapEnd() {
        return board.position(game.fen());
    }
});

var mode = "ai";
$("#mode button").on("click", function () {
    mode = this.id; 
    $("#mode button").removeClass("selected");
    $(this).addClass("selected");
    resetgame();
});

$("#difficulty button").on("click", function () {
    var diffId = this.id; 
    if (difficultysettings[diffId]) {
        $("#difficulty button").removeClass("selected");
        $(this).addClass("selected");
        resetgame();
    }
});

function resetgame() {
    game.reset();
    board.position("start");
    removegreysquares();
    selectedsquare = null;

    setTimeout(function () {
        document.getElementById("title").textContent = "IllusionChess";
    }, 10000);
}

var whitesquaregrey = "#a9a9a9";
var blacksquaregrey = "#696969";

function removegreysquares() {
    $("#chessboard .square-55d63").css("outline", "").css("outline-offset", "");
}

function greysquare(sq) {
    var s = $("#chessboard .square-" + sq);
    s.css({
        outline: "5px dashed black",
        "outline-offset": "-5px"
    });
}

var pawnevalwhite = [[0, 0, 0, 0, 0, 0, 0, 0], [5, 5, 5, 5, 5, 5, 5, 5], [1, 1, 2, 3, 3, 2, 1, 1], [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5], [0, 0, 0, 2, 2, 0, 0, 0], [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5], [0.5, 1, 1, -2, -2, 1, 1, 0.5], [0, 0, 0, 0, 0, 0, 0, 0]];
var pawnevalblack = pawnevalwhite.slice().reverse();
var knighteval = [[-5, -4, -3, -3, -3, -3, -4, -5], [-4, -2, 0, 0, 0, 0, -2, -4], [-3, 0, 1, 1.5, 1.5, 1, 0, -3], [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3], [-3, 0, 1.5, 2, 2, 1.5, 0, -3], [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3], [-4, -2, 0, 0.5, 0.5, 0, -2, -4], [-5, -4, -3, -3, -3, -3, -4, -5]];
var bishopevalwhite = [[-2, -1, -1, -1, -1, -1, -1, -2], [-1, 0, 0, 0, 0, 0, 0, -1], [-1, 0, 0.5, 1, 1, 0.5, 0, -1], [-1, 0.5, 0.5, 1, 1, 0.5, 0.5, -1], [-1, 0, 1, 1, 1, 1, 0, -1], [-1, 1, 1, 1, 1, 1, 1, -1], [-1, 0.5, 0, 0, 0, 0, 0.5, -1], [-2, -1, -1, -1, -1, -1, -1, -2]];
var bishopevalblack = bishopevalwhite.slice().reverse();
var rookevalwhite = [[0, 0, 0, 0, 0, 0, 0, 0], [0.5, 1, 1, 1, 1, 1, 1, 0.5], [-0.5, 0, 0, 0, 0, 0, 0, -0.5], [-0.5, 0, 0, 0, 0, 0, 0, -0.5], [-0.5, 0, 0, 0, 0, 0, 0, -0.5], [-0.5, 0, 0, 0, 0, 0, 0, -0.5], [-0.5, 0, 0, 0, 0, 0, 0, -0.5], [0, 0, 0, 0.5, 0.5, 0, 0, 0]];
var rookevalblack = rookevalwhite.slice().reverse();
var evalqueen = [[-2, -1, -1, -0.5, -0.5, -1, -1, -2], [-1, 0, 0, 0, 0, 0, 0, -1], [-1, 0, 0.5, 0.5, 0.5, 0.5, 0, -1], [-0.5, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5], [0, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5], [-1, 0.5, 0.5, 0.5, 0.5, 0.5, 0, -1], [-1, 0, 0.5, 0, 0, 0, 0, -1], [-2, -1, -1, -0.5, -0.5, -1, -1, -2]];
var kingevalwhite = [[-3, -4, -4, -5, -5, -4, -4, -3], [-3, -4, -4, -5, -5, -4, -4, -3], [-3, -4, -4, -5, -5, -4, -4, -3], [-3, -4, -4, -5, -5, -4, -4, -3], [-2, -3, -3, -4, -4, -3, -3, -2], [-1, -2, -2, -2, -2, -2, -2, -1], [2, 2, 0, 0, 0, 0, 2, 2], [2, 3, 1, 0, 0, 1, 3, 2]];
var kingevalblack = kingevalwhite.slice().reverse();

function getpiecevalue(p, x, y) {
    if (!p) return 0;
    var w = p.color === "w";
    var b = void 0;
    switch (p.type) {
        case "p":
            b = 10 + (w ? pawnevalwhite[y][x] : pawnevalblack[y][x]);break;
        case "n":
            b = 30 + knighteval[y][x];break;
        case "b":
            b = 30 + (w ? bishopevalwhite[y][x] : bishopevalblack[y][x]);break;
        case "r":
            b = 50 + (w ? rookevalwhite[y][x] : rookevalblack[y][x]);break;
        case "q":
            b = 90 + evalqueen[y][x];break;
        case "k":
            b = 900 + (w ? kingevalwhite[y][x] : kingevalblack[y][x]);break;
        default:
            return 0;
    }
    return w ? b : -b;
}

var positioncount = 0;

function minimaxroot(d, g, max) {
    var m = g.moves({ verbose: true });
    var bv = -Infinity,
        bm = null;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = m[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var mm = _step.value;

            g.move(mm);
            var v = minimax(d - 1, g, -1e4, 1e4, !max);
            g.undo();
            if (v > bv) {
                bv = v;
                bm = mm;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return bm;
}

function minimax(d, g, a, b, max) {
    positioncount++;
    if (d === 0) return -evaluateboard(g.board());
    var m = g.moves({ verbose: true });
    if (max) {
        var best = -Infinity;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = m[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var mm = _step2.value;

                g.move(mm);
                best = Math.max(best, minimax(d - 1, g, a, b, false));
                g.undo();
                a = Math.max(a, best);
                if (b <= a) break;
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return best;
    } else {
        var _best = Infinity;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = m[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _mm = _step3.value;

                g.move(_mm);
                _best = Math.min(_best, minimax(d - 1, g, a, b, true));
                g.undo();
                b = Math.min(b, _best);
                if (b <= a) break;
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        return _best;
    }
}

function evaluateboard(bd) {
    var t = 0;
    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
            t += getpiecevalue(bd[y][x], x, y);
        }
    }return t;
}

$("#chessboard").on("click", ".square-55d63", function () {
    var sq = $(this).attr("data-square");
    var pc = game.get(sq);
    var tc = game.turn();
    var ip = pc && pc.color === tc;
    var lm = game.moves({ square: sq, verbose: true });
    if (!selectedsquare) {
        if (!ip || lm.length === 0) return;
        selectedsquare = sq;
        removegreysquares();
        greysquare(sq);
        lm.forEach(function (m) {
            return greysquare(m.to);
        });
        return;
    }
    if (selectedsquare === sq) {
        removegreysquares();
        selectedsquare = null;
        return;
    }
    if (ip) {
        if (lm.length === 0) {
            removegreysquares();
            selectedsquare = null;
            return;
        }
        selectedsquare = sq;
        removegreysquares();
        greysquare(sq);
        lm.forEach(function (m) {
            return greysquare(m.to);
        });
        return;
    }
    var mv = game.move({ from: selectedsquare, to: sq, promotion: "q" });
    removegreysquares();
    if (!mv) {
        greysquare(selectedsquare);
        game.moves({ square: selectedsquare, verbose: true }).forEach(function (m) {
            return greysquare(m.to);
        });
        return;
    }
    board.position(game.fen());
    selectedsquare = null;
    handlegameover();
    if (mode === "ai" && !game.game_over()) {
        setTimeout(function () {
            var difficultyId = $("#difficulty .selected").attr("id") || "easy";
            var depth = difficultysettings[difficultyId].skill;
            var bm = minimaxroot(depth, game, true);
            game.move(bm);
            board.position(game.fen());
            handlegameover();
        }, 250);
    }
});

$("#chessboard").parent().on("click", function (e) {
    if (!$(e.target).closest(".square-55d63").length) {
        removegreysquares();
        selectedsquare = null;
    }
});

function handlegameover() {
    if (!game.game_over()) return;
    var winner = game.in_checkmate() ? (game.turn() === "w" ? "Black" : "White") + " Wins!" : "Draw!";
    document.getElementById("title").textContent = winner;

    resetgame();
}

$("#reset").on("click", resetgame);
