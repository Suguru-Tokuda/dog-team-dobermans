import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ParentsTable from './parentsTable';
import ParentService from '../../services/parentService';

class ParentList extends Component {
    state = {
        parents: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ParentService.getAllParents()
            .then(res => {
                this.setState({ parents: res.data });
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
                            <h1>Our Dogs</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Our Dogs
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getParentList() {
        const { parents } = this.state;
        if (parents.length > 0) {
            return <ParentsTable {...this.props} parents={parents} />;
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
                        {this.getParentList()}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ParentList;