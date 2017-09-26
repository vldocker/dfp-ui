# dfp-UI

The goal of this project is to supply a virtualization layer to the swarm cluster in the docker flow proxy project,
in hence we build a tool using react+nodejs on top of the swarm cluster that will supply information about 3 main things:

1. cluster View - a graph that displays all the network in the cluster and the services that connect to each network

2. Services - each service will include details about the service configuration, service last logs.
             The services that are part of the proxy network will contain all the ha-proxy statistics.

3. Networks - each network with all the configuration details and services that related to the network.

![Image description](https://github.com/vldocker/dfp-ui/blob/master/first-page.png)
-------------------------------------------------------------------------------------------------------------------------
 # requirements:
 
go to address [PROXY_IP]:[PROXY_PORT]/metrics and defined the environment variables STATS_USER and STATS_PASS
 
-------------------------------------------------------------------------------------------------------------------------
 # A Docker Service is created with the following syntax: 
 
 
service create --name dfp-ui /
--network proxy /
--publish 3333:3333 /
--env PROXY_HOST_AND_PORT="http://proxy:8080"/ 
--constraint 'node.role == manager' /
--mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock /
dockervoyagerlabs/dfproxy:1.7.4

-------------------------------------------------------------------------------------------------------------------------
 # docker compose file 
                                                                                                                           
docker stack deploy --compose-file docker-compose.yml dfpui  
