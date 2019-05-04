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

Start a service on `./socket.sock`:

```
NODE_LISTEN=socket.sock nor-event-service
```
