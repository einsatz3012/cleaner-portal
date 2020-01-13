import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import Chart from 'chart.js';
// import Chart from './components/Chart'

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

function showgraph(d1, d2, d3, d4, d5, d6, d7) {
  var myChart = new Chart(node, {
    type: "bar",
    data: {
      labels: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
      datasets: [
        {
          label: "daily usage",
          // data: [data1['monday'], data1['tuesday'], data1['wednesday'], data1['thursday'], data1['friday'], data1['saturday'], data1['sunday']],
          data: [d1,d2, d3, d4, d5, d6, d7],
          backgroundColor: [
            // "rgba(255, 99, 132, 0.2)",
            // "rgba(54, 162, 235, 0.2)",
            // "rgba(255, 206, 86, 1)"
          ]
        }
      ]
    }
  });
}
    
function showdoughnut(aqv) {
  var myChart = new Chart(ctx, {
    // type: 'line',
    // data: {
    //   labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
    //   datasets: [{ 
    //       data: [86,114,106,106,107,111,133,221,783,2478],
    //       label: "Africa",
    //       borderColor: "#3e95cd",
    //       fill: false
    //     }]
    // },
    // options: {
    //   title: {
    //     display: true,
    //     text: 'World population per region (in millions)'
    //   }
    // }

    type: 'doughnut',
    data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [{
        label: "Population (millions)",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: [2478,5267,734,784,433]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }
    }
  });
}
 
function showdoughnut1(aqv) {
  var myChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
      datasets: [{ 
          data: [86,114,106,106,107,111,133,221,783,2478],
          label: "Africa",
          borderColor: "#3e95cd",
          fill: false
        }]
    },
    options: {
      title: {
        display: true,
        text: 'World population per region (in millions)'
      }
    }

    // type: 'doughnut',
    // data: {
    //   labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
    //   datasets: [{
    //     label: "Population (millions)",
    //     backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
    //     data: [2478,5267,734,784,433]
    //   }]
    // },
    // options: {
    //   title: {
    //     display: true,
    //     text: 'Predicted world population (millions) in 2050'
    //   }
    // }
  });
}






    const dbrefdata1 = firebase.database().ref().child('data1');
    const dbrefairquality = firebase.database().ref().child('airquality');
    const dbrefairqualityvalue = dbrefairquality.child('airqualityvalue');
    const dbreffrequency = firebase.database().ref().child('frequency');
    
    dbrefdata1.on('value', snap => { 
      this.setState({
        datam1: snap.val()['monday'],
        datam2: snap.val()['tuesday'],
        datam3: snap.val()['wednesday'],
        datam4: snap.val()['thursday'],
        datam5: snap.val()['friday'],
        datam6: snap.val()['saturday'],
        datam7: snap.val()['sunday']
      });

      localStorage.setItem('datacache1', this.state.datam1);
      localStorage.setItem('datacache2', this.state.datam2);
      localStorage.setItem('datacache3', this.state.datam3);
      localStorage.setItem('datacache4', this.state.datam4);
      localStorage.setItem('datacache5', this.state.datam5);
      localStorage.setItem('datacache6', this.state.datam6);
      localStorage.setItem('datacache7', this.state.datam7);

    });
    
    window.addEventListener("load", getData(genFunction));
    function getData(callbackIN) {
    var ref = firebase.database().ref().child('data1');

    ref.on('value', function (snapshot) {
    callbackIN(snapshot.val())
    });
    }

    function genFunction(data1) {

      // var myChart = new Chart(node, {
      //   type: "bar",
      //   data: {
      //     labels: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
      //     datasets: [
      //       {
      //         label: "daily usage",
      //         data: [data1['monday'], data1['tuesday'], data1['wednesday'], data1['thursday'], data1['friday'], data1['saturday'], data1['sunday']],
      //         backgroundColor: [
      //           // "rgba(255, 99, 132, 0.2)",
      //           // "rgba(54, 162, 235, 0.2)",
      //           // "rgba(255, 206, 86, 1)"
      //         ]
      //       }
      //     ]
      //   }
      // });
      showgraph(data1['monday'], data1['tuesday'], data1['wednesday'], data1['thursday'], data1['friday'], data1['saturday'], data1['sunday']);
    }

    dbrefairqualityvalue.on('value', snap => { 
      this.setState({
        airqualityvalue: snap.val(),
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
      showdoughnut(this.state.airqualityvalue);
      showdoughnut1(this.state.airqualityvalue);
    });

    dbreffrequency.on('value', snap => { 
      this.setState({
        curusing: snap.val()['currentusing'],
        tusage: snap.val()['totalusage']
      });
      localStorage.setItem('curusingcache', this.state.curusing);
      localStorage.setItem('tusagecache', this.state.tusage);
    });

    if (!navigator.onLine) {
      this.setState({
        airqualityvalue : localStorage.getItem('airqualityvaluecache'),
        curusing : localStorage.getItem('curusingcache'),
        tusage: localStorage.getItem('tusagecache')
        // datam1: localStorage.getItem('datacache1' ),
        // datam2: localStorage.getItem('datacache2') ,
        // datam3: localStorage.getItem('datacache3') ,
        // datam4: localStorage.getItem('datacache4') ,
        // datam5: localStorage.getItem('datacache5') ,
        // datam6: localStorage.getItem('datacache6') ,
        // datam7: localStorage.getItem('datacache7') 
      });

      // var myChart = new Chart(node, {
      //   type: "bar",
      //   data: {
      //     labels: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
      //     datasets: [
      //       {
      //         label: "daily usage",
      //         data: [localStorage.getItem('datacache1'), localStorage.getItem('datacache2'), localStorage.getItem('datacache3'), localStorage.getItem('datacache4'), localStorage.getItem('datacache5'), localStorage.getItem('datacache6'), localStorage.getItem('datacache7')],
      //         // data: [5,9,5,7,6,2,3],
      //         backgroundColor: [
      //           // "rgba(255, 99, 132, 0.2)",
      //           // "rgba(54, 162, 235, 0.2)",
      //           // "rgba(255, 206, 86, 1)"
      //         ]
      //       }
      //     ]
      //   }
      // });
      showgraph(localStorage.getItem('datacache1'), localStorage.getItem('datacache2'), localStorage.getItem('datacache3'), localStorage.getItem('datacache4'), localStorage.getItem('datacache5'), localStorage.getItem('datacache6'), localStorage.getItem('datacache7'))
//end of navigator
    } 
  //end of componentdidmount
 
}


  render() {
    return (      
        <div className="App">
          <h1>
             Air Quality (in %) : {this.state.airqualityvalue} <br></br>
             Currently Using    : {this.state.curusing} <br></br>
             Total Usage        : {this.state.tusage}   <br></br>
          </h1>
          <canvas
            style={{ width: 800, height: 300 }}
            ref={node => (this.node = node)}
          // ref={ctx => (this.ctx = ctx)}
          />

          <canvas
            style={{ width: 800, height: 300 }}
            ref={ctx => (this.ctx = ctx)}
          />
          <canvas
            style={{ width: 800, height: 300 }}
            ref={ctx1 => (this.ctx1 = ctx1)}
          />

          

        </div>   
    );

    }
}

export default App;