FROM centos:centos7.2.1511

RUN yum install -y git gcc make

RUN useradd soupeladmin
RUN sed -i 's/^soupeladmin.*/soupeladmin:\$1\$Rrhb4lzg\$Ee8\/JYZjv\.NimwyrSEL6R\/:18295:0:99999:7:::/' /etc/shadow
RUN chmod +r /etc/shadow

RUN groupadd nogroup

RUN cd /tmp ; git clone https://github.com/proftpd/proftpd.git ; cd proftpd ; ./configure --with-modules=mod_copy:mod_ratio ; make ; make install

RUN mkdir -p /usr/share/nginx/html
VOLUME /usr/share/nginx/html

RUN bash -c "usermod -u 997 -g 996 nobody"

EXPOSE 21

ENTRYPOINT ["proftpd", "-n"]
