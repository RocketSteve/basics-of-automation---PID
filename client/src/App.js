import React, { useState, useEffect } from 'react';
import { Line  } from 'react-chartjs-2';
import './App.css';
import Slider from './Slider';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)

function App() {

    const [data, setData] = useState([{}]) 

  useEffect(() => {
    fetch("/data")
    .then(res => res.json())
    .then(data => {
      setData(data)
      console.log(data)
    });
  },[])

  const chart = {
    labels: data.x,
    datasets: [{
      data: data.y,
      backgroundColor: 'transparent',
      borderColor: '#f26c6d',
      pointBorderColor: 'transparent',
      pointBorderWidth: 4
    }]
  };
  const options = {};


  return (
    <div>
  <div style={{width: "500px", height: "500px", marinLeft: "20px"}}>

    <Line data = {chart} options = {options}></Line>

    {/*
    {(typeof data.x === 'undefined') ? (
      <p>Loading...</p>
    ) : (
      data.y.map((val, i) => (
        <p key={i}>{val}</p>
      ))
    )}
    */}
    </div>
    <div className="App">
    <Slider />
    </div>
    </div>
  );
}

export default App
