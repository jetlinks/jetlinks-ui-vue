FROM nginx:alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories

ADD nginx.conf /etc/nginx/conf.d/default.conf
ADD docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh
COPY dist /usr/share/nginx/html
CMD ["sh","/docker-entrypoint.sh"]
#ADD oauth2 /usr/share/nginx/html/oauth2
