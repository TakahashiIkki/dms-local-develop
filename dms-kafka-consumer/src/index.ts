import { PrismaClient } from "@prisma/client";
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
    eachMessage: async ({ topic, partition: _partition, message }) => {
      const prisma = new PrismaClient();

      type OldUserType = {
        id: number;
        name: string;
        delete_flag: 0 | 1;
      };
      type MessageType = {
        schema: any;
        payload: {
          before?: OldUserType;
          after: OldUserType;
        };
      };

      const messageObject: MessageType = JSON.parse(message.value.toString());
      const { before, after } = messageObject.payload;

      if (!before) {
        // リファクタリング先のテーブルに以降
        await prisma.$transaction([
          prisma.$executeRawUnsafe(
            `INSERT INTO "user" (id, created_at) VALUES ($1, current_timestamp)`,
            after.id
          ),
          prisma.$executeRawUnsafe(
            `INSERT INTO member (user_id, name, created_at) VALUES ($1, $2, current_timestamp)`,
            after.id,
            after.name
          ),
        ]);
      } else {
        // リファクタリング先のテーブルに以降
        await prisma.$transaction([
          prisma.$executeRawUnsafe(
            `UPDATE member SET name = $1 WHERE user_id = $2`,
            after.name,
            after.id
          ),
        ]);
      }

      console.log(`${topic} 処理が完了しました`);
    },
  });
};

console.log("ready.");

run().catch(console.error);
