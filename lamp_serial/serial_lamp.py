import serial
import time
import pika
import sys

# Configurações
PORTA_SERIAL = "COM4"  # Altere conforme necessário
BAUDRATE = 9600
RABBITMQ_HOST = "localhost"
FILA = "lampada"

def serial_con(porta, baudrate=9600, timeout=1):
    try:
        ser = serial.Serial(porta, baudrate, timeout=timeout)
        time.sleep(2)  # Aguarda o Arduino reiniciar
        print(f'[Serial] Conectado na porta {porta}')
        return ser
    except serial.SerialException as e:
        print(f'[Serial] Erro ao conectar na porta {porta}: {e}')
        return None

def send_command(ser, pin, valor):
    if ser and ser.is_open:
        comando = f"{pin}:{valor}\n"
        ser.write(comando.encode())
        resposta = ser.readline().decode().strip()
        print(f"[Serial] Enviado: {comando.strip()} | Recebido: {resposta}")
    else:
        print('[Serial] Porta não está aberta.')

# Callback executado ao receber mensagem do RabbitMQ
def callback(ch, method, properties, body):
    mensagem = body.decode().strip()
    print(f"[RabbitMQ] Mensagem recebida: {mensagem}")

    if ':' not in mensagem:
        print("[RabbitMQ] Erro: formato inválido. Use 'pino:valor'")
        return

    try:
        pin, valor = map(int, mensagem.split(':'))
        send_command(serial_conn, pin, valor)
    except ValueError:
        print("[RabbitMQ] Erro: mensagem precisa conter números inteiros no formato 'pino:valor'")

def start_rabbitmq_listener():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=FILA)
        channel.basic_consume(queue=FILA, on_message_callback=callback, auto_ack=True)
        print(f"[RabbitMQ] Escutando fila '{FILA}'...")
        channel.start_consuming()
    except Exception as e:
        print(f"[RabbitMQ] Erro ao conectar ou consumir: {e}")
        sys.exit(1)

# --- EXECUÇÃO PRINCIPAL ---
if __name__ == "__main__":
    serial_conn = serial_con(PORTA_SERIAL)

    if serial_conn:
        start_rabbitmq_listener()
