FROM node:18 as build=stage

WORKDIR /taskmaster/

COPY src /taskmaster/src
COPY public /taskmaster/public
COPY package.json /taskmaster/

RUN npm install

RUN npm run build

FROM nginx:1.15

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build=stage /taskmaster/additional_container_server.conf /etc/nginx/conf.d/
COPY --from=build=stage /taskmaster/build /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]