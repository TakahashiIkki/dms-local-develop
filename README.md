# dms-local-develop

## what's this?

- AWS DMS のローカルでの開発環境を作ってみる

## 動作チェック

### Docker 環境の立ち上げ

```
$ make up
```

### 疎通確認

```
$ curl -H "Accept:application/json" localhost:8083

{"version":"3.0.0","commit":"8cb0a5e9d3441962","kafka_cluster_id":"A4Fi476dTauyDQw9Kv0EjQ"}

$ curl -H "Accept:application/json" localhost:8083/connectors/

[]
```

- kafka_cluster が起動しているか
- 初期では、connectors が無いはずで未定義である事を確認する

### Debezium MySQL Connector を設定

```
$ curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @register-connector.json
```

### 確認

コネクタが追加されている事を確認出来る

```
$ curl -H "Accept:application/json" localhost:8083/connectors/

["ms_dms-connector"]

$ curl -i -X GET -H "Accept:application/json" localhost:8083/connectors/ms_dms-connector

HTTP/1.1 200 OK
Date: Fri, 04 Feb 2022 16:54:12 GMT
Content-Type: application/json
Content-Length: 558
Server: Jetty(9.4.43.v20210629)

{"name":"ms_dms-connector","config":{"connector.class":"io.debezium.connector.mysql.MySqlConnector","database.allowPublicKeyRetrieval":"true","database.user":"root","database.server.id":"1","tasks.max":"1","database.history.kafka.bootstrap.servers":"kafka:9092","database.history.kafka.topic":"schema-changes.ms_dms","database.server.name":"dms-local","database.port":"3306","database.hostname":"mysql","database.password":"root","name":"ms_dms-connector","database.include.list":"ms_dms"},"tasks":[{"connector":"ms_dms-connector","task":0}],"type":"source"}
```

### Debezium MySQL Connector のイベントの確認

- コンソールを 2 個開き、片方で以下を入力する

```
$ docker-compose exec kafka /kafka/bin/kafka-console-consumer.sh \
 --bootstrap-server kafka:9092 \
 --from-beginning \
 --property print.key=true \
 --topic dms-local.ms_dms.user
```

### MySQL にデータを INSERT する

- もう片方(Topic の Watch をしていない方)のコンソールで以下を入力して、MySQL の user テーブルにデータを Insert します

```
$ docker-compose exec mysql mysql -u root -proot ms_dms -e "INSERT INTO user (name, delete_flag) VALUES ('sample_user1', 0);"
```

---

## Kafka JS で PostgreSQL にデータを持ってくる方法

### セットアップ

README.md に従ってください

### 実行

```
$ npm run start
```

### 確認

```
$ cd /path/to/dms-local-develop
$ docker-compose exec postgres psql -U ikki pg_dms
```

- PostgreSQL 内

```
pg_dms=# SELECT * FROM member;

 user_id |     name     |          created_at
---------+--------------+-------------------------------
       1 | sample_user1 | 2022-03-14 00:06:00.096674+00
(1 row)
```

```
pg_dms=# SELECT * FROM "user";

 id |          created_at
----+-------------------------------
  1 | 2022-03-14 00:06:00.096674+00
(1 row)
```

## Docker の終了

### コンテナ自体を終了

```

$ make down

```

### コンテナ・ボリューム・ネットワーク 含めてすべて削除

```

$ make clean

```

```

```
