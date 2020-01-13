import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import Chart from 'chart.js';
import { render } from '@testing-library/react';

        // Initialize Firebase

const db = firebase.database();                     // Initialize Firebase Database

db.ref('aa').on('value', function(snapshot) {       // Created a reference to the node 'aa' in firebase database
    tdata = snapshotToArray(snapshot);              // Stored all the current data in tdata

    var config = {                                      // Configuration for the chart
        type:    'line',
        data:    {
            datasets: [
                {
                    label: 'Sensor Value',
                    data: arrayToObj(tdata).sort(compare),          // Passed the data to the array on X- axis and Y-axis
                    fill: true,
                    borderColor: 'red',
                    backgroundColor: 'rgb(51, 204, 255)'
                }
            ]
        },
        options: {
            responsive: true,
            title:      {
                display: true,
                text:    "Chart.js Time Scale"
            },
            scales: 
            {
                xAxes: [{
                    type: 'time',
                    time: {
                    displayFormats: {                               // We can change the x-axis format here
                        quarter: 'MMM YYYY'
                        }
                    }
                }]
            }
        }                                  
    };

    var ctx = document.getElementById("canvas").getContext("2d");           //Created DOM reference to our tag for chart

    window.myLine = new Chart(ctx, config);                                 // Rendered the Chart onto the tag

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
};

function arrayToObj(tdata) {                                            // We convert the array of form [{date, val, key}] into  
    var dataset = [];                                                   // [{x: date, y: val}] which is accepted by the chart.js
    tdata.forEach(function (item, index) {
        data = new Object();
      data.x = item.date;
      data.y = item.val;
      dataset.push(data);
    });
    return dataset;
};

function compare(a, b) {                                                // The function is used to compare the dates for sorting
  return new Date(a.x) - new Date(b.x);
}

});

render () {
    return (
        <div>
            <canvas id="canvas"></canvas>
        </div>
    );
}