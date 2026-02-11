#!/usr/bin/env bash
docker build -f Dockerfile.template --no-cache -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-template-ui:2.12.0 .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-template-ui:2.12.0
