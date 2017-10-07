// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import HeaderNav from './HeaderNav';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Icon,
} from 'material-ui';

export default class Settings extends Component {
  render() {
    return (
        <div className={styles.container2}>
        	<HeaderNav />
			<List>
				{makeList('Select Coins','donut_small','startup')}
			</List>
        </div>
    );
  }
}
const makeList = (primary,icon,to) => {
return (
		          <Link to={to}>
		        <ListItem button>
		          <ListItemIcon>
		            <Icon>{icon}</Icon>
		          </ListItemIcon>
		          <ListItemText primary={primary} />
		        </ListItem>
		          </Link>

	);	
}
