## README

This README would normally document whatever steps are necessary to get the
application up and running.

## Status











[![Homepage](http://img.shields.io/badge/home-dneslov.org-blue.svg)](http://dneslov.org)
[![GitHub](http://img.shields.io/badge/github-znamenica/dneslov-blue.svg)](http://github.com/znamenica/dneslov)
[![MIT License](http://b.repl.ca/v1/License-MIT-blue.png)](LICENSE)

[![Build Status](https://api.travis-ci.org/znamenica/dneslov.png?branch=master)](https://travis-ci.org/znamenica/dneslov.png)
[![Code Climate](https://codeclimate.com/github/znamenica/dneslov/badges/gpa.svg)](https://codeclimate.com/github/znamenica/dneslov)
[![Test Coverage](https://codeclimate.com/github/znamenica/dneslov/badges/coverage.svg)](https://codeclimate.com/github/znamenica/dneslov)
[![Scan Coverage](https://scan.coverity.com/projects/17554/badge.svg?flat=1)](https://scan.coverity.com/projects/znamenica-dneslov)

## Dump test DB to production

locally execute:

```
pg_dump -f dneslov_test.dump.sql.tar -F t -d dneslov_test
scp dneslov_test.dump.sql.tar dneslov:
```

remotely execute:

```
dropdb dneslov_production_old --if-exists
createdb dneslov_tmp
pg_restore  -d dneslov_tmp -1 dneslov_test.dump.sql.tar
psql -d template1 <<< "
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'dneslov_production'
  AND pid <> pg_backend_pid();
ALTER DATABASE dneslov_production RENAME TO dneslov_production_old;
ALTER DATABASE dneslov_tmp RENAME TO dneslov_production;"
```

or the last statement can be replaced with:

```sql
SELECT pg_terminate_backend (pid) FROM pg_stat_activity WHERE datname = 'db';
```
