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
            <React.Fragment>
                <Route path="/account/login" exact render={(props) => <LoginSignUp {...props} />} />
            </React.Fragment>
        )
    }
}