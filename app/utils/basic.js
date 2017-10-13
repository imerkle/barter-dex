
import { exec } from 'child_process';
import fs from 'fs';
import { HOME, SCRIPT_NAME } from './constants';
export const maxPinLength = 10;
export const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);
export const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const startClient = (ROOT_DEX) => {
	console.log('niger');
	exec(`
		cd ${ROOT_DEX}
		rm ${ROOT_DEX}userpass
		./client
	`,(err, stdout, stderr)=>{
		if(err) alert('Check your client path again!');

		console.log(err);
		console.log(stdout);
		const myRegexp = /userpass.\((\w*)\)/g;
		const match = myRegexp.exec(stdout);
		const userpass = match[1];
		console.log(userpass);
		fs.readFile(`${HOME}${SCRIPT_NAME}`, 'utf8', (err,data) => {
			console.log(data);
			if(err) alert(err);
			exec(`
				cd ${ROOT_DEX}
				rm ${ROOT_DEX}userpass
				./client
			`);
		});
	  });
}