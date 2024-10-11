#!/usr/bin/env bash
docker build -t registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:2.2.0-TEST .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks/jetlinks-ui-vue:2.2.0-TEST
