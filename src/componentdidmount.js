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
  
      for(var i=0; i<tdata.length; i++) {
        sum = sum + tdata[i]['quality'];
      }
      console.log(avg);
      avg = sum/tdata.length;
  
      localStorage.setItem('cqualcache', avg);
  
    }
  
    dbrefctdata.on('value', snap => {
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
          // wet1value: snap.val()['wet1'],
          // wet2value: snap.val()['wet2'],
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
        localStorage.setItem('temperaturevaluecache' , this.state.temperaturevalue);
        // localStorage.setItem('wet1valuecache' , this.state.wet1value);
        // localStorage.setItem('wet2valuecache' , this.state.wet2value);
        localStorage.setItem('wetfloorcache' , this.state.wetfloor);
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












//from package.json
  // "devDependencies": {
  //   "node-sass": "^4.13.1",
  //   "sass-loader": "^8.0.2",
  //   "webpack": "^4.41.5"
  // }