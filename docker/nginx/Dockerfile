FROM nginx:1.15

RUN rm /etc/nginx/conf.d/default.conf

COPY additional_container_server.conf /etc/nginx/conf.d/

EXPOSE 8888

CMD ["nginx", "-g", "daemon off;"]