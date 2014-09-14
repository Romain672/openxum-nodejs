"use strict";

Kamisado.RemotePlayer = function (color, e, u, o, g) {

// public methods
    this.color = function () {
        return mycolor;
    };

    this.confirm = function () {
        return false;
    };

    this.finish = function() {
        var msg = {
            type: 'finish',
            user_id: uid
        };
        connection.send(JSON.stringify(msg));
    };

    this.is_ready = function () {
        return true;
    };

    this.is_remote = function () {
        return true;
    };

    this.set_manager = function (m) {
        manager = m;
    };

    this.move_tower = function (from, to) {
        if (from && to) {
            var msg = {
                type: 'turn',
                user_id: uid,
                move: 'move_tower',
                from: from,
                to: to
            };
            connection.send(JSON.stringify(msg));
        }
    };

// private methods
    var init = function () {
        connection = new WebSocket('ws://127.0.0.1:3000');

        connection.onopen = function () {

        };
        connection.onerror = function (error) {

        };
        connection.onmessage = function (message) {
            var msg = JSON.parse(message.data);

            if (msg.type === 'turn') {
                var ok = false;
                var turn;

                if (msg.move === 'move_tower' && engine.phase() === Kamisado.Phase.MOVE_TOWER) {
                    turn = { from: msg.from, to: msg.to };
                    ok = true;
                }
                if (ok) {
                    manager.play_remote(turn);
                }
            }
        };

        var loop = setInterval(function () {
            if (connection.readyState !== 1) {
                console.log('error connection');
            } else {
                console.log('connecting ' + uid + ' ...');

                var msg = {
                    type: 'play',
                    user_id: uid,
                    opponent_id: opponent_id,
                    game_id: game_id,
                    game_type: 'kamisado'
                };

                connection.send(JSON.stringify(msg));
                clearInterval(loop);
            }
        }, 1000);
    };

    var parse_message = function (message) {
    };

// private attributes
    var mycolor = color;
    var engine = e;
    var uid = u;
    var game_id = g;
    var opponent_id = o;
    var manager;
    var connection;

    init();
};