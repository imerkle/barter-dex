import {observable,action,computed} from 'mobx';
import { ROOT_DEX } from '../utils/constants.js';

class HomeStore{
	@observable ROOT_DEX = ROOT_DEX;
	@observable passphrase;
	@observable userpass;
	@observable enabled_coins = [];
	@observable coins = {};
	@observable base = { coin: "BTC", balance: 0, };
	@observable buyState = {
		price: "",
		amount: "",
		total: "",
	};
	@observable sellState = {
		price: "",
		amount: "",
		total: "",
	};
	@observable intervalTimer = null;
	@observable maxdecimal = 8;
}
export default new HomeStore;
