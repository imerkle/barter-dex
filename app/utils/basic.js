
import React from 'react';	
import { exec } from 'child_process';
import shell from 'shelljs';
import fs from 'fs';
import { HOME } from './constants';
import qrcode from "qrcode";
import styles from '../components/Main.css';
export { coinNameFromTicker } from './coinList.js';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

export const makeConfig = (data, ticker, maxdecimal) => {
const new_data = [];
	  data.map(o=>{
	    new_data.push([o[0]*1000,+(o[1]).toFixed(maxdecimal || 8)]);
	  });
return {
        rangeSelector: {
            //selected: 1
            inputEnabled: false,
        },
        scrollbar: {
            enabled: false
        },
        series: [{
        	name: `${ticker} Price`,
            //type: 'area',
            data: new_data,
            /*
            dataGrouping: {
                units: [
                    [
                        'week', // unit name
                        [1] // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]
                ]
            }*/
        }]
    };  
}    
export const zeroGray = (number) => {
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