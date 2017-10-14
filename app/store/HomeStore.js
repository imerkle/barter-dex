import {observable,action,computed} from 'mobx';
import { ROOT_DEX } from '../utils/constants.js';

class HomeStore{
	@observable ROOT_DEX = ROOT_DEX;
}
export default new HomeStore;
