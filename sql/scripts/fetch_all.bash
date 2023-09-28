#!/usr/bin/env bash

script_full_path=$(dirname "$0")

source $script_full_path/fetch_users.bash
source $script_full_path/fetch_employees.bash
source $script_full_path/fetch_project_managers.bash
source $script_full_path/fetch_projects.bash
source $script_full_path/fetch_project_archives.bash
source $script_full_path/fetch_assignments.bash
source $script_full_path/fetch_reports.bash
