
from easyAI import Human_Player, AI_Player, Negamax
from flask import Flask, render_template, request, session, jsonify
from flask_session import Session
from tictactoe import TicTacToe

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
diff = "easy"
ai_algo = Negamax(1)
ai_move = ""
ttt = TicTacToe([Human_Player(), AI_Player(ai_algo)])


def value(x):
    val = {
        0: "_",
        1: "X",
        2: "O"
    }
    return val.get(x)


@app.route('/', methods=["GET"])
def index():
    if not session.get("board"):
        session['board'] = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ttt.board = session["board"]
    if ttt.is_over():
        msg = ttt.winner()
    else:
        msg = ""
    return render_template('index.html', ttt=ttt, msg=msg, difficulty=diff)


@app.route('/move', methods=['POST'])
def move():
    global ai_move
    choice = request.form['choice']
    if 'choice' in request.form:
        ttt.play_move(choice)
        if not ttt.is_over():
            ai_move = ttt.get_move()
            ttt.play_move(ai_move)
        if ttt.is_over():
            if ttt.winner() == "Player Wins" or ttt.winner() == "Tie":
                ttt.play_move(ai_move)
            msg = ttt.winner()
        else:
            msg = ""
    session["board"] = ttt.board
    tttBoard = list(map(value, ttt.board))
    return jsonify(message=msg, tttBoard=tttBoard)


@app.route('/reset', methods=['POST'])
def reset():

    if 'reset' in request.form:
        ttt.board = [0 for i in range(9)]
        session['board'] = ttt.board
    tttBoard = list(map(value, ttt.board))
    return jsonify(tttBoard=tttBoard)


@app.route('/difficulty', methods=['POST'])
def difficulty():
    global ai_algo, ttt, diff
    diff = request.form.get('difficulty')
    if diff == "easy":
        ai_algo = Negamax(1)
        ttt = TicTacToe([Human_Player(), AI_Player(ai_algo)])
    elif diff == "medium":
        ai_algo = Negamax(4)
        ttt = TicTacToe([Human_Player(), AI_Player(ai_algo)])
    elif diff == "hard":
        ai_algo = Negamax(6)
        ttt = TicTacToe([Human_Player(), AI_Player(ai_algo)])
    ttt.board = [0 for i in range(9)]
    session['board'] = ttt.board
    tttBoard = list(map(value, ttt.board))
    return jsonify(difficulty=diff, tttBoard=tttBoard)


if __name__ == "__main__":
    app.run(debug=True)
