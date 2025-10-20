#!/usr/bin/env bash

docker build --no-cache -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:2.11.0 --push .
docker build --no-cache --platform linux/arm64 -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:2.11.0-arm64 --push .

