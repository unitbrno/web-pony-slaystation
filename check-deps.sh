#!/usr/bin/env bash

ret=0

command -v npm 2>/dev/null >/dev/null
if [ $? -ne 0 ]; then
    ret=1
    printf "\033[0;31mnpm is not available\033[0m, see https://www.npmjs.com/get-npm\n"
else
    printf "\033[0;30mnpm found\033[0m\n"
fi

command -v node 2>/dev/null >/dev/null
if [ $? -ne 0 ]; then
    ret=1
    printf "\033[0;31mnode is not available\033[0m, see https://www.npmjs.com/get-npm\n"
else
    printf "\033[0;30mnode found\033[0m\n"
fi

command -v ng 2>/dev/null >/dev/null
if [ $? -ne 0 ]; then
    ret=1
    printf "\033[0;31mng is not available\033[0m, if npm is available, run npm install -g @angular/cli\n"
else
    printf "\033[0;30mng found\033[0m\n"
fi

command -v python3 2>/dev/null >/dev/null
if [ $? -ne 0 ]; then
    ret=1
    printf "\033[0;31mpython3 is not available\033[0m, install via package manager\n"
else
    printf "\033[0;30mpython3 found\033[0m\n"
fi

command -v docker 2>/dev/null >/dev/null
if [ $? -ne 0 ]; then
    ret=1
    printf "\033[0;31mdocker is not available\033[0m, install docker-ce https://www.docker.com/community-edition\n"
else
    printf "\033[0;30mdocker found\033[0m\n"
fi

exit $ret
