import { Request, Response } from 'express';
import { sendMessageToQueue } from '../services/rabbitService';

interface CommandRequestBody {
  pin: number;
  valor: number;
}

export async function sendCommand(req: Request, res: Response): Promise<Response> {
  const { pin, valor } = req.body as CommandRequestBody;

  if (
    typeof pin !== 'number' ||
    typeof valor !== 'number' ||
    pin < 0 ||
    pin > 255 ||
    valor < 0 ||
    valor > 255
  ) {
    return res.status(400).json({ error: 'pin e valor devem ser números entre 0 e 255' });
  }

  const message = `${pin}:${valor}`;

  try {
    const sent = sendMessageToQueue(message);
    if (!sent) {
      return res.status(500).json({ error: 'Falha ao enviar mensagem para a fila' });
    }
    console.log(`📤 Mensagem enviada: ${message}`);
    return res.json({ status: 'ok', message: `Enviado: ${message}` });
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    return res.status(500).json({ error: 'Erro interno ao enviar mensagem' });
  }
}
