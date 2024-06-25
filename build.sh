#!/usr/bin/env bash

rm -rf dist
pnpm build
docker build -t registry.cn-shenzhen.aliyuncs.com/jetlinks-projects/jetlinks-ui-vue:2.2.0-hl .
docker push registry.cn-shenzhen.aliyuncs.com/jetlinks-projects/jetlinks-ui-vue:2.2.0-hl
