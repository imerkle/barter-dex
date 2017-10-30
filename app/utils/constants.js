import green from 'material-ui/colors/red';

export const ROOT_DEX = '/home/slim/gitRepos/sprnt/SuperNET/iguana/dexscripts/';
export const HOME = require('os').homedir()+"/.barterdex/";
export const UHOME = require('os').homedir()

export const userpassscript = 'https://github.com/dsslimshaddy/barter-dex/releases/download/0.0.1/userpassscript.sh';
export const SCRIPT_NAME = 'userpassscript.sh';
export const __URL__ = 'http://127.0.0.1:7783';
export const clientscript = 'https://github.com/dsslimshaddy/barter-dex/releases/download/0.0.1/client';
export const getcoinsscript = 'https://github.com/dsslimshaddy/barter-dex/releases/download/0.0.1/getcoins';
export const enable_myscript = 'https://github.com/dsslimshaddy/barter-dex/releases/download/0.0.1/enable_my';
export const marketmakerExe = 'https://github.com/dsslimshaddy/barter-dex/releases/download/0.0.1/marketmaker';
export const coinsJSON = 'https://github.com/dsslimshaddy/barter-dex/releases/download/0.0.1/coins.json';
export const ENABLE_COIN = 'enabled_coins.json';

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
};
export const electrumIP = "136.243.45.140";