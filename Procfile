wget https://github.com/binwiederhier/ntfy/releases/download/v2.7.0/ntfy_2.7.0_linux_amd64.tar.gz
tar zxvf ntfy_2.7.0_linux_amd64.tar.gz
cp -a ntfy_2.7.0_linux_amd64/ntfy /home/bigsealy/bin/ntfy
mkdir /home/bigsealy/etc/ntfy && cp ntfy_2.7.0_linux_amd64/{client,server}/*.yml /home/bigsealy/etc/ntfy
nano /home/bigsealy/etc/ntfy/server.yml
ntfy serve --upstream-base-url "https://ntfy.sh" --base_url "https://orange-sky.ly/" --listen-http :3002