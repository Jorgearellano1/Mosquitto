import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MqttComponent = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const client = mqtt.connect('ws://localhost:9001'); // Conexión WebSocket

        client.on('connect', () => {
            console.log('Connected to MQTT Broker');
            client.subscribe('test/topic', (err) => {
                if (!err) {
                    console.log('Subscribed to test/topic');
                }
            });
        });

        client.on('message', (topic, message) => {
            console.log(`Topic: ${topic}, Message: ${message.toString()}`);
            setMessages((prevMessages) => [...prevMessages, message.toString()]);
        });

        return () => {
            if (client) {
                client.end();
            }
        };
    }, []);

    return (
        <div>
            <h1>MQTT Messages</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default MqttComponent;
