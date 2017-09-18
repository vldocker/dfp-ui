# dfp-ui

the goal of this project is to supply a virtualization layer to the swarm cluster in docker flow proxy projcet,
in hence we build a tool using react+nodejs on top of the swarm cluster that will supply information about 3 main things:

1. cluster View - a graph that display all the network in the cluster and the services that connect to each network

2. Service - each service will include details about the service configuration , service last logs.
             the services that is part of the proxy network will contain all the ha-proxy satistics.

3. Network - each network with all the configuration details and services that related to the network.

-------------------------------------------------------------------------------------------------------------------------
 # A Docker Service is created with the following syntax: 
 
 
service create --name dfp-ui /
--network proxy /
--publish 3333:3333 /
--env PROXY_HOST_AND_PORT="http://proxy:8080"/ 
--constraint 'node.role == manager' /
--mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock /
dockervoyagerlabs/dfproxy:1.7.4 /


 
 
