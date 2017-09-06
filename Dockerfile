FROM mhart/alpine-node:latest
RUN apk update && apk add curl
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app
RUN cd /opt/app/client && npm install && npm run build
EXPOSE 3333

CMD ["node", "bin/www"]
