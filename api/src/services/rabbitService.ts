import amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectRabbitMQ(rabbitUrl: string): Promise<void> {
  try {
    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    await channel.assertQueue('lampada', { durable: false });
    console.log('✅ Conectado ao RabbitMQ');
  } catch (error) {
    console.error('❌ Erro ao conectar ao RabbitMQ:', error);
    process.exit(1);
  }
}

export function sendMessageToQueue(message: string): boolean {
  if (!channel) {
    console.error('❌ Canal RabbitMQ não está inicializado');
    return false;
  }
  return channel.sendToQueue('lampada', Buffer.from(message));
}
