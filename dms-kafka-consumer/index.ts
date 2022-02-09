import kafka from "kafka-node";

const client = new kafka.KafkaClient({
  kafkaHost: "kafka:9092",
  connectTimeout: 3000,
  requestTimeout: 3000,
});

const consumer = new kafka.Consumer(
  client,
  [{ topic: "dms-local.ms_dms.user" }],
  {
    autoCommit: true,
    fromOffset: true,
    groupId: "consumer1",
  }
);

consumer.on("message", function (message) {
  console.log(message);
});

console.log("ready.");
