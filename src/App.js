// src/App.js
import React from 'react';
import './App.css';
import MqttComponent from './components/MqttComponent';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <h1>My MQTT App</h1>
          <MqttComponent />
        </header>
      </div>
  );
}

export default App;
