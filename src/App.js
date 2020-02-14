import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import Chart from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Progress } from 'reactstrap';
import {Line} from 'rc-progress';
import 'bootstrap/dist/css/bootstrap.min.css';

var avg=0;

class App extends Component {

  constructor() {
    super();
    this.state = {
      ipdate: '',
      tid: '',
      buttonSelected: ''
    };
  }


  // componentDidMount() { 
  // }

  handleClick() {

    this.setState({
      buttonSelected:'1'
    })
    navigator.serviceWorker.register('sw.js');

    var reftoilet = firebase.database().ref("toilet");
    reftoilet.on('value', gotToilet, errData)

    var tid = this.input1.value;
    var ipdate = this.input.value;
    console.log(tid);
    console.log(ipdate);
    
    var refcfreq = firebase.database().ref(tid).child('cfreq');       // current frequency
    refcfreq.on('value', snap => {
      this.setState({
        cfreqvalue: snap.val()['cfreq']
      });
      console.log("Currently using",this.state.cfreqvalue)          //done
    });
    
    var refcqual = firebase.database().ref(tid).child('cqual');       // cleaner qualit
    refcqual.on('value', gotCqual, errData);
    
    var refctdata = firebase.database().ref(tid).child('ctdata');     // current sensor data
    refctdata.on('value', snap => {
      if( (snap.val()['wet1'] == 1) || (snap.val()['wet2'] == 1) ) {
        this.setState({
          wetfloor: 'Yes'
        })
      } 
      else {
        this.setState({
          wetfloor: 'No'
        })
      }
      this.setState({
        airqualityvalue: snap.val()['air'],
        humidityvalue: snap.val()['hum'],
        temperaturevalue: snap.val()['temp'],
        waterlevelvalue: snap.val()['wlev'],
        datevalue: snap.val()['date']
      });
      if(this.state.airqualityvalue > 5){
        showAirQualityNotification1();
        // showAirQualityNotification();
        // console.log("This is if statement less than 29");
      }
 
      if( (snap.val()['wet1'] == 1) && (snap.val()['wet2'] == 1) ) {
        showWetFloorNotification();
      } 

      if((((17 - this.state.waterlevelvalue)/this.state.waterlevelvalue)*100) <= 10) {
        showWaterLevelNotification();
      } 
      // else{
      //   // showWaterLevelNotification1();
      // }


      localStorage.setItem('airqualityvaluecache', this.state.airqualityvalue);
      localStorage.setItem('humidityvaluecache' , this.state.humidityvalue);
      localStorage.setItem('temperaturevaluecache' , this.state.temperaturevalue);
      localStorage.setItem('wetfloorcache' , this.state.wetfloor);
      localStorage.setItem('waterlevelvaluecache' , this.state.waterlevelvalue);
      localStorage.setItem('datevaluecache' , this.state.datevalue);
      localStorage.setItem('cfreqvaluecache' , this.state.cfreqvalue);
      
    });  
        
    var reffreq = firebase.database().ref(tid).child('freq');     // freq data
    reffreq.on('value', gotFreq, errData);
    
    var refprediction = firebase.database().ref(tid).child('prediction');     // predicted data
    refprediction.on('value', gotPrediction, errData);

    var reftdata = firebase.database().ref(tid).child('tdata');  // toilet data
    reftdata.on('value', gottData, errData);
    
    var refsoapdata = firebase.database().ref(tid).child('soap');  // soap
    refsoapdata.on('value', snap=>{
      console.log(snap.val());
      this.setState({
        soapvalue: snap.val()
      });
    });
 
    function gotToilet(data) {
      // console.log(data);
      var tid1= [];
      var limit= [];
      var limitoa= [];
      var result= [];
      // var maxLimit1 ;
      var tdata = snapshotToArray(data);
      // console.log(tdata);
      for(var i=0; i<tdata.length; i++) {
        tid1.push(tdata[i]['tid']);
        // limit.push(tdata[i]['maxLimit'])
      }
      
        for (var i = 0; i < tid1.length; ++i) {          
          result.push({tid: tid1[i], limit: limit[i]}) 
        }
      console.log(tid)

      // for (var i=0 ; i<result.length; i++) {
      //   if(tid == result[i]['tid']) {
      //     // console.log("MAXLIMIT : ", result[i]['limit'])
      //     // maxLimit1 = result[i]['limit'];
      //     console.log(maxLimit1);
      //   }
      // }
    }

    function gotCqual(data) {
      var tdata = snapshotToArray(data);
      var sum=0;
  
      for(var i=0; i<tdata.length; i++) {
        sum = sum + tdata[i]['quality'];
      }
      // console.log(avg);
      avg = sum/tdata.length;

      console.log("Average Cleaner Quality",avg)        //done
  
      localStorage.setItem('cqualcache', avg);
    }

    function gotFreq(data) {
      var ipdate1 = new Date(ipdate);
      var rawdate = ipdate1.getFullYear() + '-' + (ipdate1.getMonth()+1) + '-' + ipdate1.getDate() 
      ipdate = rawdate;

      var tdata = snapshotToArray(data);

      var mydata = [];
      var freqvalues = [];
      var labelvalues = [];

      var tdata = snapshotToArray(data);    // converted data to array of aa
      
      mydata = mydatafunc(tdata, mydata);

      for(var i=0; i<mydata.length; i++) {
        labelvalues.push(mydata[i]['date']);
        freqvalues.push(mydata[i]['freq']);
      }
      console.log("Frequency of date : ",freqvalues);
      dategraph(labelvalues, freqvalues, 'freqcanvas', "Frequency on " + ipdate);   
      
      function dategraph(labelvalues, freqvalues, canvas, label) {
        //console.log(airvalues);
        var airgraph = {
          type: 'line', 
          data: { 
            // labels: [1,2,3,4,5,6,7,8,9,0], 
            labels: labelvalues,
            datasets: [ 
              { 
                  label: label, 
                  data: freqvalues, 
                  fill: false,
                  borderWidth : 2,
                  backgroundColor: [
                  ],
                  pointRadius: 1,
                  pointHoverRadius: 5, //radius of point after hover
                  pointBackgroundColor: 'black', //color of dots
                  pointHoverBackgroundColor: '', //back.color of point after hover
                  pointHoverBorderColor: '	#89CFF0',//color of point border after hover
                  borderColor: 'darkgrey',//color of line            
               
              } 
            ] 
          }, 
          options: { 
            legend: {
              labels: {
                  fontColor: "darkgrey",
                  fontSize: 14
              }
            }, 
                scales: { 
                  yAxes: [{ 
                    color: "orange",
  
                    ticks: { 
                        beginAtZero:true ,
                        fontColor: "black",
                        // color: 'white'
                        
                        
                    } 
                }],
                    xAxes: [{ 
                      color: "orange",
                      ticks: { 
                          display: false, 
                          
  
                      } 
                  }]  
                } 
            } 
        }
        var ctx = document.getElementById(canvas).getContext("2d");           //Created DOM reference to our tag for chart
        // $('#datetext').text(ipdate); 
        window.myLine = new Chart(ctx, airgraph);  
      }

    } 

    function gotPrediction(data) {
      var tdata1 = snapshotToArray(data);
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
      predgraph(alllabel, airvalue, 'airpredcanvas', "Predicted Air Quality of Next 24 hours");
      predgraph(alllabel, humvalue, 'humpredcanvas', "Predicted Humidity of Next 24 hours");
      predgraph(alllabel, tempvalue, 'temppredcanvas', "Predicted Temperature of Next 24 hours");
      predgraph(alllabel, wlevvalue, 'wlevpredcanvas', "Predicted Water Level of Next 24 hours");
      // console.log(airlabel);
      // console.log(humlabel);
      // console.log(airvalue);
      // console.log(humvalue);
  
      localStorage.setItem('airpredcache',JSON.stringify(airvalue));
      localStorage.setItem('humpredcache' ,JSON.stringify(humvalue));
      localStorage.setItem('temppredcache' ,JSON.stringify(tempvalue));
      localStorage.setItem('wlevpredcache' ,JSON.stringify(wlevvalue));
      localStorage.setItem('alllabelcache' ,JSON.stringify(alllabel));
    }

    function gottData(data) {
      var ipdate1 = new Date(ipdate);
      var rawdate = ipdate1.getFullYear() + '-' + (ipdate1.getMonth()+1) + '-' + ipdate1.getDate() 
      ipdate = rawdate;
      
      // console.log("ip date converted to ingle digti ",ipdate);
      var tdata = snapshotToArray(data);
      
      var mydata = [];
      var airvalues = [];
      var tempvalues = [];
      var humvalues = [];
      var wlevvalues = [];
      var labelvalues = [];
      
      mydata = mydatafunc(tdata, mydata);
      // console.log(mydata);                    
      for(var i=0; i<mydata.length; i++) {
        airvalues.push(mydata[i]['air']);
        tempvalues.push(mydata[i]['temp']);
        humvalues.push(mydata[i]['hum']);
        wlevvalues.push(mydata[i]['wlev']);
        labelvalues.push(mydata[i]['date'])
      }

      dategraph(labelvalues, airvalues, 'aircanvas', "Air Quality on " + ipdate);
      dategraph(labelvalues, tempvalues, 'tempcanvas', "Temperature on " + ipdate);
      dategraph(labelvalues, humvalues, 'humcanvas', "Humidity on " + ipdate);
      dategraph(labelvalues, wlevvalues, 'wlevcanvas', "Water Level on " + ipdate);


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
                  borderColor: 'darkgrey',//color of line            
               
              } 
            ] 
          }, 
          options: { 
            legend: {
              labels: {
                  fontColor: "darkgrey",
                  fontSize: 14
              }
            }, 
                scales: { 
                  yAxes: [{ 
                    color: "orange",
  
                    ticks: { 
                        beginAtZero:true ,
                        fontColor: "black",
                        // color: 'white'
                        
                        
                    } 
                }],
                    xAxes: [{ 
                      color: "orange",
                      ticks: { 
                          display: false, 
                          
  
                      } 
                  }]  
                } 
            } 
        }
        var ctx = document.getElementById(canvas).getContext("2d");           //Created DOM reference to our tag for chart
        // $('#datetext').text(ipdate); 
        window.myLine = new Chart(ctx, airgraph);  
      }

      
    }

    // function showAirQualityNotification() {
    //   Notification.requestPermission(function(result) {
    //     console.log('Notification permission status inside show notification:', result);
    //     if (result === 'granted') {
    //       navigator.serviceWorker.ready.then(function(registration) {
            
    //         registration.showNotification('Air Quality is good :)');
    //       });
    //     }
    //   });
    // }
      
    function showAirQualityNotification1() {
      Notification.requestPermission(function(result) {
        console.log('Notification permission status inside show notification1:', result);
        if (result === 'granted') {
          navigator.serviceWorker.ready.then(function(registration) {
            
            registration.showNotification('Air Quality is tooo less :(');
          });
        }
      });
    }

    function showWaterLevelNotification() {
      Notification.requestPermission(function(result) {
        console.log('Notification permission status inside show notification:', result);
        if (result === 'granted') {
          navigator.serviceWorker.ready.then(function(registration) {

          registration.showNotification('Tank Running Empty :(');
          });
        }
      });
    }
      
    //   function showWaterLevelNotification1() {
    //   Notification.requestPermission(function(result) {
    //     console.log('Notification permission status inside show notification1:', result);
    //     if (result === 'granted') {
    //       navigator.serviceWorker.ready.then(function(registration) {
    //       registration.showNotification('There is Water :)');
            
    //       });
    //     }
    //   });
    // }

    function showWetFloorNotification() {
      Notification.requestPermission(function(result) {
        console.log('Notification permission status inside show notification:', result);
        if (result === 'granted') {
          navigator.serviceWorker.ready.then(function(registration) {
            
            registration.showNotification('There is Water Clogging :(');
          });
        }
      });
    }
      
    //   function showWetFloorNotification1() {
    //   Notification.requestPermission(function(result) {
    //     console.log('Notification permission status inside show notification1:', result);
    //     if (result === 'granted') {
    //       navigator.serviceWorker.ready.then(function(registration) {
            
    //         registration.showNotification('There is No Water Clogging :)');
    //       });
    //     }
    //   });
    // }

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

    function mydatafunc(tdata, mydata) {
      for(var i=0; i<tdata.length; i++) {             //storing data on date to array mydata
        tdata[i]['date'] = new Date(tdata[i]['date']);
        if(ipdate == tdata[i]['date'].getFullYear() + '-' + (tdata[i]['date'].getMonth()+1) + '-' + tdata[i]['date'].getDate()) {
            mydata.push(tdata[i]);
        }
      }
      return mydata;
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
                borderColor: 'darkgrey',//color of line            
             
            } 
          ] 
        }, 
        options: {
          responsive: true,
          // maintainAspectRatio: false,
              legend: {
                labels: {
                    fontColor: "darkgrey",
                    fontSize: 14
                }
              },
              scales: { 
                  yAxes: [{ 
                      ticks: { 
                          // beginAtZero:true ,
                          fontColor: "black",
                          
                      } ,
                      gridLines: {
                        // display: false
                      }
                  }],
                  xAxes: [{ 
                    ticks: { 
                        fontColor: "black",
                        beginAtZero: false,
                        // display: false 
                        
                    } ,
                    gridLines: {
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
                borderColor: 'darkgrey',//color of line            
             
            } 
          ] 
        }, 
        options: {
          responsive: true,
          // maintainAspectRatio: false,
          legend: {
            labels: {
                fontColor: "darkgrey",
                fontSize: 14
            }
          }, 
          
          scales: { 
            yAxes: [{ 
              color: "orange",
              ticks: { 
                beginAtZero:true ,
                fontColor: "black",                 
              } ,
              gridLines: {
                display: false
              }
            }],
            
            xAxes: [{ 
              color: "orange",
              ticks: { 
                display: false,        
              },
              gridLines: {
                display: false
              }
            }]  
            },
               
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
        // wet1value : localStorage.getItem('wet1valuecache'),
        // wet2value : localStorage.getItem('wet2valuecache'),
        wetfloor : localStorage.getItem('wetfloorcache'),
        waterlevelvalue : localStorage.getItem('waterlevelvaluecache'),
        datevalue : localStorage.getItem('datevaluecache'),
        cfreqvalue : localStorage.getItem('cfreqvaluecache'),
      });
      avg = localStorage.getItem('cqualcache')
      // var alllabel = JSON.parse(localStorage.getItem("alllabelcache"));
      // var airvalue = JSON.parse(localStorage.getItem("airpredcache"))
      predgraph(JSON.parse(localStorage.getItem("alllabelcache")), JSON.parse(localStorage.getItem("airpredcache")), 'airpredcanvas', 'Predicted Air Quality of Next 24 hours')
      predgraph(JSON.parse(localStorage.getItem("alllabelcache")), JSON.parse(localStorage.getItem("humpredcache")), 'humpredcanvas', 'Predicted Air Humidity of Next 24 hours')
      predgraph(JSON.parse(localStorage.getItem("alllabelcache")), JSON.parse(localStorage.getItem("temppredcache")), 'temppredcanvas', 'Predicted Temperature of Next 24 hours')
      predgraph(JSON.parse(localStorage.getItem("alllabelcache")), JSON.parse(localStorage.getItem("wlevpredcache")), 'wlevpredcanvas', 'Predicted Water Level of Next 24 hours')
    } 
  
  }

  render() {

    return (      
        <div className="App">
          <h2>  Last Data Updated on : {this.state.datevalue}  </h2><br></br>
          
          <h2> Enter Toilet ID: 
          <input type="text" ref={(input1) => this.input1 = input1} 
          onChange={() => this.setState({
            buttonSelected: true
          })} 
          onChange={this.handleClick.bind(this)}
          />
          {/* <Select
            autoFocus={true}
            onChange={this.handleClick.bind(this)}
            options={result}
          /> */}
          </h2>
          
          Select Date : 
          <input type="date" 
          ref={(input) => this.input = input} 
          onChange={this.handleClick.bind(this)}/>

            {this.state.buttonSelected ?
              (<div class="container">
              <div id="air"> 
                <div id="airdash">
                    <CircularProgressbar
                      value={this.state.airqualityvalue}
                      maxValue={5}
                      text={`${this.state.airqualityvalue} ppm`}
                      circleRatio={0.75}
                      styles={buildStyles({
                        rotation: 1 / 2 + 1 / 8,
                        strokeLinecap: "butt",
                         trailColor: "#d3d3d3",
                        pathColor: `#2f4f4f`,
                        textColor: '#2f4f4f',
                        textSize: '13px'
                      })}
                    />  
                    <font color="#2f4f4f"><b> Air Quality </b></font>
                </div> 
                <div class="graphcss"> <canvas id="airpredcanvas"  /> </div>
                <div class="graphcss"> <canvas id="aircanvas"    /> </div>
              </div>  <br></br>
              
              <div id="temp">  
                {/* <div class="text">
                  <span> Current Temperature : {this.state.temperaturevalue} </span>  
                </div>   */}
                <div id="tempdash">
                <CircularProgressbar
                      value={this.state.temperaturevalue}
                      text={`${this.state.temperaturevalue} ` + '`C'}
                      circleRatio={0.75}
                      styles={buildStyles({
                        rotation: 1 / 2 + 1 / 8,
                        strokeLinecap: "butt",
                         trailColor: "#d3d3d3",
                        pathColor: `#ffae42`,
                        textColor: '#ffae42',
                        textSize: '16px'
                      })}
                  /> <font color="#ffae42"><b> Temperature </b></font>
                </div>
                <div class="graphcss"> <canvas id="temppredcanvas" /> </div>
                <div class="graphcss"> <canvas id="tempcanvas"   /> </div>

              </div><br></br>

              <div id="hum">      
                {/* <div class="text"> 
                  <span> Current Humidity : {this.state.humidityvalue} </span>    
                </div> */}
                <div id="humdash">
                <CircularProgressbar
                      value={this.state.humidityvalue}
                      text={`${this.state.humidityvalue} %`}
                      circleRatio={0.75}
                      styles={buildStyles({
                        rotation: 1 / 2 + 1 / 8,
                        strokeLinecap: "butt",
                         trailColor: "#d3d3d3",
                        pathColor: `green`,
                        textColor: 'green',
                        textSize: '16px'
                      })}
                    /> <font color="green"><b> Humidity </b></font>
                </div>
                <div class="graphcss"> <canvas id="humpredcanvas"  /> </div>
                <div class="graphcss"> <canvas id="humcanvas"    /> </div>
              </div><br></br>

              <div id="tank">
                <div id="watercircle"> 
                  <CircularProgressbar
                        value={((17 - this.state.waterlevelvalue)/this.state.waterlevelvalue)*100}
                        text={`${((17 - this.state.waterlevelvalue)/this.state.waterlevelvalue)*100} %`}
                        circleRatio={0.75}
                        styles={buildStyles({
                          rotation: 1 / 2 + 1 / 8,
                          strokeLinecap: "butt",
                           trailColor: "#d3d3d3",
                          pathColor: `blue`,
                          textColor: 'blue',
                          textSize: '16px'
                        })}
                  />  <font color="blue"><b> Water  Level </b></font>
                </div>
                <div class="graphcss"> <canvas id="wlevpredcanvas" /> </div>
                <div class="graphcss"> <canvas id="wlevcanvas"   /> </div>
              </div> <br></br>

              <div id="freq">

                <font class="freq-text" color="red"><b> Frequency </b></font>
                {this.state.cfreqvalue> 200 ? <div className="freq-box-red"> {this.state.cfreqvalue} <br/> Max capacity reached</div> : <div className="freq-box-green" > {this.state.cfreqvalue} <br/> </div>}
                
                {/* <div class="graphcss"> <canvas id="wlevpredcanvas" /> </div> */}
                <div class="graphcss"> <canvas id="freqcanvas"  /> </div>
              </div>    <br></br>
                        
              <div id="cleanerquality" >
                <div id="cleanerdash">
                  {/* <Progress color="success" value={avg * 10} max= {10}>You did it!</Progress>    */}
                  {avg<0.5 ?
                  <font color="red">Not Good</font> 
                  :
                  <font color="green">Good</font> 
                  } <br/>
                  {avg<0.5  ?
                      <Line percent={avg * 100} strokeWidth="10" trailWidth="7" strokeColor="red" width="200px" /> 
                      :
                      <Line percent={avg * 100} strokeWidth="10" trailWidth="7" strokeColor="green" width="200px"/>  
                  }  <br/>
                  {/* <Progress bar value="15" trailColor="red">Meh</Progress> */}
                  {/* <Line percent={avg * 100} strokeWidth="10" trailWidth="7" strokeColor="red" />   */}
                  
                  <font color="#dd1f58"> <b>Cleaner's Quality</b> </font>
                </div>  
      
 
              </div>

              <div id="wet">  
              <div class="text">
                  {/* Wet Floor : {this.state.wetfloor} <br></br> */}
                  Water Clogging
                </div>
              {this.state.wetfloor == 'Yes' ?
               <div className="freq-box-red"> {this.state.wetfloor} <br/></div> 
               :
               <div className="freq-box-green" > {this.state.wetfloor} <br/> </div>}

              </div><br></br> 

              <div id="soap">
              <div class='text'>
                Soap Availability
              </div>
              {this.state.soapvalue ?
               <div className="freq-box-red">  Not Available <br/> </div>
               :
               <div className="freq-box-green"> Available <br/> </div>
              }

              {/* <a href="./heatmap.html"> Click Here </a> */}
              </div>

        </div>
            )
   
            :
            null
           
            }


        </div>   
        
    );

   }

}

export default App;