FROM nginx:1.20.2
ADD nginx.conf /etc/nginx/conf.d/default.conf
ADD docker-entrypoint.sh /docker-entrypoint.sh
COPY dist /usr/share/nginx/html
COPY edge-gateway /usr/share/nginx/edge-gateway
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]
#ADD oauth2 /usr/share/nginx/html/oauth2
