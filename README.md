# dfp-UI

The goal of this project is to supply a virtualization layer to the swarm cluster in the docker flow proxy project,
in hence we build a tool using react+nodejs on top of the swarm cluster that will supply information about 3 main things:

1. cluster View - a graph that displays all the network in the cluster and the services that connect to each network

2. Service - each service will include details about the service configuration, service last logs.
             The services that are part of the proxy network will contain all the ha-proxy statistics.

3. Network - each network with all the configuration details and services that related to the network.
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
dockervoyagerlabs/dfproxy:1.7.6

-------------------------------------------------------------------------------------------------------------------------
 # docker compose file 
                                                                                                                           version: "3.1"
services:
  proxy:
    image: vfarcic/docker-flow-proxy
    ports:
      - 80:80
      - 443:443
    networks:
      - default
    environment:
      - LISTENER_ADDRESS=swarm-listener
      - STATS_USER=admin
      - STATS_PASS=admin
  swarm-listener:
    image: vfarcic/docker-flow-swarm-listener
    networks:
      - default
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DF_NOTIFY_CREATE_SERVICE_URL=http://proxy:8080/v1/docker-flow-proxy/reconfigure
      - DF_NOTIFY_REMOVE_SERVICE_URL=http://proxy:8080/v1/docker-flow-proxy/remove
    deploy:
      placement:
        constraints: [node.role == manager]
  ui:
    image: dockervoyagerlabs/dfproxy:1.7.4
    ports:
      - 3333:3333
    networks:
      - default
    deploy:
      placement:
        constraints: [node.role == manager]
      labels:
        - com.df.distribute=true
        - com.df.notify=true
        - com.df.servicePath=/
        - com.df.port=3333
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - PROXY_HOST_AND_PORT=http://proxy:8080
networks:
  default:
    external: false

