<div align="center">
    
![logo](https://github.com/federicobarera/quakejs-docker/blob/master/quakejs-docker.png?raw=true)
# quakejs-docker

![Docker Image CI](https://github.com/federicobarera/quakejs-docker/workflows/Docker%20Image%20CI/badge.svg)

</div>

## Usage

### Standalone or internal network

```
docker run -d --name quakejs -e HTTP_PORT=8080 -p 8080:80 -p 27960:27960 federicobarera2/quakejs:latest
```

Navigate to http://localhost:8080 or network ip

### Fargate

Perform aws cli login

```
npm i
sh ./deploy.sh [--profile]
```

After the deploy the `retrieve_ip.sh` script will retrive the public ip of the fargate task

**cdk.json configuration**

| name             | desc                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| whiteListedIps   | array of ips allowed to connect                                       |
| usePrebuildImage | leave blank to build from local repository (eg, change in server.cfg) |
| useCapacity      | FARGATE or FARGATE_SPOT                                               |
| cpu              | CPU requested for fargate task                                        |
| memory           | memory requested for fargate task                                     |

## server.cfg:

Refer to [quake3world](https://www.quake3world.com/q3guide/servers.html) for instructions on its usage.

## Changelog

### 17/07/2022

- Dockerfile modified to make build work again
- `echo "127.0.0.1 content.quakejs.com" >> /etc/hosts` moved to the `./entrypoint.sh` as
  - Not working anymore during build: https://stackoverflow.com/questions/38302867/how-to-update-etc-hosts-file-in-docker-image-during-docker-build
  - Runtime `add-host` not available in fargate
- Added cdk fargate deployment model
- Deployed new docker image based from `treyyoder` latest with:
  - No need for -e `SERVER`
  - Manifest and content pulled from within image

## Credits:

Thanks to [treyyoder](https://github.com/treyyoder) with his [fork](https://github.com/treyyoder/quakejs-docker) of [quakejs](https://github.com/inolen/quakejs) to which this was derived, aswell as his thorough [documentation](https://steamforge.net/wiki/index.php/How_to_setup_a_local_QuakeJS_server_under_Debian_9_or_Debian_10)
