import React, { useEffect, useState } from 'react';
import mqtt from 'precompiled-mqtt';

const MQTTClient = () => {
  
  const [hasil, setHasil] = useState("");
  const [dataObj, setDataObj] = useState([]);

    // Local broker
    useEffect(()=>{
      const URL = "ws://broker.emqx.io:8083/mqtt";
      const options = {
          keepalive: 30,
          clientId: 'mqttx_46c5cf03',
          protocolId: 'MQTT',
          protocolVersion: 4,
          clean: true,
          reconnectPeriod: 1000,
          connectTimeout: 30 * 1000,
          will: {
            topic: 'bitanic',
            payload: 'koneksi',
            qos: 0,
            retain: false
          },
          rejectUnauthorized: false
        }
      
      const client = mqtt.connect(URL, options);
      
      client.on('connect', () => {
          console.log('client connected:')
          client.subscribe('bitanic', { qos: 0 })
          // client.publish('topic', 'wss secure connection demo...!', { qos: 0, retain: false })
      })
      
      client.on('message', (topic, message, packet) => {
          console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
          console.log(JSON.parse(message))
          setHasil(JSON.parse(message))
      })

      // try {
      //   const obj = JSON.parse(hasil);
      //   setDataObj(obj);
      //   console.log(dataObj.message);
      // } catch (error) {
      //   console.error('Error parsing MQTT data:', error);
      // }
      
    }, [])


    return (
      <div>
        <div class="card" style={{ width:"18rem" }}>
          <div class="card-body">
            <h5 class="card-title">{hasil.ID}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">{hasil.STATUS_MOTOR1}</h6>
            <p class="card-text">{hasil.DHT1Temp}</p>
            <a href="#" class="card-link">Card link</a>
            <a href="#" class="card-link">Another link</a>
          </div>
        </div>
    </div>
    );
};

export default MQTTClient;
