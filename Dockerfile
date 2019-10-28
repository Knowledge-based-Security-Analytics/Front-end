FROM httpd:latest
./dist/ /usr/local/apache2/htdocs/
EXPOSE 80
