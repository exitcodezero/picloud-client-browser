function PiCloud(url, apiKey) {
    if (typeof url !== "string") {
        throw new Error("'url' must be a string");
    }
    if (typeof apiKey !== "string") {
        throw new Error("'apiKey' must be a string");
    }

    var _this = this;

    _this._subscriptions = {};

    var socketUrl = url + "?apiKey=" + apiKey;
    var socket = new WebSocket(socketUrl);
    socket.onmessage = function (message) {
        var data = JSON.parse(message.data);
        _this._subscriptions[data.event].forEach(function (subscriptionCallback) {
            subscriptionCallback(data);
        });
    };
    _this._socket = socket;
}

PiCloud.prototype.onReady = function (cb) {
    if (this._socket.readyState === WebSocket.OPEN) {
        cb();
    } else {
        this._socket.onopen = function () {
            cb();
        };
    }
};

PiCloud.prototype.publish = function (e, data) {
    if (typeof e !== "string") {
        throw new Error("'e' must be a string");
    }
    if (typeof data !== "string") {
        throw new Error("'data' must be a string");
    }
    var message = {
        "action": "publish",
        "event": e,
        "data": data
    };
    this._socket.send(JSON.stringify(message));
};

PiCloud.prototype.subscribe = function (e, cb) {
    if (typeof e !== "string") {
        throw new Error("'e' must be a string");
    }
    if (typeof cb !== "function") {
        throw new Error("'cb' must be a function");
    }
    if (e in this._subscriptions) {
        this._subscriptions[e].push(cb);
    } else {
        this._subscriptions[e] = [cb];
    }
    var jsonMessage = JSON.stringify({
        "action": "subscribe",
        "event": e
    });
    this._socket.send(jsonMessage);
};
