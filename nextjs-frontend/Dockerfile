FROM node:18 as build_stage

WORKDIR /taskmaster/

COPY src /taskmaster/src
COPY public /taskmaster/public
COPY package.json /taskmaster/
COPY tailwind.config.js ./
COPY additional_container_server.conf ./

RUN npm install

RUN npm run build

FROM nginx:1.15

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build_stage /taskmaster/additional_container_server.conf /etc/nginx/conf.d/
COPY --from=build_stage /taskmaster/.next /usr/share/nginx/html
COPY --from=build_stage /taskmaster/public /usr/share/nginx/html/_next/static

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]