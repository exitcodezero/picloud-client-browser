function PiCloudSocketClient(url, apiKey, clientName) {
    if (typeof url !== "string") {
        throw new Error("'url' must be a string");
    }
    if (typeof apiKey !== "string") {
        throw new Error("'apiKey' must be a string");
    }
    if (typeof clientName !== "string") {
        throw new Error("'clientName' must be a string");
    }

    var _this = this;

    _this._subscriptions = {};

    var subUrl = url + "/subscribe?apiKey=" + apiKey + "&clientName=" + clientName;
    var subSocket = new WebSocket(subUrl);
    subSocket.onmessage = function (message) {
        var data = JSON.parse(message.data);
        _this._subscriptions[data.event].forEach(function (subscriptionCallback) {
            subscriptionCallback(data);
        });
    };
    _this._subSocket = subSocket;

    var pubUrl = url + "/publish?apiKey=" + apiKey + "&clientName=" + clientName;
    var pubSocket = new WebSocket(pubUrl);
    _this._pubSocket = pubSocket;
}

PiCloudSocketClient.prototype.pubReady = function (cb) {
    if (this._pubSocket.readyState === WebSocket.OPEN) {
        cb();
    } else {
        this._pubSocket.onopen = function () {
            cb();
        };
    }
};

PiCloudSocketClient.prototype.subReady = function (cb) {
    if (this._subSocket.readyState === WebSocket.OPEN) {
        cb();
    } else {
        this._subSocket.onopen = function () {
            cb();
        };
    }
};

PiCloudSocketClient.prototype.subscribe = function (e, cb) {
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
    this._subSocket.send(jsonMessage);
};

PiCloudSocketClient.prototype.publish = function (e, data) {
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
    this._pubSocket.send(JSON.stringify(message));
};
