
import React from 'react';	
import { exec } from 'child_process';
import shell from 'shelljs';
import fs from 'fs';
import { HOME } from './constants';
import qrcode from "qrcode";
import styles from '../components/Main.css';
import * as CryptoIcon from 'react-cryptocoins';

export { coinNameFromTicker } from './coinList.js';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

export const capitalize = (name) => {
     return name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}    
export const coinLogoFromTicker = (ticker) => {
    const capTicker = capitalize(ticker);
    const CryptoSVGLogo = CryptoIcon[capTicker];
      let CoinLogo = (<span className={styles.customLogo}>{capTicker.charAt(0)}</span>);
      if(CryptoSVGLogo){
          CoinLogo = (<CryptoSVGLogo color="#fbbf40" style={{margin: "0px 10px -6px 0px" }} />);
      }
      return CoinLogo;
}

export const makeConfig = (data, ticker, maxdecimal, change, baseticker) => {
    const new_data = [];

    let tmp = 0;
    const len = data.length;
    for(let i=0;i<len;i++){
        const o = data[i];
        if(tmp < o[0]){
            new_data.push([o[0]*1000,+(o[1]).toFixed(maxdecimal || 8)]);
        }
        tmp = o[0];
    }

let colorKey = "yellow";
if(change > 0){
    colorKey = "blue";
}
if(change > 10){
    colorKey = "green";
}
if(change < 0){
    colorKey = "yellow";
}
if(change < 10){
    colorKey = "red";
}

let color = "", colorArea="";
switch(colorKey){
    case 'red':
        color= '#f1c79c';
        colorArea = '#fcf2e8';
    break;
    case 'blue':
        color= '#a1c3ef';
        colorArea = '#eaf2fc';
    break;
    case 'yellow':
        color= '#F3E181';
        colorArea = '#fdf9e4';
    break;
    case 'green':
        color= '#9CE5D3';
        colorArea = '#e8f9f5';
    break;
}
const config =  {
        chart: {
            margin: [0,0,0,0],
            spacing: [0,0,0,0],
            padding: 0,
            height: "120px",
        },
        title:{
            text: null
        },        
        xAxis: {
            type: 'datetime',
            title: {
                enabled: false
            },
                    labels: {
                    enabled: false
                    },
            lineWidth: 0,
            minPadding:0,
            maxPadding:0,            
        },
        yAxis: {
            title: {
                enabled: false
            },
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            labels: {
                enabled: false
            },            
            lineWidth: 0,
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function () {
                return `${baseticker} Value: ${this.y}`;
            }
        },        
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, colorArea],
                        [1, colorArea]
                    ],
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                threshold: null
            }
        },

        series: [{
            type: 'area',
            data: new_data,
            color: color
        }]
};  
return config;
}
export const zeroGray = (number) => {
    if(!number){
        number = "0.0";
    }
	number = number + "";
	const num_arr = number.split(".");
	const dec = num_arr[1];
	let include_index = 0;
	for(let i=dec.length - 1 ;i>0;i--){
		if(!include_index && parseInt(dec.charAt(i)) !==0){
			include_index = i;
		}
	}
	
	let before_trail = "";
	for(let i=0;i<= include_index;i++){
		before_trail += dec.charAt(i);
	}
	return (
		<span className={styles.number_zero}>
			{num_arr[0] + "." + before_trail}
			<span className={styles.number_trail}>{("0").repeat(dec.length - include_index -1)}</span>
		</span>
		);
	return str;
}
export const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);
export const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateQR = (content, id) => {
    const canvas = document.getElementById(id);
    qrcode.toCanvas(canvas, content, function (error) {
      if (error) alert(error)
    })    
 }
export const getSorted = (asc, data, prop) => {
	return (asc) ? data.sort((a, b) => parseFloat(a[prop]) - parseFloat(b[prop]) ) : data.sort((b, a) => parseFloat(a[prop]) - parseFloat(b[prop]) );
}