import {Kafka} from "kafkajs";
import fs from "fs";
import path from "path";

// const kafka = new Kafka({
//     clientId: "duziolon",
//     brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
// })

const caPath = path.join(process.cwd(), "lib", "certs", "ca.pem");

const kafka = new Kafka({
  clientId: "duziolon",
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    ca: [fs.readFileSync(caPath, "utf-8")],
  },
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});

let producer = kafka.producer();

let connected = false;

export async function getKafkaProducer(){
    if(!connected){
        await producer.connect();
        connected = true;
        console.log("Kafka producer connected successfully");
    }
    return producer;
}