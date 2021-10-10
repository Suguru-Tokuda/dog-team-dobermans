import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import toastr from 'toastr';
import moment from 'moment';
import waitlistService from '../../services/waitlistService';

class PuppyRequestList extends Component {

    state = {
        userID: '',
        waitRequestList: [],
        dataLoaded: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.authenticated === true) {
            this.props.showLoading({ reset: false, count: 1 });

            waitlistService.getWaitRequestList(this.props.user.userID)
                .then(res => {
                    this.setState({
                        userID: this.props.user.userID,
                        waitRequestList: res.data
                    });
                })
                .catch(err => {
                    console.log(err);
                    toastr.error('There was an error in loading wait requests data.');
                })
                .finally(() => {
                    this.setState({ dataLoaded: true });
                    this.props.doneLoading({ reset: false });
                });
        } else {
            this.props.setRedirectURL('/puppy-requests');
            this.props.history.push('/login');
        }
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

    renderRequestRows() {
        const { waitRequestList } = this.state;

        if (waitRequestList.length > 0) {
            const rows = waitRequestList.map(req => {
                return (
                <tr key={req.waitRequestID}>
                    <td>{moment(req.created).format('MM/DD/YYYY')}</td>
                    <td>{req.color}</td>
                    <td>
                        <Link className="btn btn-primary" to={`/puppy-requests/${req.waitRequestID}`}>
                            {req.numberOfUnreadMessages > 0 && (
                                <span className="badge badge-pill badge-light mr-1">{req.numberOfUnreadMessages} New </span>
                            )}
                            Messages
                        </Link>
                    </td>
                </tr>);
            });

            return rows;
        } else {
            return null;
        }
    }

    render() {
        const { waitRequestList, dataLoaded } = this.state;

        return (
            <React.Fragment>
                {this.getHeader()}
                <div className="container mt-5 mb-5">
                    {dataLoaded && waitRequestList.length > 0 && (
                        <div className="talbe-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date Created</th>
                                        <th>Color</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderRequestRows()}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {dataLoaded && waitRequestList.length === 0 && (
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="text-center">
                                    <h3>No requests have been submitted.</h3>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
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
        doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
        setRedirectURL: (url) => dispatch({ type: 'SET_REDIRECT_URL', url: url })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PuppyRequestList);