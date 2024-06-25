FROM nginx
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
COPY dist /usr/share/nginx/html
CMD ["sh","/docker-entrypoint.sh"]
#ADD oauth2 /usr/share/nginx/html/oauth2
