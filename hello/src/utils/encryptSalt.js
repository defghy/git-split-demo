import { $_env } from 'app/utils/global';
import { saltList } from 'app/utils/constants.js';
var md5 = require('md5');


const getSaltStr = obj => {
  let ran = Math.round(Math.random() * 99);
  let timer = new Date().getTime();
  let env = $_env == 'test' ? 'test' : 'online';
  let data = Object.assign({}, obj, { salt_index: ran, time_stamp: timer });
  return `${md5(JSON.stringify(data)+saltList[env][ran]).toUpperCase()},${ran},${timer}`;
}

export default getSaltStr;