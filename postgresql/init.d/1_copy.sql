\c pg_dms
DROP SCHEMA IF EXISTS ms_dms;
CREATE SCHEMA IF NOT EXISTS ms_dms;
SET search_path = ms_dms;

DROP TABLE IF EXISTS ms_dms."user";

CREATE TABLE ms_dms."user"(
  id integer NOT NULL PRIMARY KEY,
  name VARCHAR(25) NOT NULL,
  delete_flag smallint NOT NULL
);
