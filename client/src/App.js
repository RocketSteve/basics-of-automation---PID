import React, { useState, useEffect } from 'react';
import { Line  } from 'react-chartjs-2';
import './App.css';
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

  useEffect(() =>{
    console.log("data changed")
  }
,[data])

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

  const [value, setValue] = useState(15);
  const [value2, setValue2] = useState(10);


  const submitTarget = async () => {
    const data = {T_target : {value}}

    const result = await fetch("/data", {
      method : "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const resultJson = await result.json();
    setData(resultJson);
    console.log(resultJson)
  }

  return (
    <div class = "container">
  <div>

    <Line data = {chart} options = {options}></Line>

  
    </div>
     <input max={299} min={273} type="range" value={value} onChange={(e) => setValue(e.target.valueAsNumber)}/><p>{value}</p><br/>
     <input max={10} type="range" value={value2} onChange={(e) => setValue2(e.target.valueAsNumber)}/><p>{value2}</p><br/>

    <button type="button" onClick ={submitTarget}>Submit</button> 
    </div>
  );
}

export default App
