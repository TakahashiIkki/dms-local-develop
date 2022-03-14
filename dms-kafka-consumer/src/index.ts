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
          prisma.user.create({
            data: {
              id: after.id,
            },
          }),
          prisma.member.create({
            data: {
              userId: after.id,
              name: after.name,
            },
          }),
        ]);
      } else {
        // リファクタリング先のテーブルに以降
        await prisma.$transaction([
          prisma.member.update({
            data: {
              name: after.name,
            },
            where: {
              userId: after.id,
            },
          }),
        ]);
      }

      console.log(`${topic} 処理が完了しました`);
    },
  });
};

console.log("ready.");

run().catch(console.error);
