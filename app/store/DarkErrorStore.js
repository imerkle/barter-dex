import { observable, action } from 'mobx';
class DarkErrorStore{
	@observable visible = false;
	@observable text = "";
	@action alert = (text) => {
		this.text = text;
		this.visible = true;
	}
}
export default new DarkErrorStore;
