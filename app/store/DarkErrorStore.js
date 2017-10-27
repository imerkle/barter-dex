import { observable, action } from 'mobx';
class DarkErrorStore{
	@observable visible = false;
	@observable good = false;
	@observable text = "";
	@action alert = (text, good = false) => {
		this.text = text;
		this.visible = true;
		this.good = good;

		setTimeout(this.disable, 3000);
	}
	@action disable = () => {
		this.visible = false;
	}
}
export default new DarkErrorStore;
