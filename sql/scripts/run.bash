#!/usr/bin/env bash

mariadb --table pulse < "./reset.sql"
mysqldump --result-file="./backup.sql" pulse
