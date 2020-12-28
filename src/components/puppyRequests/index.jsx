import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import PuppyRequestList from './puppyRequestList';
import PuppyRequestDetail from './puppyRequestDetail';
import { connect } from 'react-redux';

export class PuppyRequests extends Component {
    constructor(props) { 
        super(props);
    }

    componentDidMount() {
        if (this.props.authenticated === false) {
            this.props.setRedirectURL(this.props.location.pathname);
        }
    }

    render() {
        const { authenticated, user } = this.props;

        if (authenticated === true && user && user.emailVerified) {
            return (
                <React.Fragment>
                    <Route path="/puppy-requests" exact render={(props) => <PuppyRequestList {...props} />} />
                    <Route path="/puppy-requests/:puppyRequestID" exact render={(props) => <PuppyRequestDetail {...props} />} />
                </React.Fragment>
            );
        } else if (!authenticated) {
            this.props.setRedirectURL(this.props.location.pathname);
            return <Redirect to={{ pathname: "/login", state: { previousUrl: this.props.location.pathname } }}/>;
        } else if (authenticated && user && !user.emailVerified) {
            return <Redirect to="/email-verifiation" />;
        } else {
            return <Redirect to={{ pathname: "/login", state: { previousUrl: this.props.location.pathname } }}/>;
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(PuppyRequests);