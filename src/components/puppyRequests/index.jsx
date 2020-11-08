import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyRequestList from './puppyRequestList';
import PuppyRequestDetail from './puppyRequestDetail';

export class PuppyRequests extends Component {

    constructor(props) { 
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Route path="/puppy-requests" exact render={(props) => <PuppyRequestList name="Puppy Requests" {...props} />} />
                <Route path="/puppy-requests/:puppyRequestID" exact render={(props) => <PuppyRequestDetail {...props} />} />
            </React.Fragment>
        );
    }
}