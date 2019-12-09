import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import ParentList from './parentList';
import ParentDetail from './parentDetail';

class Parents extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Route path="/our-dogs" exact render={(props) => <ParentList {...props} />} />
                <Route path="/our-dogs/:parentID" exact render={(props) => <ParentDetail {...props} />} /> 
            </React.Fragment>
        );
    }
}

export default Parents;