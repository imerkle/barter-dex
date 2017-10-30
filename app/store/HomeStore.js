import {observable,action,computed} from 'mobx';
import { ROOT_DEX } from '../utils/constants.js';
import request from 'request';
import tcpPortUsed from 'tcp-port-used';
class HomeStore{
	@observable ROOT_DEX = ROOT_DEX;
	@observable passphrase ="";
	@observable userpass = null;
	@observable enabled_coins = [];
	@observable coins = {};
	@observable base = { coin: "BTC", balance: 0, };
	@observable currentCoin = false;
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
	@observable checkIfRunningTimer = null;
	@observable intervalTimerBook = null;
	@observable maxdecimal = 8;
	@observable indicator = [25,50,75,100];
	@observable gui = 'gecko';
	@observable available_coins = [];
	@observable url = 'http://127.0.0.1:7783';
	@observable host = '127.0.0.1';
	@observable port = 7783;
	@observable orderBookRate = 4000;
	@observable allCoins = [];
	@observable debuglist = [];
	@observable obook = [];


  @action runCommand = (method, data = {}) => {
  	    data.gui = this.gui;
  	    data.method = method;
  	    data.userpass = this.userpass;
        const jsonData = JSON.stringify(data);
        const headersOpt = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonData),
        };
        return new Promise((resolve, reject) => {
        	if(!method){
        		resolve();
        	}
            request(
                {
                    method: 'post',
                    url: this.url,
                    form: jsonData,
                    headers: headersOpt,
                    strictSSL: false,
                    json: true
                }, (error, response, body) => {
                //console.log(data);
                //console.log(body);
                if(this.debuglist.length > 20) this.debuglist = [];
                this.debuglist.unshift({
                	input: data,
                	output: body,
                });
                if (error) {
                	console.log(error,data);
                    return reject(error);
                }
                return resolve(body);
            });
        });
    }	
	@action makeUnique = () => {
		const uniqueArray = this.enabled_coins.filter((item, pos) => {
			return this.enabled_coins.indexOf(item) == pos;
		})
		this.enabled_coins = uniqueArray;
	} 
	  @action orderBookCall = () => {

		  const { coins, base , currentCoin} = this;
		  if(!currentCoin) return false;

	      const o = currentCoin;
	      if(o.coin != base.coin){
	        this.runCommand("orderbook",{base: o.coin, rel: base.coin,duration: 360000}).then((res)=>{
	        	this._zeroVolumeFix(res);	
	          
	          if(res.asks && res.asks[0]){
	            coins[o.coin].value = res.asks[0].price * coins[o.coin].balance; 
	            coins[o.coin].price = res.asks[0].price;
	          }else{
	            coins[o.coin].value = coins[o.coin].balance;
	          }
	          const obook = res;
	          //obook.asks = obook.asks.filter((ask) => ask.numutxos > 0);
	          //obook.bids = obook.bids.filter((bid) => bid.numutxos > 0);
	          
	          this.obook = obook;
	        }).catch(err => {});

	      }
	  }
	  _zeroVolumeFix = (res) => {
		if(res.bids && res.asks){
			for(let i=0;i<res.bids.length;i++){
			  const o = res.bids[i];
	          if(o.numutxos == 0){
	          	this.runCommand("listunspent",{coin: o.coin,address: o.address}).then(res=>{}).catch(err => {});
	          	break;
	          }
	  		}
	        for(let i=0;i<res.bids.length;i++){
			  const o = res.bids[i];
	          if(o.numutxos == 0){
	          	this.runCommand("listunspent",{coin: o.coin,address: o.address}).then(res=>{}).catch(err => {});
	          	break;
	          }
	        }
	     }	  	
	  }
	 @action resetWallet = () => {
	  const { coins, base, maxdecimal } = this;

	    Object.keys(coins).map((k,v)=>{
	      const o = coins[k];
	      this.runCommand("balance",{coin: o.coin, address: o.smartaddress}).then((res)=>{
	         if(res.error){
	          delete HomeStore.coins[o.coin];
	          return false;
	         } 
	         if(res.result == "success"){
	            coins[o.coin].balance = res.balance;
	            if(o.coin == base.coin ) base.balance = res.balance;
	         } 
	      }).catch(err => {});
	        coins[o.coin].orders = 0;
	        if(base.coin != o.coin){
	            this.runCommand("pricearray",{base: o.coin, rel: base.coin}).then((res)=>{
	              if(res[res.length - 1]){
	                const today = res[res.length - 1][1];
	                const yesterday = res[0][1];
	                const change = ((today - yesterday)/yesterday * 100).toFixed(2);
	                coins[o.coin].change = change;
	              }
	            }).catch(err => {});
	        }
	    })      
	  }
	isRunning = () => {
		return new Promise((resolve, reject) => {
			tcpPortUsed.check(this.port, this.host).then(function(inUse) {
		  		return resolve(inUse);
			}, function(err) {
		  		return reject(err);
			});
		});
	}    
	@action setUserpass = (userpass, mypubkey) => {
		this.userpass = userpass;
		this.mypubkey = mypubkey;
	}
	@action setValue = (k, v) => {
		this[k] = v;
	}
}
export default new HomeStore;
