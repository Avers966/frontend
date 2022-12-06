# skillboxteam32/front

```bash
docker run -d --name front -p 8097:80 skillboxteam32/front:latest
```

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Docker Build
```
docker build -t skillboxteam32/front .
```

### Docker push
```
docker push skillboxteam32/front:latest

```### Docker stop and rm
```
### Docker stop and rm
```
docker stop frontend-alpha && docker rm frontend-alpha
```
### Docker stop and rm and start
```
docker stop frontend-alpha && docker rm frontend-alpha && docker run -d --name frontend-alpha -p 8099:80 -p 8098:80 -p 8097:80 skillboxteam32/front:latest
```
### Docker sh
```
#!/bin/bash
echo "Begin restart front";
echo "Stop docker front";
docker stop frontend-alpha;
echo "rm docker front";
docker rm frontend-alpha;
echo "Pull image";
docker image pull skillboxteam32/front:latest;
echo "Start new docker front";
docker run -d --name frontend-alpha -p 8099:80 -p 8098:80 -p 8097:80 skillboxteam32/front:latest
```