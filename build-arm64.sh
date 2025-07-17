#!/usr/bin/env bash
docker build --no-cache -f Dockerfile-arm64 --platform linux/arm64 -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:2.2.0-ARM64 .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:2.2.0-ARM64
