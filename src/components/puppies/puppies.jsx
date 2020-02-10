import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PuppyList from './puppyList';
import PuppyDetail from './puppyDetail';

class Puppies extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <React.Fragment>
                <Route path="/puppies" exact render={(props) => <PuppyList {...props} />} />
                <Route path="/puppies/:puppyID" exact render={(props) => <PuppyDetail {...props} />} />
            </React.Fragment>
        )
    }
}

export default Puppies;