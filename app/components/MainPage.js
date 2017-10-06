// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Main.css';
import AppLogo  from './AppLogo';

import FlipMove from 'react-flip-move';

export default class MainPage extends Component {
  constructor(props){
    super(props);

    this.state = {
       enabled_coins: [],
    };
  }
  componentDidMount(){
    this.setState({ enabled_coins: JSON.parse(localStorage.getItem("enabled_coins")) });
  }
  render() {
    return (
      <div className={styles.container}>
      	<div className={styles.container2}>
      		<AppLogo />	
      		<table>
      			<tbody>
      				<tr>
      					<td>Coin</td>
      					<td>Name</td>
      					<td>Price</td>
      					<td>Volume</td>
      					<td>Change</td>
      				</tr>
      			</tbody>
      		</table>
          <FlipMove duration={750} easing="ease-out">
            {this.state.enabled_coins.map((o, i) => (
              <div key={i}>
                  {o}
              </div>
              ))}
           </FlipMove>         
      	</div>
 	      <div className={styles.container2}>
 	      </div>

      </div>
    );
  }
}
