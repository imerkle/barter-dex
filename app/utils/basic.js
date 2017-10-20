
import React from 'react';	
import { exec } from 'child_process';
import shell from 'shelljs';
import fs from 'fs';
import { __URL__ ,HOME, SCRIPT_NAME } from './constants';
import qrcode from "qrcode";
import styles from '../components/Main.css';

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
export const maxPinLength = 10;
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
export const coinNameFromTicker = (ticker) => {
	let c = ticker;
	switch(ticker){
		case "KMD":
			c = "Komodo";
		break;
	}
	return c;
}
export const makeCommand = (method, props = {}) =>{
  let payload = {
    userpass: "$userpass",
    gui: "gecko",
    method,
    ...props,
  };
  payload = JSON.stringify(payload).replaceAll(`"`,`\\"`);
  const cmd = `curl --url "${__URL__}" --data "${payload}"`
  return cmd;
}
export const runCommand = (ROOT_DEX, command, callback) => {
	const RANDOM = new Date().valueOf()+""+getRandomInt(Math.pow(10, 1),Math.pow(10, 10));
	const path = `${ROOT_DEX}${RANDOM}`;

	const data = `#!/bin/bash\nsource userpass\n${command}`;
	fs.writeFile(path,data,(err)=>{
		if(!err){
			shell.cd(ROOT_DEX);
			shell.exec(`
				chmod a+x ${path}
				./${RANDOM}
				`,(err,stdout,stderr)=>{
				//if(err) alert(err);
				if(stdout){
					callback(JSON.parse(stdout));
				}
				fs.unlink(path,(c)=>{});
			})
		}
	});
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