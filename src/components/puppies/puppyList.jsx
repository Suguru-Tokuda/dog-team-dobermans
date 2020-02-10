import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PuppiesTable from './puppiesTable';
import PuppyService from '../../services/puppyService';

class PuppyList extends Component {
    state = {
        puppies: [],
        loaded: false
    };

    componentDidMount() {
        PuppyService.getAllLivePuppies()
            .then(res => {
                this.setState({ puppies: res.data });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({ loaded: true });
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
        const { puppies, loaded } = this.state;
        if (puppies.length > 0 && loaded === true) {
            return <PuppiesTable {...this.props} puppies={puppies} />;
        } else if (puppies.length === 0 && loaded === true) {
            return <p style={{marginTop: "100px", marginBottom: "500px"}}>No puppies available at the moment...</p>
        } else {
            return <div style={{marginTop: "800px"}}></div>;
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