// import { getKafkaProducer } from "./kafka";

// export async function publishOrderCreatedEventToKafka(order) {
//   const producer = await getKafkaProducer();

//   const {
//     orderId,
//     userId,
//     name,
//     email,
//     amount,
//     expectedDeliveryDate,
//   } = order;

//   const event = {
//     event: "ORDER_PLACED",

//     orderId: String(orderId),
//     userId: String(userId),

//     name:name,
//     email:email,

//     amount,
//     expectedDeliveryDate,

//     createdAt: new Date().toISOString(),
//   };

//   await producer.send({
//     topic: "order-placed",
//     messages: [
//       {
//         key: String(orderId),
//         value: JSON.stringify(event),
//       },
//     ],
//   });

//   console.log("ORDER_PLACED event published:", event);
// }

import { getKafkaProducer } from "./kafka";

export async function publishKafkaEvent({
  topic,
  event,
  key,
  data,
}) {
  const producer = await getKafkaProducer();

  const eventPayload = {
    event,
    ...data,
    createdAt: new Date().toISOString(),
  };

  await producer.send({
    topic,
    messages: [
      {
        key: String(key),
        value: JSON.stringify(eventPayload),
      },
    ],
  });

  console.log(`${event} event published:`, eventPayload);

  return eventPayload;
}