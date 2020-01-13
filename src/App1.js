import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import Chart from 'chart.js';

// var Chart = require("chart.js");
class App extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

componentDidMount() {
  const node = this.node;
  const ctx = this.ctx;
  const ctx1 = this.ctx1;
  // var myChart = this.myChart;
  navigator.serviceWorker.register('sw.js');

  function showNotification() {
  Notification.requestPermission(function(result) {
    console.log('Notification permission status inside show notification:', result);
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(function(registration) {
        
        registration.showNotification('Air Quality is good :)');
      });
    }
  });
  }
  
  function showNotification1() {
  Notification.requestPermission(function(result) {
    console.log('Notification permission status inside show notification1:', result);
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(function(registration) {
        
        registration.showNotification('Air Quality is tooo less.....');
      });
    }
  });
  }
  
  // function showgraph(labels, values) {
  //   var myChart = new Chart(node, {
  //     type: "line",
  //     data: {
  //       labels: labels,
  //      // labels: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
  //       datasets: [
  //         {
  //           label: "daily usage",
  //           // data: [d1,d2, d3, d4, d5, d6, d7],
  //           data: values,
  //           fill: false,
  //           borderColor: '#2c404c',

  //           // data: ['1','2'],
  //           backgroundColor: '#2c404c'
  //         }
  //       ]
  //     },
  //     options: {
  //       responsive: true,
  //       title: {
  //         // display: true,
  //         // text:    "Daily Usage"
  //       },
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             fontColor: 'darkgrey'
  //           }
  //         }],
  //         xAxes: [{
  //           ticks: {
  //             fontColor: 'darkgrey'
  //           }
  //         }]
  //       }
  //     }
  //   });

  // }


    // const dbrefdata = firebase.database().ref().child('data'); // for storing value
    const dbrefctdata = firebase.database().ref().child('ctdata');
    // const dbrefairqualityvalue = dbrefairquality.child('airqualityvalue');
    // const dbreffrequency = firebase.database().ref().child('frequency');
    var datam= [];

    // dbrefdata.on('value', snap => { 
    //   var labels = snap.val().map(function(e) {
    //     return e.label;
    //   });

    //   var values = snap.val().map(function(e) {
    //     return e.value;
    //   });
      
    //   for(var i=1; i<labels.length; i++) {
    //     datam[i] = values[i];
    //   }
    //   // console.log(datam)

    //   values.shift();
    //   labels.shift();

    //   localStorage.setItem('datacachevalues', JSON.stringify(values));
    //   console.log(values);
    //   console.log(localStorage.getItem('datacachevalues'));
    //   localStorage.setItem('datacachelabels', JSON.stringify(labels));
    //   console.log(labels);
    //   console.log(localStorage.getItem('datacachelabels'));
    //   // console.log(localStorage.getItem('datacachevalues'));
    //   // console.log(localStorage.getItem('datacachelabels'));
    // });
    
    // window.addEventListener("load", getData(genFunction));
    // function getData(callbackIN) {
    // var ref = firebase.database().ref().child('data');

    // ref.on('value', function (snapshot) {
    // callbackIN(snapshot.val())
    // });
    // }

    // function genFunction(data) {     

    //   // console.log(data);
      
    //     var labels = data.map(function(e) {
    //       return e.label;
    //     });

    //     var values= data.map(function(e) {
    //       return e.value;
    //     });

    //     labels.shift();
    //     values.shift();

    //     // console.log(labels);
    //     // console.log(value);

    //   // showgraph(data1['monday'], data1['tuesday'], data1['wednesday'], data1['thursday'], data1['friday'], data1['saturday'], data1['sunday']);
      
      
    //   showgraph(labels, values);
   
    // }

    dbrefctdata.on('value', snap => { 
      this.setState({
        airqualityvalue: snap.val()['air'],
        humidityvalue: snap.val()['hum'],
        temperaturevalue: snap.val()['temp'],
        wet1value: snap.val()['wet1'],
        wet2value: snap.val()['wet2'],
        waterlevelvalue: snap.val()['wlev'],
        datevalue: snap.val()['date']
      });
      if(this.state.airqualityvalue < 29){
        showNotification();
        console.log("This is if statement less than 29");
      }
      else{        
        showNotification1();
        console.log("This is else statemenet moret han 29");
      }
      localStorage.setItem('airqualityvaluecache', this.state.airqualityvalue);
    });

    // dbreffrequency.on('value', snap => { 
    //   this.setState({
    //     curusing: snap.val()['currentusing'],
    //     tusage: snap.val()['totalusage']
    //   });
    //   localStorage.setItem('curusingcache', this.state.curusing);
    //   localStorage.setItem('tusagecache', this.state.tusage);
    // });

    if (!navigator.onLine) {
      this.setState({
        airqualityvalue : localStorage.getItem('airqualityvaluecache'),
    
        // curusing : localStorage.getItem('curusingcache'),
        // tusage: localStorage.getItem('tusagecache')
      });

      // var rawlabels = JSON.parse(localStorage.getItem('datacachelabels'));
      // var rawvalues = JSON.parse(localStorage.getItem('datacachevalues'));
      

      // showgraph(rawlabels, rawvalues);
    } 
  //end of componentdidmount
}

  render() {
    // var airqualityvalue1 = this.s;
    const mystyle = {
      height: this.state.airqualityvalue + '%',
      // height: '500px'
    };
    return (      
        <div className="App">
          <h1>
             Air Quality (in %) : {this.state.airqualityvalue} <br></br>
             {/* Currently Using    : {this.state.curusing} <br></br>
             Total Usage        : {this.state.tusage}   <br></br> */}
          </h1>
          {/* <canvas
            // style={{ width: 800, height: 300 }}
            ref={node => (this.node = node)}
          /> */}
{/* 
          <canvas
            style={{ width: 800, height: 300 }}
            ref={ctx => (this.ctx = ctx)}
          />
          <canvas
            style={{ width: 800, height: 300 }}
            ref={ctx1 => (this.ctx1 = ctx1)}
          />           */}

          <div id="page-wrap">
            <div class="meter">
              <span style={mystyle}>
                {/* <h4>Water Level</h4> */}
              </span>
            </div>
          </div>

        </div>   
        

    );

    }
}

export default App;