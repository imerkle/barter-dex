
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

export const coinNameFromTicker = (ticker) => {
	let c = "CoinName";
	switch(ticker){
		case "KMD":
			c = "Komodo";
		break;
	}
	return c;
}