import React, { Component } from 'react';
import Topnavbar from '../common/topnavbar';
// import '../../assets/css/style.violet.css';

class Main extends Component {
    render() {
        return (
            <div style={{paddingTop: '100px'}}>
                <Topnavbar />
                <h1 className="text-uppercase">Main</h1>
            </div>
        );
    }
}

export default Main;