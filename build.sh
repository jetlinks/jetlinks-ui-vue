#!/usr/bin/env bash
docker build -t registry.cn-shenzhen.aliyuncs.com/jetlinks/tbea-ui:1.1.0 .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks/tbea-ui:1.1.0
