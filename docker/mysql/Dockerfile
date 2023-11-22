FROM mysql

ENV MYSQL_ROOT_PASSWORD=admin123

ADD db_create.sql /docker-entrypoint-initdb.d

EXPOSE 3306
