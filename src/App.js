import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import Chart from 'chart.js';
// import {Line} from 'react-chartjs-2';
import templogo from './components/temperature.png';
import airlogo from './components/airquality.png';
import humlogo from './components/humidity.png';
import wetfloorlogo  from './components/wetfloor.png';
import toiletfreqlogo  from './components/toiletfreq.png';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {Progress} from 'antd';

// var aa1 = [];
var avg=0;
var avg1=0;

class App extends Component {

  constructor() {
    super();
    this.state = {
      ipdate: '',
    };
  }

componentDidMount() {
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

  const dbrefctdata = firebase.database().ref().child('ctdata');
  // const dbreftdata = firebase.database().ref().child('tdata');
  const dbrefcfreq = firebase.database().ref().child('cfreq');
  const dbrefcqual = firebase.database().ref('cqual');
  dbrefcqual.on('value', cquality);
  // const dbrefprediction = firebase.database().ref().child('prediction');



  dbrefcfreq.on('value', snap => {
    this.setState({
      cfreqvalue: snap.val()['cfreq']
    });

  });

  function cquality(data) {
    var tdata = snapshotToArray(data);
    var sum=0;
    // var avg;
    // var tempdata = [];
    
    // for(var i=0; i<tdata.length; i++) {     // store copy of data in tempdata aa
    //     tempdata[i] = tdata[i];
    // }
    // console.log(tdata[0]['quality']);
    for(var i=0; i<tdata.length; i++) {
      sum = sum + tdata[i]['quality'];
    }
    console.log(avg);
    avg = sum/tdata.length;
    console.log(avg);
    

  }

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
      localStorage.setItem('humidityvaluecache' , this.state.humidityvalue);
      localStorage.setItem('temperaturevaluecache' , this.state.temperaturevalu);
      localStorage.setItem('wet1valuecache' , this.state.wet1value);
      localStorage.setItem('wet2valuecache' , this.state.wet2value);
      localStorage.setItem('waterlevelvaluecache' , this.state.waterlevelvalue);
      localStorage.setItem('datevaluecache' , this.state.datevalue);
      localStorage.setItem('cfreqvaluecache' , this.state.cfreqvalue);
      
  });   

  const dbrefprediction = firebase.database().ref('prediction');
  dbrefprediction.on('value', prediction);

  function prediction(data) {
    var tdata1 = snapshotToArray(data);
    // var airlabel = [];
    // var humlabel = [];
    // var templabel = [];
    // var wlevlabel = [];
    var alllabel = [];
    var airvalue = [];
    var humvalue = [];
    var tempvalue = [];
    var wlevvalue = [];
    var tempdata1 = [];
    
    for(var i=0; i<tdata1.length; i++) {     // store copy of data in tempdata aa
        tempdata1[i] = tdata1[i];
    }

    // console.log(tempdata1[0]);              //0-air 1-hum 2-temp 3-wlev
    for(var i=0 ; i<tempdata1.length; i++) {
        for(var j=0; j<24; j++) {
          if(i==0) {
            alllabel.push(tempdata1[i][j]['hour']);
            airvalue.push(tempdata1[i][j]['val']);
          }
          else if(i==1) {
            // alllabel.push(tempdata1[i][j]['hour']);
            humvalue.push(tempdata1[i][j]['val']);
          }
          else if(i==2) {
            // templabel.push(tempdata1[i][j]['hour']);
            tempvalue.push(tempdata1[i][j]['val']);
          }
          else if(i==3) {
            // wlevlabel.push(tempdata1[i][j]['hour']);
            wlevvalue.push(tempdata1[i][j]['val']);
          }
        
        }
    }
    predgraph(alllabel, airvalue, 'airpredcanvas', "Predicted Air Quality");
    predgraph(alllabel, humvalue, 'humpredcanvas', "Predicted Humidity");
    predgraph(alllabel, tempvalue, 'temppredcanvas', "Predicted Temperature");
    predgraph(alllabel, wlevvalue, 'wlevpredcanvas', "Predicted Water Level");
    // console.log(airlabel);
    // console.log(humlabel);
    // console.log(airvalue);
    // console.log(humvalue);

    localStorage.setItem('airpredcache',JSON.stringify(airvalue));
    localStorage.setItem('humpredcache' ,JSON.stringify(humvalue));
    localStorage.setItem('temppredcache' ,JSON.stringify(tempvalue));
    localStorage.setItem('wlevpredcache' ,JSON.stringify(wlevvalue));
    localStorage.setItem('alllabelcache' ,JSON.stringify(alllabel));
    // console.log(localStorage.getItem('airpredcache'))

      
    }
    
    function predgraph(label, value, canvas, titlelabel) {
      //console.log(airvalues);
      var airgraph = {
        type: 'line', 
        data: { 
          // labels: [1,2,3,4,5,6,7,8,9,0], 
          labels: label,
          datasets: [ 
            { 
                label: titlelabel, 
                data: value, 
                fill: false,
                borderWidth : 2,
                backgroundColor: [
                ],
                pointRadius: 1,
                pointHoverRadius: 6, //radius of point after hover
                pointBackgroundColor: 'Blue', //color of dots
                pointHoverBackgroundColor: '', //back.color of point after hover
                pointHoverBorderColor: '	#89CFF0',//color of point border after hover
                borderColor: 'white',//color of line            
             
            } 
          ] 
        }, 
        options: { 
              legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 14
                }
              },
              scales: { 
                  yAxes: [{ 
                      ticks: { 
                          // beginAtZero:true ,
                          fontColor: "	#89CFF0",
                          // color: "red"
                      } 
                  }],
                  xAxes: [{ 
                    ticks: { 
                        fontColor: "	#89CFF0",
                        beginAtZero: false,
                        // display: false 
                    } 
                }]  
              } 
          } 
      }
      var ctx = document.getElementById(canvas).getContext("2d");           //Created DOM reference to our tag for chart
      // $('#datetext').text(ipdate); 
      window.myLine = new Chart(ctx, airgraph);  
    }  

  if (!navigator.onLine) {
    this.setState({
      airqualityvalue : localStorage.getItem('airqualityvaluecache'),
      humidityvalue : localStorage.getItem('humidityvaluecache'),
      temperaturevalue : localStorage.getItem('temperaturevaluecache'),
      wet1value : localStorage.getItem('wet1valuecache'),
      wet2value : localStorage.getItem('wet2valuecache'),
      waterlevelvalue : localStorage.getItem('waterlevelvaluecache'),
      datevalue : localStorage.getItem('datevaluecache'),
      cfreqvalue : localStorage.getItem('cfreqvaluecache')
    });
    // var alllabel = JSON.parse(localStorage.getItem("alllabelcache"));
    // var airvalue = JSON.parse(localStorage.getItem("airpredcache"))
    predgraph(JSON.parse(localStorage.getItem("alllabelcache")), JSON.parse(localStorage.getItem("airpredcache")), 'airpredcanvas')
    predgraph(JSON.parse(localStorage.getItem("alllabelcache")), JSON.parse(localStorage.getItem("humpredcache")), 'humpredcanvas')
    predgraph(JSON.parse(localStorage.getItem("alllabelcache")), JSON.parse(localStorage.getItem("temppredcache")), 'temppredcanvas')
    predgraph(JSON.parse(localStorage.getItem("alllabelcache")), JSON.parse(localStorage.getItem("wlevpredcache")), 'wlevpredcanvas')
  } 
 
  function snapshotToArray(snapshot) {                                    // the snapshot is in the form id:{date: 'value', val: 'val'}
    var returnArr = [];                                                 // we can't feed the same data to the chart, we convert the 
    let i = 0;                                                          // snapshot into the Array with [{date, val, key}] formate
    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.k = i;
        returnArr.push(item);
        i++;
    });
    return returnArr;
  }


 //end of componentdidmount
}

  updateDate() {

    var ipdate = this.input.value;
    var ipdate1 = new Date(ipdate);
    var rawdate = ipdate1.getFullYear() + '-' + (ipdate1.getMonth()+1) + '-' + ipdate1.getDate() 
    ipdate = rawdate;
    // ipdate = ipdate1;

    console.log("ip date converted to ingle digti ",ipdate);

    
    function gotData(data) {
      var mydata = [];
      var airvalues = [];
      var tempvalues = [];
      var humvalues = [];
      var wlevvalues = [];
      var labelvalues = [];
      // var tempdata = [];

      var tdata = snapshotToArray(data);    // converted data to array of tdata
     
      mydata = mydatafunc(tdata, mydata);
      // console.log(mydata);

      for(var i=0; i<mydata.length; i++) {
        airvalues.push(mydata[i]['air']);
        tempvalues.push(mydata[i]['temp']);
        humvalues.push(mydata[i]['hum']);
        wlevvalues.push(mydata[i]['wlev']);
        labelvalues.push(mydata[i]['date'])
      }

      dategraph(labelvalues, airvalues, 'aircanvas', "Air Quality on Selected Date");
      dategraph(labelvalues, tempvalues, 'tempcanvas', "Temperature on Selected Date");
      dategraph(labelvalues, humvalues, 'humcanvas', "Humidity on Selected Date");
      dategraph(labelvalues, wlevvalues, 'wlevcanvas', "Water Level on Selected Date");

      //end of gotdata
    }

    function gotData1(data) {
      var mydata = [];
      var freqvalues = [];
      var labelvalues = [];
      // var tempdata = [];

      var tdata = snapshotToArray(data);    // converted data to array of aa
      
      mydata = mydatafunc(tdata, mydata);

      for(var i=0; i<mydata.length; i++) {
        labelvalues.push(mydata[i]['date']);
        freqvalues.push(mydata[i]['val']);
      }
      // console.log("Temp data date aa",tempdata1[8]['date']);
      // console.log(mydata1);

      dategraph(labelvalues, freqvalues, 'freqcanvas', "Frequency on Selected Date");
      //end of gotdata
    }

    function gotData2(data) {
      var mydata2 = [];
      var qualvalues = [];
 
      var tdata2 = snapshotToArray(data);    // converted data to array of aa

      var tempdata2 = [];
      for(var i=0; i<tdata2.length; i++) {     // store copy of data in tempdata aa
          tempdata2[i] = tdata2[i];
      }
      
      for(var i=0; i<tempdata2.length; i++) {             //storing data on date to array mydata
        tempdata2[i]['date'] = new Date(tempdata2[i]['date']);
        if(ipdate == tempdata2[i]['date'].getFullYear() + '-' + (tempdata2[i]['date'].getMonth()+1) + '-' + tempdata2[i]['date'].getDate()) {
            mydata2.push(tempdata2[i]);
        }
      }

      for(var i=0; i<tempdata2.length; i++) {
        if(ipdate == tempdata2[i]['date']) {
            mydata2.push(tempdata2[i]);
        }
      }

      for(var i=0; i<mydata2.length; i++) {
        qualvalues.push(mydata2[i]['quality']);
        // freqvalues.push(mydata1[i]['val']);
      }

      var sum=0;
      // var avg = 0;
      for(var i=0; i<qualvalues.length; i++) {
        sum = sum + qualvalues[i];
      }
      console.log(avg1);
      avg1 = sum/qualvalues.length;
      console.log(avg1);
      // console.log(tempdata2[4]['date']);
      // console.log(mydata2);
      // console.log(qualvalues);

      // freqgraph(aalabelvalues, freqvalues);

    
      //end of gotdata
    }
    

    function snapshotToArray(snapshot) {                                    // the snapshot is in the form id:{date: 'value', val: 'val'}
      var returnArr = [];                                                 // we can't feed the same data to the chart, we convert the 
      let i = 0;                                                          // snapshot into the Array with [{date, val, key}] formate
      snapshot.forEach(function(childSnapshot) {
          var item = childSnapshot.val();
          item.k = i;
          returnArr.push(item);
          i++;
      });
      return returnArr;
  }
  
    function errData(err){
      console.log(err);
    }

    function dategraph(labelvalues, airvalues, canvas, label) {
      //console.log(airvalues);
      var airgraph = {
        type: 'line', 
        data: { 
          // labels: [1,2,3,4,5,6,7,8,9,0], 
          labels: labelvalues,
          datasets: [ 
            { 
                label: label, 
                data: airvalues, 
                fill: false,
                borderWidth : 2,
                backgroundColor: [
                ],
                pointRadius: 1,
                pointHoverRadius: 5, //radius of point after hover
                pointBackgroundColor: 'black', //color of dots
                pointHoverBackgroundColor: '', //back.color of point after hover
                pointHoverBorderColor: '	#89CFF0',//color of point border after hover
                borderColor: 'white',//color of line            
             
            } 
          ] 
        }, 
        options: { 
          legend: {
            labels: {
                fontColor: "white",
                fontSize: 14
            }
          }, 
              scales: { 
                yAxes: [{ 
                  ticks: { 
                      beginAtZero:true ,
                      fontColor: "	#89CFF0",
                      // color: "red"
                  } 
              }],
                  xAxes: [{ 
                    ticks: { 
                        display: false 
                    } 
                }]  
              } 
          } 
      }
      var ctx = document.getElementById(canvas).getContext("2d");           //Created DOM reference to our tag for chart
      // $('#datetext').text(ipdate); 
      window.myLine = new Chart(ctx, airgraph);  
    }

    function mydatafunc(tdata, mydata) {
      for(var i=0; i<tdata.length; i++) {             //storing data on date to array mydata
        tdata[i]['date'] = new Date(tdata[i]['date']);
        if(ipdate == tdata[i]['date'].getFullYear() + '-' + (tdata[i]['date'].getMonth()+1) + '-' + tdata[i]['date'].getDate()) {
            mydata.push(tdata[i]);
        }
      }
      return mydata;
    }

    var ref = firebase.database().ref('tdata');
    ref.on('value', gotData, errData);

    var ref1 = firebase.database().ref('aa');
    ref1.on('value', gotData1, errData);

    var ref2 = firebase.database().ref('cqual');
    ref2.on('value', gotData2, errData);

  //end of upatdate
  }



  render() {
    const mystyle = {
      height: this.state.waterlevelvalue + '%',

    };

    return (      
        <div className="App">
          <h2>  Today's Date : {this.state.datevalue}  </h2><br></br>

          {/* Select Date : <input type="date" value={this.state.ipdate} onChange={this.updateDate.bind(this)} /> */}
          Select Date : <input type="date" ref={(input) => this.input = input} onChange={this.updateDate.bind(this)} />

            <div class="container">

              <div id="air"> 
                {/* <div class="text"> 
                  <span> Air Quality : {this.state.airqualityvalue} </span>  
                </div>   */}
                <div id="airdash">
                  <Progress type="dashboard" strokeLinecap="{square}" strokeColor="grey" percent={this.state.airqualityvalue} />
                </div>
              </div>  <br></br>
              
              <div id="temp">  
                {/* <div class="text">
                  <span> Current Temperature : {this.state.temperaturevalue} </span>  
                </div>   */}
                <div class="tempdash">
                  <Progress type="dashboard" strokeLinecap="{square}" strokeColor="orange" percent={this.state.temperaturevalue} />
                </div>
              </div><br></br>
              
              <div id="hum">      
                {/* <div class="text"> 
                  <span> Current Humidity : {this.state.humidityvalue} </span>    
                </div> */}
                <div class="humdash">
                  <Progress type="dashboard" strokeLinecap="{square}" strokeColor="green" percent={this.state.humidityvalue} />             
                </div>

              </div><br></br>
              
              <div id="tank">
                {/* <div class="text">
                  <span >Water Present in Tank : {this.state.waterlevelvalue}% </span>
                </div> */}
                <div class="watercircle"> 
                  <Progress type="circle" strokeLinecap="{square}" percent={this.state.waterlevelvalue} />
                </div> <br></br>
              </div> <br></br>
              
              <div id="freq">
                {/* <div class="text">
                  Currently Using : {this.state.cfreqvalue}
                </div> */}
                <div class="freqdash">
                <Progress type="dashboard" strokeLinecap="{square}" strokeColor="red" percent={this.state.cfreqvalue} />             
                </div>
              </div>    <br></br>

              <div id="wet">  
                <div class="text">
                  Wet Floor 1: {this.state.wet1value} <br></br>
                  Wet Floor 2: {this.state.wet2value}
                </div>
              </div><br></br>
              
              <div class="cleanerquality">
                <div class="text">
                  <span> Cleaner's Quality : {avg}</span> 
                </div>
                <div id="">

                </div>  
              </div>
              <br></br> <br></br>

              <div class="prediction-graph">
                <div> <canvas id="airpredcanvas"  /> </div>
                <div> <canvas id="temppredcanvas" /> </div>
                <div> <canvas id="humpredcanvas"  /> </div>
                <div> <canvas id="wlevpredcanvas" /> </div>
              </div>

              <div class="date-graph">
                <div> <canvas id="aircanvas" hidden  /> </div>
                <div> <canvas id="tempcanvas" hidden /> </div>
                <div> <canvas id="humcanvas"  hidden /> </div>
                <div> <canvas id="wlevcanvas" hidden /> </div>
                <div> <canvas id="freqcanvas" hidden /> </div>
              </div>

         
            </div> {/*closing container*/}

        </div>   
        
    );

    }
}

export default App;