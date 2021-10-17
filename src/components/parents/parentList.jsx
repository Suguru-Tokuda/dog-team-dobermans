import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ParentsTable from './parentsTable';
import ParentService from '../../services/parentService';
import { connect } from 'react-redux';

class ParentList extends Component {
    state = {
        parents: [],
        loaded: false
    };

    componentDidMount() {
        window.scrollTo(0, 0);

        this.props.showLoading({ reset: false, count: 1 });
        ParentService.getAllLiveParents()
            .then(res => {
                this.setState({ parents: res.data });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setState({ loaded: true });

                this.props.doneLoading();
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
        const { parents, loaded } = this.state;
        if (parents.length > 0 && loaded === true) {
            return <ParentsTable {...this.props} parents={parents} />;
        } else if (parents.length === 0 && loaded === true ) {
            return <p style={{marginTop: "100px", marginBottom: "500px" }}>No dogs available at the moment...</p>
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
                        {this.getParentList()}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated
});

const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch({ type: 'SIGN_IN' }),
        setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
        showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ParentList);