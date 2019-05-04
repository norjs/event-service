# NorJS Event Service

This is a local service which passes on events to 
[event servers](https://github.com/norjs/event-server) and 
[observers](https://github.com/norjs/event).

### Design

It is a NodeJS service which has one or more configured top level event servers. 

Local observers can connect to it over a UNIX socket file.

Event must be triggered on only one top level server, unless the server is unavailable.

Communication between the service and a top level server is implemented using either a long 
polling HTTP(S) connection (if the server cannot connect to the service directly) or direct 
two-way HTTP(S)/UNIX-Socket connection (if connection is possible both ways).

Communication between the service and observers is implemented over a UNIX socket file with 
HTTP long polling.

### Install

`npm install -g @norjs/event-service`

### Usage

#### Start a service on `./socket.sock`:

```
NODE_LISTEN=socket.sock \
nor-event-service
```

#### Wait for an event:

```
if NODE_CONNECT=/path/to/socket.sock nor-event --wait=foo; then
  echo Event happened
else
  echo Timeout happened
fi
```

#### Trigger an event:

```
NODE_CONNECT=/path/to/socket.sock nor-event --trigger=foo --payload='{"hello":"world"}'
```

#### Start a service on `./socket.sock` with configured types:

```
NOR_EVENT_LOAD_TYPES='./types.js' \
NOR_EVENT_PAYLOAD_TYPES='{"my-resource:created": "MyResourceDTO"}' \
NODE_LISTEN=./socket.sock \
nor-event-service
```

And define your types using JSDoc-style in a file named `./types.js`: 

```js
const TypeUtils = require('@norjs/utils/Type');

/**
 * @typedef {Object} MyResourceDTO
 * @property {number} id - My resource id
 * @property {string} name - My resource name
 * @property {boolean} deleted - Deleted or not?
 * @property {Array.<MyResourceItemDTO>} items - My items
 */
TypeUtils.defineType(
    "MyResourceDTO", 
    {
        "id": "number",
        "name": "string",
        "deleted": "boolean",
        "items": "Array.<MyResourceItemDTO>"
    }
);

```

You can use this file from your own application. It also integrates to WebStorm's 
quick documentation, too, since it is standard JavaScript and JSDoc.
