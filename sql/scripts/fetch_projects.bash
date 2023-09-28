#!/usr/bin/env bash

mariadb --table pulse -e "CALL fetch_projects();"
