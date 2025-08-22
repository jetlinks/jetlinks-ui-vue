#!/usr/bin/env bash
docker build -f Dockerfile.template -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-template-ui:1.0 .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-template-ui:1.0
