# Mosquitto MQTT Project

Este proyecto utiliza Mosquitto MQTT para la visualización de datos en tiempo real de sensores, conectados a una aplicación frontend construida con React.

## Requisitos

- **Mosquitto MQTT Broker**
- **ESP8266 (NodeMCU o Wemos D1 Mini)**
- **Sensor DHT11**
- **Arduino IDE**
- **Node.js y npm**
- **Git**

## Configuración del Hardware

1. **Conectar el Sensor DHT11 al ESP8266**:
   - **VCC** del DHT11 a **3.3V** en el ESP8266
   - **GND** del DHT11 a **GND** en el ESP8266
   - **Data** del DHT11 al pin **D2** (GPIO4) en el ESP8266

## Configuración del Software

### 1. Configurar Arduino IDE

1. **Instalar el Arduino IDE**:
   - Descárgalo desde [Arduino.cc](https://www.arduino.cc/en/Main/Software).

2. **Agregar el Gestor de Placas para ESP8266**:
   - Abre el IDE de Arduino.
   - Ve a `Archivo > Preferencias`.
   - En la sección `Additional Boards Manager URLs`, añade:
     ```
     http://arduino.esp8266.com/stable/package_esp8266com_index.json
     ```
   - Ve a `Herramientas > Placa > Gestor de Placas`.
   - Busca `esp8266` e instala el paquete.

3. **Instalar Librerías Necesarias**:
   - Ve a `Herramientas > Administrar Bibliotecas`.
   - Busca e instala las siguientes librerías:
     - `DHT sensor library` de Adafruit
     - `Adafruit Unified Sensor`
     - `PubSubClient`

4. **Código para el ESP8266**:

   Abre el IDE de Arduino y copia el siguiente código:

   ```cpp
   #include <ESP8266WiFi.h>
   #include <PubSubClient.h>
   #include <DHT.h>

   #define DHTPIN D2 // Pin donde está conectado el sensor DHT
   #define DHTTYPE DHT11 // Cambia a DHT22 si usas ese modelo

   const char* ssid = "TU_SSID"; // Tu SSID WiFi
   const char* password = "TU_PASSWORD"; // Tu contraseña WiFi
   const char* mqtt_server = "TU_DIRECCION_MQTT"; // Dirección del broker MQTT

   WiFiClient espClient;
   PubSubClient client(espClient);
   DHT dht(DHTPIN, DHTTYPE);

   void setup() {
     Serial.begin(115200);
     setup_wifi();
     client.setServer(mqtt_server, 1883);
     dht.begin();
   }

   void setup_wifi() {
     delay(10);
     Serial.println();
     Serial.print("Connecting to ");
     Serial.println(ssid);
     WiFi.begin(ssid, password);
     while (WiFi.status() != WL_CONNECTED) {
       delay(500);
       Serial.print(".");
     }
     Serial.println("");
     Serial.println("WiFi connected");
     Serial.println("IP address: ");
     Serial.println(WiFi.localIP());
   }

   void reconnect() {
     while (!client.connected()) {
       Serial.print("Attempting MQTT connection...");
       if (client.connect("ESP8266Client")) {
         Serial.println("connected");
       } else {
         Serial.print("failed, rc=");
         Serial.print(client.state());
         Serial.println(" try again in 5 seconds");
         delay(5000);
       }
     }
   }

   void loop() {
     if (!client.connected()) {
       reconnect();
     }
     client.loop();

     float h = dht.readHumidity();
     float t = dht.readTemperature();

     if (isnan(h) || isnan(t)) {
       Serial.println("Failed to read from DHT sensor!");
       return;
     }

     String payload = "Temperature: " + String(t) + "C, Humidity: " + String(h) + "%";
     client.publish("sensor/dht", (char*) payload.c_str());

     delay(2000);
   }


### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
