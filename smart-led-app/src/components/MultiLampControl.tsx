import { useState } from 'react';

interface PinState {
  pin: number;
  intensity: number;
  loading: boolean;
}

const COLORS: Record<number, string> = {
  9: '0,120,255', // azul
  10: '255,140,0', // laranja
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function MultiLampControl() {
  // Lê os pinos da env e cria estados iniciais (0 intensidade, não carregando)
  const pinEnv = import.meta.env.VITE_PINS;
  const pins = pinEnv.split(',').map((p: string) => parseInt(p.trim(), 10));

  const [pinStates, setPinStates] = useState<PinState[]>(
    pins.map((pin: number) => ({ pin, intensity: 0, loading: false }))
  );

  // Envia comando para a API
  const sendCommand = async (pin: number, value: number) => {
    try {
      const res = await fetch(`${apiUrl}/lampada`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, valor: value }),
      });
      if (!res.ok) {
        console.error(`Erro ao enviar comando para pin ${pin}`, await res.text());
      }
    } catch (e) {
      console.error(`Erro na requisição para pin ${pin}`, e);
    }
  };

  // Manipulador para mudança de slider
  const handleChange = (pin: number, value: number) => {
    setPinStates((states) =>
      states.map((s) => (s.pin === pin ? { ...s, intensity: value, loading: true } : s))
    );
    sendCommand(pin, value).finally(() => {
      setPinStates((states) => states.map((s) => (s.pin === pin ? { ...s, loading: false } : s)));
    });
  };

  return (
    <div
      style={{
        maxWidth: 320,
        margin: 'auto',
        fontFamily: 'Arial',
        textAlign: 'center',
      }}
    >
      <h2>Controle de Lâmpadas</h2>
      {pinStates.map(({ pin, intensity, loading }) => {
        const color = COLORS[pin] || '128,128,128';
        const opacity = 1 - intensity / 255;

        return (
          <div key={pin} style={{ marginBottom: 40 }}>
            <h3>Pino {pin}</h3>
            <svg
              width="120"
              height="180"
              viewBox="0 0 64 96"
              aria-label={`Lâmpada pino ${pin}`}
              style={{ marginBottom: 20 }}
            >
              <circle
                cx="32"
                cy="40"
                r="30"
                fill={`rgba(${color},${opacity.toFixed(2)})`}
                stroke="#444"
                strokeWidth="2"
              />
              <rect x="20" y="70" width="24" height="20" fill="#555" />
              <rect x="24" y="60" width="16" height="10" fill="#999" />
            </svg>

            <input
              type="range"
              min={0}
              max={255}
              value={intensity}
              onChange={(e) => handleChange(pin, Number(e.target.value))}
              disabled={loading}
              style={{ width: '100%' }}
            />
            <div>Intensidade: {intensity}</div>
            {loading && <div>Enviando comando...</div>}
          </div>
        );
      })}
    </div>
  );
}
