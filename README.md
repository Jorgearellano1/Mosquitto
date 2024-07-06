# Mosquitto MQTT Project

Este proyecto utiliza Mosquitto MQTT para la visualización de datos en tiempo real de sensores, conectados a una aplicación frontend construida con React.

## Requisitos

- **Mosquitto MQTT Broker**
- **ESP8266 (NodeMCU o Wemos D1 Mini)**
- **Sensor DHT11**
- **Arduino IDE**
- **Node.js y npm**
- **Git**

### Conexión del Hardware

1. **Conectar el Sensor DHT11 al ESP8266**:
   - **VCC** del DHT11 a **3.3V** en el ESP8266: Conecta el pin de voltaje (VCC) del sensor DHT11 al pin de 3.3V en el ESP8266 para alimentarlo.
   - **GND** del DHT11 a **GND** en el ESP8266: Conecta el pin de tierra (GND) del sensor DHT11 al pin de tierra en el ESP8266 para completar el circuito eléctrico.
   - **Data** del DHT11 al pin **D2** (GPIO4) en el ESP8266: Conecta el pin de datos (Data) del sensor DHT11 al pin D2 (GPIO4) en el ESP8266 para la transmisión de datos.

### Configuración del Software

#### 1. Instalar y Configurar Mosquitto

1. **Instalar Mosquitto**:
   - En una terminal, ejecuta:
     ```sh
     sudo apt-get update
     sudo apt-get install mosquitto mosquitto-clients
     ```

2. **Iniciar el servicio de Mosquitto**:
   - Inicia el servicio con el comando:
     ```sh
     sudo systemctl start mosquitto
     ```

3. **Habilitar el servicio de Mosquitto al iniciar el sistema**:
   - Ejecuta:
     ```sh
     sudo systemctl enable mosquitto
     ```

#### 2. Configurar Arduino IDE

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

   #define DHTPIN D2 
   #define DHTTYPE DHT11 
   const char* ssid = "TU_SSID";
   const char* password = "TU_PASSWORD"; 
   const char* mqtt_server = "TU_DIRECCION_MQTT";

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
5.**Pruebas de Publicacion de Datos Temperatura con Mosquitto**:
     ```
     mosquitto_pub -h localhost -t sensor/temperature -m "22.5"
     mosquitto_pub -h localhost -t sensor/humidity -m "55"
     mosquitto_pub -h localhost -t sensor/temperature -m "23.7"
     mosquitto_pub -h localhost -t sensor/humidity -m "60"
     ```
6.**Estructura (BORRADOR)**:
/src
  /components
    Footer.js
    Header.js
    MqttComponent.js
    SensorCard.js
    SensorGrid.js
    Thermometer.js
  /styles
    App.css
    Footer.css
    Header.css
    MqttComponent.css
    SensorCard.css
    SensorGrid.css
    Thermometer.css
  App.js
  index.js
  index.css





