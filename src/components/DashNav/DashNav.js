import React, { Component } from 'react';
import { component } from 'react'
import OtakuContext from '../../contexts/OtakuContext';
import './DashNav.css'
class DashNav extends Component {
    static contextType = OtakuContext;
    state ={
        Nav: false,
        className: "sidenav",
        classNameHidden: "sidenav2"
      }

      handleFilterClick = () => {
        this.setState({ Nav: !this.state.Nav})
        
      }
    render(){
       
        
       return(
    <div> 
    
        <div id="mySidenav" className={(this.state.Nav) ? this.state.className : this.state.classNameHidden}>
            <h1>anime list</h1>
        </div>
        <button onClick={this.handleFilterClick}>
            open Nav
        </button>
    </div>
  
       )
    }
}

export default DashNav;