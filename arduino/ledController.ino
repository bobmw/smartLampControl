#define PIN_COLD 9  // Pino PWM para luz fria
#define PIN_WARM 10 // Pino PWM para luz quente

void setup() {
  Serial.begin(9600); // Inicia comunicação serial
  pinMode(PIN_COLD, OUTPUT);
  pinMode(PIN_WARM, OUTPUT);
  
  analogWrite(PIN_COLD, 255); // Começa com luzes desligadas
  analogWrite(PIN_WARM, 255);
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n'); // Lê até \n
    input.trim(); // Remove espaços e quebras de linha extras

    if (input.length() > 0) {
      int sepIndex = input.indexOf(':');
      
      if (sepIndex > 0) {
        int pin = input.substring(0, sepIndex).toInt();      // Ex: "9"
        int value = input.substring(sepIndex + 1).toInt();   // Ex: "128"
        
        value = constrain(value, 0, 255); // Garante intervalo válido
        
        int brightness = 255 - value; // Inverte o valor

        if (pin == PIN_COLD || pin == PIN_WARM) {
          analogWrite(pin, brightness);
          Serial.print("OK ");
          Serial.print("Pino ");
          Serial.print(pin);
          Serial.print(" → ");
          Serial.println(value);
        } else {
          Serial.println("Erro: Pino inválido.");
        }
      } else {
        Serial.println("Erro: Formato deve ser pin:valor");
      }
    }
  }
}
