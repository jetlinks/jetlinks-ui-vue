#!/usr/bin/env bash

API_BASE_PATH=$API_BASE_PATH;
SERVER_NAME=$SERVER_NAME;

#NAMESERVERS=$(cat /etc/resolv.conf | grep "nameserver" | awk '{print $2}' | tr '\n' ' ')
NAMESERVERS=$(grep "^nameserver" /etc/resolv.conf | awk '{print $2}' | tr '\n' ' ')
if [ -z "$API_BASE_PATH" ]; then
    API_BASE_PATH="http://jetlinks:8844/";
fi

apiUrl="proxy_pass  $API_BASE_PATH\$1;"
resolver="resolver $NAMESERVERS ipv6=off;"

sed -i '11c '"$resolver"'' /etc/nginx/conf.d/default.conf
sed -i "s%{API_BASE_PATH}%$API_BASE_PATH%g" /etc/nginx/conf.d/default.conf

if [ -z "$SERVER_NAME" ]; then
    serverName="server_name localhost;"
    sed -i '4c '"$serverName"'' /etc/nginx/conf.d/default.conf
    sed -i "s%{SERVER_NAME}%\"0\"%g" /etc/nginx/conf.d/default.conf
else
    serverName="server_name $SERVER_NAME;"
    sed -i '4c '"$serverName"'' /etc/nginx/conf.d/default.conf
    sed -i "s%{SERVER_NAME}%$SERVER_NAME%g" /etc/nginx/conf.d/default.conf
fi

#cat /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"

