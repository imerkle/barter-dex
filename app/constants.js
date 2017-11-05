import green from 'material-ui/colors/red';
import os from 'os';
export const platform = os.platform();
export const ROOT_DEX = '/home/slim/gitRepos/sprnt/SuperNET/iguana/dexscripts/';
export const HOME = require('os').homedir()+ ((platform == 'win32') ? "\\barterdex\\" : "/barterdex/");
export const UHOME = require('os').homedir()
export const GIT_URL = 'https://github.com/dsslimshaddy/barter-dex/releases/download/0.0.1/';
export const SCRIPT_NAME = 'userpassscript.sh';
export const __URL__ = 'http://127.0.0.1:7783';
export const coinsJSON = GIT_URL + 'coins.json';
export const ENABLE_COIN = 'enabled_coins.json';
export const marketmakerExe = (platform == 'win32') ? GIT_URL + 'marketmaker.exe' : GIT_URL + 'marketmaker';
export const marketmakerName = (platform == 'win32') ? 'marketmaker.exe' : 'marketmaker';
export const DEBUG_LOG = 'debug.log';

export const stylesY = theme => ({
	  bar: {},
	  checked: {
	    color: green[500],
	    '& + $bar': {
	      backgroundColor: green[500],
	    },
	  },	
	AppBg: {
	    position: "fixed",
	    top: 0,
	    left: 0,
	    height: "100%",
	    width: "100%",
	    zIndex: -1,
	    background: theme.AppBg,
	},
	AppSection: {
		background: theme.AppSectionBg,
	},
	AppSectionHeader: {
		background: theme.AppSectionHeaderBg,
	},
	root: {
		color: theme.RootColor,
	},
	AppBgImage: {
		height: theme.AppBgImageHeight,
	},
	AppSectionTypo: {
		background: theme.AppSectionTypoBg,
 		color: theme.AppSectionTypoColor,
 		borderTop: `5px solid ${theme.AppBg}`,
 		padding: "11px 20px",
	},
	BuySection: {
		borderTop: `5px solid ${theme.palette.secondary[500]}`,
	},
	SellSection: {
		borderTop: `5px solid ${theme.palette.primary[500]}`,
	},
});


export const maxPinLength = 10;
export const algorithm = 'aes-256-ctr';

export const electrumPorts = {
	BTC: 50001,
	LTC: 50012,
	DASH: 50098,
	KMD: 50011,
	HUSH: 50013,
	REVS: 50050,
	CHIPS: 50076,
	MNZ: 50053,
	ARG: 50081,
	CRW: 50076,
	DGB: 50022,
	DOGE: 50015,
	EMC2: 50079,
	HUSH: 50013,
	JUMBLR: 50051,
	LTC: 50012,
	NMC: 50036,
	VIA: 50033,
	VTC: 50088,
	WLC: 50052,
	ZEC: 50032,
};
export const electrumIP = "136.243.45.140";