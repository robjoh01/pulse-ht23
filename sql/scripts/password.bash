#!/usr/bin/env bash

if [[ $# -gt 0 ]]
  then
    # Fetch the user id
    fetchID=$(mariadb pulse -e "SELECT fetch_employee_id('$1');")
    id=$(echo $fetchID | cut -d' ' -f2)

    # Fetch the password
    fetchPassword=$(mariadb pulse -e "SELECT fetch_password('$id');")
    password=$(echo $fetchPassword | cut -d' ' -f2)

    # Use the extracted password in the bcrypt-tool command
    answer=$(bcrypt-tool match "$2" "$password")

    echo Does this password match with $1: $answer!

  else echo No arguments were provided.
fi
