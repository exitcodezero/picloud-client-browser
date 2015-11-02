## Install

```
bower install picloud-client
```

## Usage

Creating a new client requires a websocket URL and an API key:
```javascript
var picloud = new PiCloud('wss://example.com/ws', 'secretapikey');
```

Connecting can take a second or two, you'll need to wrap any additional code in the `onReady` method to make sure you're connected first:
```javascript
picloud.onReady(function () {
   // subscription or publishing stuff
});
```

Subscribe to an event name, attaching a function that will be called each time this event is received. This function should take a single argument. When more than one function is subscribed to an event name, each function will be called in the order they were added.
```javascript
function subscriptionCallback(message) {
    // do something cool here
    console.log(message);
}

picloud.subscribe('hi', subscriptionCallback);
```

 The `message` object received by the event callback function will have the following keys:
 * `action` - value will be a string
 * `event` - value will be a string
 * `data` - value will be a string
 * `created_at` - value will be a datetime string

Publish data for an event name:
```javascript
picloud.publish('whatever', 'howdy!');
```
