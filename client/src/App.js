import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import './App.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';
import {
  Button,
  Grid,
  GridColumn,
  Icon,
  Segment,
} from 'semantic-ui-react';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);
function App() {

  const [data, setData] = useState([{}]) 

  try {
    useEffect(() => {
      fetch("/data")
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setData(data)
      });
    },[])
  } catch (error) {
    console.error(error)
  }


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
  }, {
    data: data.Target,
    backgroundColor: 'transparent',
    borderColor: '#00ffff',
    pointBorderColor: 'transparent',
    pointBorderWidth: 4
  }]
};
const options = {};


  const [T_target, setTarget] = useState(293);
  const [T_start, setStart] = useState(288);
  const [T_out, setOut] = useState(273);
  const [t_i, setTi] = useState(800);
  const [t_d, setTd] = useState(7);
  const [k, setK] = useState(0.8);
  const [time, setTime] = useState(3600);
  const [t_p, setSample] = useState(60);
  const [flow, setFlow] = useState(0.005);
  const [penet, setPenet] = useState(1.7);




  const submitTarget = async () => {
    const dataSent = { 
            T_target,
            T_start,
            T_out,
            t_i,
            t_d,
            k,
            time,
            t_p,
            flow,
            penet
    }


    const result = await fetch("/data", {
      method : "POST",
      mode: "cors",
      body: JSON.stringify(dataSent),
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
      <div class = "chart">
      <Line 
        data = {chart} 
        options = {options}
        height = {"65%"}
        ></Line>
      </div>

    <Grid columns={4} doubling>
      <Grid.Column>
        <Segment>
          <h4>Zadana temperatura: {T_target - 273}ºC</h4>
            <input 
              max= {308}
              min= {273}
              defaultValue = {293}
              type="range"
              value={T_target}
              onChange={(e) => setTarget(e.target.valueAsNumber)}/></Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment>
            <h4>Temperatura poczatkowa: {T_start - 273}ºC</h4>
              <input
                min={273}
                max={303}
                type="range"
                value={T_start}
                onChange={(e) => setStart(e.target.valueAsNumber)}/>
        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment>  <h4>Temperatura zewnetrzna: {T_out - 273}ºC</h4>
     <input min={253} max={313} type="range" value={T_out} onChange={(e) => setOut(e.target.valueAsNumber)}/></Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment> <h4>Czas zdwojenia: {t_i}</h4>
     <input max={10000} min={1} type="range" value={t_i} onChange={(e) => setTi(e.target.valueAsNumber)}/></Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment> <h4>Czas wyprzedzenia: {t_d}s</h4>
     <input max={50} min={1} type="range" value={t_d} onChange={(e) => setTd(e.target.valueAsNumber)}/></Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment> <h4>Wzmocnienie regulatora: {k}</h4>
     <input max={10} min={0.1} type="range" step={0.1} value={k} onChange={(e) => setK(e.target.valueAsNumber)}/>
        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment>
          <h4>Czas symulacji: {time}s</h4>
          <input
            type = 'number'
            min = {1}
            value = {time}
            onChange={(e) => setTime(e.target.valueAsNumber)}
          />
        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment>
          <h4>Czas próbkowania: {t_p}s</h4>
          <input
            type = 'number'
            min = {1}
            value = {t_p}
            onChange={(e) => setSample(e.target.valueAsNumber)}
          />
        </Segment>
      </Grid.Column>
    </Grid>
    <Grid columns={2} doubling>
      <Grid.Column>
        <Segment> <h4>Współczynnik przepływu okna: {flow}</h4>
          <input max={0.1} min={0} type="range" step={0.001} value={flow} onChange={(e) => setFlow(e.target.valueAsNumber)}/>
        </Segment>
      </Grid.Column>
      <GridColumn>
      <Segment> <h4>Współczynnik przenikalności ścian: {penet}</h4>
          <input max={3} min={0} type="range" step={0.1} value={penet} onChange={(e) => setPenet(e.target.valueAsNumber)}/>
        </Segment>
      </GridColumn>
    </Grid>
    <Grid>
    <Button primary  type="button" onClick ={submitTarget}>
              Uruchom symulacje
            <Icon name='chevron right'/>
      </Button>
      </Segment>
      </GridColumn>
  
  
    </Grid>




    </div>
  );
}

export default App
