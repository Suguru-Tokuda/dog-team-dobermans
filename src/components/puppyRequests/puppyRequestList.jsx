import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PuppyRequestList extends Component {

    state = {};

    constructor(props) {
        super(props);
        console.log('')
    }

    componentDidMount() {

    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Puppy Requests</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <Link to="/puppy-requests">Puppy Requests</Link>
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
                <div class="container">
                    <div class="talbe-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Date Created</th>
                                    <th>Color</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>09/21/2020</td>
                                    <td>Black and Tan</td>
                                    <td>
                                        <Link class="btn btn-primary" to="/puppy-requests/someID">View</Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PuppyRequestList;