#!/usr/bin/env bash

API_BASE_PATH=$API_BASE_PATH;
SERVER_NAME=$SERVER_NAME;

NAMESERVERS=$(cat /etc/resolv.conf | grep "nameserver" | awk '{print $2}' | tr '\n' ' ')
if [ -z "$API_BASE_PATH" ]; then
    API_BASE_PATH="http://jetlinks:8844/";
fi

<<<<<<< HEAD

=======
>>>>>>> 39a0991d4a3c9da4014154682811fd8270bd35c8
apiUrl="proxy_pass  $API_BASE_PATH\$1;"
resolver="resolver $NAMESERVERS ipv6=off;"

sed -i '11c '"$resolver"'' /etc/nginx/conf.d/default.conf
<<<<<<< HEAD
sed -i '25c '"$apiUrl"'' /etc/nginx/conf.d/default.conf
=======
sed -i "s%{API_BASE_PATH}%$API_BASE_PATH%g" /etc/nginx/conf.d/default.conf
>>>>>>> 39a0991d4a3c9da4014154682811fd8270bd35c8

if [ -z "$SERVER_NAME" ]; then
    serverName="server_name localhost;"
    sed -i '4c '"$serverName"'' /etc/nginx/conf.d/default.conf
    sed -i '15,17d' /etc/nginx/conf.d/default.conf
else
    serverName="server_name $SERVER_NAME;"
    sed -i '4c '"$serverName"'' /etc/nginx/conf.d/default.conf
<<<<<<< HEAD
    sed -i 's/\${SERVER_NAME}/'$SERVER_NAME'/g' /etc/nginx/conf.d/default.conf
fi
=======
    sed -i "s%{SERVER_NAME}%$SERVER_NAME%g" /etc/nginx/conf.d/default.conf
fi

#cat /etc/nginx/conf.d/default.conf
>>>>>>> 39a0991d4a3c9da4014154682811fd8270bd35c8

nginx -g "daemon off;"

