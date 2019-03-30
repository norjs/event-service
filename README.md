# NorJS Event Service

This is a local service which passes on events to 
(https://github.com/norjs/event-server)[event servers] and 
(https://github.com/norjs/event)[observers].

### Design

It is a NodeJS service which has one or more configured top level event servers. 

Local observers can connect to it over a UNIX socket file.

Event must be triggered on only one top level server, unless the server is unavailable.

Communication between the service and a top level server is implemented using either a long 
polling HTTP(S) connection (if the server cannot connect to the service directly) or direct 
two-way HTTP(S)/UNIX-Socket connection (if connection is possible both ways).

Communication between the service and observers is implemented over a UNIX socket file with 
HTTP long polling.
