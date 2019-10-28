FROM httpd:latest
COPY ./dist/visual-cep-frontend /usr/local/apache2/htdocs/
EXPOSE 80
