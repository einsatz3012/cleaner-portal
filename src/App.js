import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import storageRef from 'firebase';
import Chart from 'chart.js';
import {Line} from 'react-chartjs-2';
import templogo from './components/temperature.png';
import airlogo from './components/airquality.png';
import humlogo from './components/humidity.png';
import wetfloorlogo  from './components/wetfloor.png';
import toiletfreqlogo  from './components/toiletfreq.png';
import {db} from './index'

var aa1 = []
class App extends Component {
  constructor() {
    super();
    this.state = {
      ipdate: '',
      url: '',
      image: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);

  }

  handleChange = e => {
    if(e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({image}));

    }
  }

  handleUpload = () => {
    var storageRef = firebase.storage().ref();
    const {image} = this.state;
    // const uploadTask = storageRef.child(`resolve_images/${image.name}`).put(image);
    const uploadTask = storageRef.child(`resolve_images/${image.name}`).put(image);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // progrss function ....
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({progress});
      }, 
      (error) => {
           // error function ....
        console.log(error);
      }, 
      () => {
          // complete function ....
          storageRef.child(`resolve_images/${image.name}`).getDownloadURL().then(url => {
            console.log(url);
            this.setState({url: url});
        })
      });

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

  function airgraph(labelvalues, airvalues) {
    //console.log(airvalues);
    var airgraph = {
      type: 'line', 
      data: { 
        // labels: [1,2,3,4,5,6,7,8,9,0], 
        labels: labelvalues,
        datasets: [ 
          { 
              label: 'Air Quality', 
              data: airvalues, 
              fill: false,
              borderWidth : 5,
              backgroundColor: [
              "black"
              ]
          } 
        ] 
      }, 
      options: { 
            scales: { 
                yAxes: [{ 
                    ticks: { 
                        beginAtZero:true 
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
    var ctx = document.getElementById("aircanvas").getContext("2d");           //Created DOM reference to our tag for chart
    // $('#datetext').text(ipdate); 
    window.myLine = new Chart(ctx, airgraph);  
  }

  function tempgraph(labelvalues, tempvalues) {
    //console.log(airvalues);
    var tempgraph = {
      type: 'line', 
      data: { 
        // labels: [1,2,3,4,5,6,7,8,9,0], 
        labels: labelvalues,
        datasets: [ 
          { 
              label: 'Temperature', 
              data: tempvalues, 
              fill: false,
              borderWidth : 5,
              backgroundColor: [
              "black"
              ]
          } 
        ] 
      }, 
      options: { 
            scales: { 
                yAxes: [{ 
                    ticks: { 
                        beginAtZero:true 
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
    var ctx = document.getElementById("tempcanvas").getContext("2d");           //Created DOM reference to our tag for chart
    window.myLine = new Chart(ctx, tempgraph);  
  }

  function humgraph(labelvalues, humvalues) {
    //console.log(airvalues);
    var humgraph = {
      type: 'line', 
      data: { 
        // labels: [1,2,3,4,5,6,7,8,9,0], 
        labels: labelvalues,
        datasets: [ 
          { 
              label: 'Humidity', 
              data: humvalues, 
              fill: false,
              borderWidth : 5,
              backgroundColor: [
              "black"
              ]
          } 
        ] 
      }, 
      options: { 
            scales: { 
                yAxes: [{ 
                    ticks: { 
                        beginAtZero:true 
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
    var ctx = document.getElementById("humcanvas").getContext("2d");           //Created DOM reference to our tag for chart
    window.myLine = new Chart(ctx, humgraph);  
  }


  const dbrefctdata = firebase.database().ref().child('ctdata');
  // const dbreftdata = firebase.database().ref().child('tdata');
  const dbrefcfreq = firebase.database().ref().child('cfreq');



  dbrefcfreq.on('value', snap => {
    this.setState({
      cfreqvalue: snap.val()['cfreq']
    });

  });

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
  } 
  //end of componentdidmount
  const db = firebase.firestore()
  const aaRef = db.collection('aa').get().then((snapshot) => {
    
    snapshot.forEach(doc => {
      const data = doc.data();
      aa1.push(data);
    })
    console.log(aa1)
  }).catch(error => console.log(error))


}

  updateDate() {

    var ipdate = this.input.value;
    
    function gotData(data) {
      var mydata = [];
      var airvalues = [];
      var tempvalues = [];
      var humvalues = [];
      var wlevvalues = [];
      var labelvalues = [];

      var tdata = snapshotToArray(data);    // converted data to array of tdata
     
      var tempdata = [];
      for(var i=0; i<tdata.length; i++) {     // store copy of data in tempdata tdata
          tempdata[i] = tdata[i];
      }

      for(var i=0; i<tempdata.length; i++) {          // converting timestamp to date only ctdata
        var timestamparrindexdate = new Date(tempdata[i]['date']);
        var rawdate = timestamparrindexdate.getFullYear() + '-' + (timestamparrindexdate.getMonth()+1) + '-' + timestamparrindexdate.getDate() 
    
        tempdata[i]['date'] = rawdate;                
      }

      for(var i=0; i<tempdata.length; i++) {             //storing data on date to array mydata
        if(ipdate == tempdata[i]['date']) {
            mydata.push(tempdata[i]);
        }
      }
      console.log(mydata);

      for(var i=0; i<mydata.length; i++) {
        airvalues.push(mydata[i]['air']);
        tempvalues.push(mydata[i]['temp']);
        humvalues.push(mydata[i]['hum']);
        wlevvalues.push(mydata[i]['wlev']);
        labelvalues.push(mydata[i]['date'])
      }

      airgraph(labelvalues, airvalues);
      tempgraph(labelvalues, tempvalues);
      humgraph(labelvalues, humvalues);
      wlevgraph(labelvalues, wlevvalues);
    
      function airgraph(labelvalues, airvalues) {
        //console.log(airvalues);
        var airgraph = {
          type: 'line', 
          data: { 
            // labels: [1,2,3,4,5,6,7,8,9,0], 
            labels: labelvalues,
            datasets: [ 
              { 
                  label: 'Air Quality', 
                  data: airvalues, 
                  fill: false,
                  borderWidth : 5,
                  backgroundColor: [
                  "black"
                  ]
              } 
            ] 
          }, 
          options: { 
                scales: { 
                    yAxes: [{ 
                        ticks: { 
                            beginAtZero:true 
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
        var ctx = document.getElementById("aircanvas").getContext("2d");           //Created DOM reference to our tag for chart
        // $('#datetext').text(ipdate); 
        window.myLine = new Chart(ctx, airgraph);  
      }

      function tempgraph(labelvalues, tempvalues) {
        //console.log(airvalues);
        var tempgraph = {
          type: 'line', 
          data: { 
            // labels: [1,2,3,4,5,6,7,8,9,0], 
            labels: labelvalues,
            datasets: [ 
              { 
                  label: 'Temperature', 
                  data: tempvalues, 
                  fill: false,
                  borderWidth : 5,
                  backgroundColor: [
                  "black"
                  ]
              } 
            ] 
          }, 
          options: { 
                scales: { 
                    yAxes: [{ 
                        ticks: { 
                            beginAtZero:true 
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
        var ctx = document.getElementById("tempcanvas").getContext("2d");           //Created DOM reference to our tag for chart
        window.myLine = new Chart(ctx, tempgraph);  
      }

      function humgraph(labelvalues, humvalues) {
        //console.log(airvalues);
        var humgraph = {
          type: 'line', 
          data: { 
            // labels: [1,2,3,4,5,6,7,8,9,0], 
            labels: labelvalues,
            datasets: [ 
              { 
                  label: 'Humidity', 
                  data: humvalues, 
                  fill: false,
                  borderWidth : 5,
                  backgroundColor: [
                  "black"
                  ]
              } 
            ] 
          }, 
          options: { 
                scales: { 
                    yAxes: [{ 
                        ticks: { 
                            beginAtZero:true 
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
        var ctx = document.getElementById("humcanvas").getContext("2d");           //Created DOM reference to our tag for chart
        window.myLine = new Chart(ctx, humgraph);  
      }

      function wlevgraph(labelvalues, wlevvalues) {
        //console.log(airvalues);
        var wlevgraph = {
          type: 'line', 
          data: { 
            // labels: [1,2,3,4,5,6,7,8,9,0], 
            labels: labelvalues,
            datasets: [ 
              { 
                  label: 'Watwe in Tank', 
                  data: wlevvalues, 
                  fill: false,
                  borderWidth : 5,
                  backgroundColor: [
                  "black"
                  ]
              } 
            ] 
          }, 
          options: { 
                scales: { 
                    yAxes: [{ 
                        ticks: { 
                            beginAtZero:true 
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
        var ctx = document.getElementById("wlevcanvas").getContext("2d");           //Created DOM reference to our tag for chart
        window.myLine = new Chart(ctx, wlevgraph);  
      }

      //end of gotdata
    }

    function gotData1(data) {
      var mydata1 = [];
      var freqvalues = [];
      var aalabelvalues = [];

      var tdata1 = snapshotToArray(data);    // converted data to array of aa

      var tempdata1 = [];
      for(var i=0; i<tdata1.length; i++) {     // store copy of data in tempdata aa
          tempdata1[i] = tdata1[i];
      }
      
      for(var i=0; i<tempdata1.length; i++) {          // converting timestamp to date only tempdata
        var timestamparrindexdate = new Date(tempdata1[i]['date']);
        var rawdate = timestamparrindexdate.getFullYear() + '-' + (timestamparrindexdate.getMonth()+1) + '-' + timestamparrindexdate.getDate() 
    
        tempdata1[i]['date'] = rawdate;                
      }

      for(var i=0; i<tempdata1.length; i++) {
        if(ipdate == tempdata1[i]['date']) {
            mydata1.push(tempdata1[i]);
        }
      }

      for(var i=0; i<mydata1.length; i++) {
        aalabelvalues.push(mydata1[i]['date']);
        freqvalues.push(mydata1[i]['val']);
      }
      console.log(mydata1);

      freqgraph(aalabelvalues, freqvalues);

      function freqgraph(aalabelvalues, freqvalues) {
        //console.log(airvalues);
        var freqgraph = {
          type: 'line', 
          data: { 
            // labels: [1,2,3,4,5,6,7,8,9,0], 
            labels: aalabelvalues,
            datasets: [ 
              { 
                  label: 'Watwe in Tank', 
                  data: freqvalues, 
                  fill: false,
                  borderWidth : 5,
                  backgroundColor: [
                  "black"
                  ]
              } 
            ] 
          }, 
          options: { 
                scales: { 
                    yAxes: [{ 
                        ticks: { 
                            beginAtZero:true 
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
        var ctx = document.getElementById("freqcanvas").getContext("2d");           //Created DOM reference to our tag for chart
        window.myLine = new Chart(ctx, freqgraph);  
      }
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

    var ref = firebase.database().ref('tdata');
    ref.on('value', gotData, errData);

    var ref1 = firebase.database().ref('aa');
    ref1.on('value', gotData1, errData);

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
                <img src={airlogo} />
                <div class="text"> <span> Air Quality : {this.state.airqualityvalue} </span> </div>
                <canvas id="aircanvas" hidden/>
              </div>  <br></br>
              
              <div id="temp">  
                <img src={templogo} />
                <div class="text"><span> Current Temperature : {this.state.temperaturevalue} </span> </div>
                <canvas id="tempcanvas" hidden/>
              </div><br></br>
              
              <div id="hum">  
                <img src={humlogo}/>
                <div class="text"> <span> Current Humidity : {this.state.humidityvalue} </span> </div>
                <canvas id="humcanvas" hidden/>
              </div><br></br>
              
              <div id="wet">  
                <img src={wetfloorlogo}/>
                <div class="text">
                  Wet Floor 1: {this.state.wet1value} <br></br>
                  Wet Floor 2: {this.state.wet2value}
                </div>
              </div><br></br>


              <div id="freq">
                <img src={toiletfreqlogo}/>
                <div class="text">
                  Currently Using : {this.state.cfreqvalue}
                </div>
                <canvas id="freqcanvas" hidden/>
              </div>    <br></br>
              
              <div id="tank">
                <div id="page-wrap">
                  <div class="meter">
                    <span style={mystyle}> </span>
                  </div>
                </div>
                <span >Water Present in Tank : {this.state.waterlevelvalue}% </span>
                <canvas id="wlevcanvas" hidden/>
              </div> <br></br>
            </div>
{/* 
            {aa1.map(aa => <div> {aa['url']} </div>)} 
            {this.renderItems()} */}
            <h1 style={{color: "red", textAlign:"left"}}> Submitted Complaints</h1> 
            <div class="complaint">
              <tr>
                <th width="100px">Name</th>
                <th width="100px">Image</th>
                <th width="100px">ncncn</th>
              </tr>
            </div>
          {  aa1.map((item, index) => (
       
              <div class="complaint">
               
                  {/* Passing unique value to 'key' prop, eases process for virtual DOM to remove specific element and update HTML tree  */}
                  <table>

                  <td width="100px"><span class="comp_name">{item.name}</span></td>
                  <td width="100px"><span class="comp_img"><img src={item.uri} height="75" width="75" /></span></td>
                  <td> <input type="file" onChange={this.handleChange} /> </td> 
                  <td> <button onClick={this.handleUpload}>Upload</button> </td>                 
                  </table>
              </div>
 
            ))
          }
          
      


        </div>   
        

    );

    }
}

export default App;