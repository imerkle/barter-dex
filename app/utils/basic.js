
import { exec } from 'child_process';
import shell from 'shelljs';
import fs from 'fs';
import { __URL__ ,HOME, SCRIPT_NAME } from './constants';
import qrcode from "qrcode";
	
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

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
				if(err) alert(err);
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