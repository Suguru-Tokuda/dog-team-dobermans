import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Messages from './messages';
import Messenger from './messenger';

class PuppyRequestDetail extends Component {
    state = {
        requestID: 0,
        messages: []
    };

    constructor(props) {
        super(props);
        const reuqestID = props.match.params.puppyRequestID;
        
        if (reuqestID.length === 0)
            this.state.requestFound = false;
        else
            this.state.requestID = reuqestID;
    }

    componentDidMount() {
        const { requestID } = this.state;

        window.scrollTo(0, 0);

        // TODO API call to get the request details with messages.
    }

    getHeader() {
        const { name } = this.state;
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>{name}</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Puppy Request Request
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                <div className="mb-3">
                    <Messenger />
                </div>
                <Messages />
            </React.Fragment>
        );
    }
}

export default PuppyRequestDetail;