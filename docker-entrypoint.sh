#!/usr/bin/env bash

API_BASE_PATH=$API_BASE_PATH;
SERVER_NAME=$SERVER_NAME;
IP_WHITE_LIST=$IP_WHITE_LIST;
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
iplist="\$http_Host != '$IP_WHITE_LIST'"

sed -i '4c '"$serverName"'' /etc/nginx/conf.d/default.conf
sed -i '11c '"$resolver"'' /etc/nginx/conf.d/default.conf
sed -i '20c '"$apiUrl"'' /etc/nginx/conf.d/default.conf
if [ -z "$IP_WHITE_LIST" ]; then
    sed -i '39,43d' /etc/nginx/conf.d/default.conf
else
    sed -i '40c '"$iplist"'' /etc/nginx/conf.d/default.conf
fi
 
nginx -g "daemon off;"

