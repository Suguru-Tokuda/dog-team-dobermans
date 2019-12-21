import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppiesTable from './puppiesTable';
import PuppyService from '../../services/puppyService';

class PuppyList extends Component {
    state = {
        puppies: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        PuppyService.getAllPuppies()
            .then(res => {
                this.setState({ puppies: res.data });
            })
            .catch(err => {
                console.log(err);
            });
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Puppies</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Puppies
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getPuppyList() {
        const { puppies } = this.state;
        if (puppies.length > 0) {
            return <PuppiesTable {...this.props} puppies={puppies} />;
        } else {
            return <div style={{marginTop: "500px"}}></div>;
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                <div className="container">
                    <div className="row">
                        {this.getPuppyList()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PuppyList;