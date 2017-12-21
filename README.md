# Docker Flow Proxy UI

The goal of this project is to supply a virtualization layer to the swarm cluster in the docker flow proxy project,
in hence we build a tool using react+nodejs on top of the swarm cluster that will supply information about 3 main things:

1. Cluster View - a graph that displays all the network in the cluster and the services that connect to each network

2. Services - each service will include details about the service configuration, service last logs.
             The services that are part of the proxy network will contain all the ha-proxy statistics.

3. Networks - each network with all the configuration details and services that related to the network.

![Image description](https://github.com/vldocker/dfp-ui/blob/master/first-page.png)
-------------------------------------------------------------------------------------------------------------------------
 # requirements:

[Docker Flow Proxy](http://proxy.dockerflow.com/) up and running with environment variables `STATS_USER` and `STATS_PASS`

-------------------------------------------------------------------------------------------------------------------------
 # A Docker Service is created with the following syntax:

The command that follows assumes that [Docker Flow Proxy](http://proxy.dockerflow.com/) is attached to the network `proxy` and that the name of the service is `proxy`. Please change `--network` and `--env` values if proxy is using a different network or the service is created with a different name.

```bash
docker service create --name dfp-ui \
    --network proxy \
    --publish 3333:3333 \
    --env PROXY_HOST_AND_PORT="http://proxy:8080" \
    --constraint 'node.role == manager' \
    --mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
    dockervoyagerlabs/dfproxy:1.7.5
```

-------------------------------------------------------------------------------------------------------------------------
 # docker compose file

docker stack deploy --compose-file docker-compose.yml dfpui  

# Demo

### Create a network

```bash
docker network create -d overlay proxy
```

### Deploy the stack

```bash
docker stack deploy -c docker-compose.yml proxy
```

### Open the UI

Change `localhost` to the domain of your cluster.

```bash
open "http://localhost/ui"
```

Explore it!

### Deploy a demo service

```bash
curl -o go-demo-2.yml https://raw.githubusercontent.com/vfarcic/go-demo-2/master/stack.yml

docker stack deploy -c go-demo-2.yml go-demo-2

open "http://localhost/ui"
```

Observe that the new services can be explored though the UI.


## TODO

- [ ] Check Warnings and errors on the client side
- [ ] Support for clusterView by cluster hosts
- [ ] Client side re-factoring
- [ ] Change all the docker api calls to use swarmrode (https://www.npmjs.com/package/swarmerode)
- [ ] Display HAProxy stats just to proxy services
- [ ] Add filter in logs panel to display stdrr and stdout logs
- [ ] Renaming
- [ ] Implement alerts with react-s-alert.
