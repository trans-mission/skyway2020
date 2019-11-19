FROM mcr.microsoft.com/azure-functions/node:2.0

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY . /home/site/wwwroot

RUN apt-get update && \
    apt-get install sudo

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

#RUN adduser --disabled-password --gecos '' docker
#RUN adduser docker sudo
#RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

#USER docker
RUN cd /home/site/wwwroot && \
    sudo npm install -g azure-functions-core-tools

RUN sudo apt-get update && \
    sudo apt-get install -y cmake

RUN sudo apt-get update && \
    sudo apt-get install -y build-essential

RUN cd /home/site/wwwroot && \
    sudo npm install

RUN cd /home/site/wwwroot && \
    sudo func extensions install
