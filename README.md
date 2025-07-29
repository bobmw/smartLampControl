# Smart Lamp Control

Projeto para controle de lâmpadas via API REST, com comunicação entre backend Node.js, RabbitMQ e Arduino via conexão serial.

## Descrição

Este sistema permite enviar comandos para controlar lâmpadas conectadas a um Arduino. A API recebe comandos HTTP, publica mensagens na fila RabbitMQ, que são consumidas por um script Python que se comunica com o Arduino via porta serial.

---

## Tecnologias

- Node.js + Express
- RabbitMQ
- TypeScript
- Python (listener serial)
- Arduino (controle físico das lâmpadas)
- Husky, Commitlint e Prettier para controle de qualidade de código

---
