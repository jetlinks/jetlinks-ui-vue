#!/usr/bin/env bash
docker build -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:1.0.0 .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:1.0.0
