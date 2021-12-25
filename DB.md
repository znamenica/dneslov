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
