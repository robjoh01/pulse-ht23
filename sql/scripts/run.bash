#!/usr/bin/env bash

VAR=${1:-"."}

mariadb --table pulse < "$VAR/reset.sql"
mysqldump --result-file="$VAR/backup.sql" pulse
