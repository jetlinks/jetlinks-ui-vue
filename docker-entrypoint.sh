#!/usr/bin/env bash

API_BASE_PATH=$API_BASE_PATH;
SERVER_NAME=$SERVER_NAME;

NAMESERVERS=$(cat /etc/resolv.conf | grep "nameserver" | awk '{print $2}' | tr '\n' ' ')
if [ -z "$API_BASE_PATH" ]; then
    API_BASE_PATH="http://jetlinks:8844/";
fi

if [ -z "$SERVER_NAME" ]; then
    SERVER_NAME="localhost";
fi

apiUrl="proxy_pass  $API_BASE_PATH\$1;"
resolver="resolver $NAMESERVERS ipv6=off;"
serverName="server_name $SERVER_NAME;"

sed -i '4c '"$serverName"'' /etc/nginx/conf.d/default.conf
sed -i '11c '"$resolver"'' /etc/nginx/conf.d/default.conf
sed -i '20c '"$apiUrl"'' /etc/nginx/conf.d/default.conf

 
nginx -g "daemon off;"

