#!/usr/bin/env bash

mariadb --table pulse -e "SELECT * FROM v_projects;"
