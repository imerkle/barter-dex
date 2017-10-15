import green from 'material-ui/colors/red';

export const ROOT_DEX = '/home/slim/gitRepos/sprnt/SuperNET/iguana/dexscripts/';
export const HOME = require('os').homedir()+"/.barterdex/";
export const userpassscript = 'https://github.com/dsslimshaddy/barter-dex/releases/download/0.0.1/userpassscript.sh';
export const SCRIPT_NAME = 'userpassscript.sh';
export const __URL__ = 'http://127.0.0.1:7783';

export const stylesX = {
  bar: {},
  checked: {
    color: green[500],
    '& + $bar': {
      backgroundColor: green[500],
    },
  },
};