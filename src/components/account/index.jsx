import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import LoginSignUp from './loginSignUp';

export class Account extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            null
            // <React.Fragment>
            //     <Route path="/account/edit" exact render={(props) => <LoginSignUp {...props} />} />
            // </React.Fragment>
        );
    }
}