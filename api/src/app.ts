import express from 'express';
import dotenv from 'dotenv';
import lampRoutes from './routes/lampRoutes';
import { connectRabbitMQ } from './services/rabbitService';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_URL = `amqp://${RABBITMQ_HOST}`;

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());
app.use(lampRoutes);

app.listen(PORT, async () => {
  await connectRabbitMQ(RABBITMQ_URL);
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
