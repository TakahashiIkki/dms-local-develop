import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "dock-host-app",
  brokers: ["127.0.0.1:29092"],
});

const consumer = kafka.consumer({ groupId: "consumer1" });
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "dms-local.ms_dms.user",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Received: ", {
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

console.log("ready.");

run().catch(console.error);
