import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import PuppyRequestList from './puppyRequestList';
import PuppyRequestDetail from './puppyRequestDetail';
import { connect } from 'react-redux';
import toastr from 'toastr';

export class PuppyRequests extends Component {
    constructor(props) { 
        super(props);
    }

    // componentDidMount() {
    //     if (this.props.authenticated === false) {
    //         this.props.setRedirectURL(this.props.location.pathname);
    //     }
    // }

    render() {
        return (
            <React.Fragment>
                {/* <Route path="/puppy-requests" exact render={(props) => <PuppyRequestList {...props} />} /> */}
                <Route path="/puppy-request/:puppyRequestID" exact render={(props) => <PuppyRequestDetail {...props} />} />
                <Route path="/puppy-requests/:puppyRequestID" exact render={(props) => <PuppyRequestDetail {...props} />} />
            </React.Fragment>
        );
        // const { authenticated, user } = this.props;

        // if (authenticated === true && user && user.emailVerified) {
        //     return (
        //         <React.Fragment>
        //             {/* <Route path="/puppy-requests" exact render={(props) => <PuppyRequestList {...props} />} /> */}
        //             <Route path="/puppy-request/:puppyRequestID" exact render={(props) => <PuppyRequestDetail {...props} />} />
        //         </React.Fragment>
        //     );
        // } else if (!authenticated) {
        //     this.props.setRedirectURL(this.props.location.pathname);
        //     return <Redirect to={{ pathname: "/login", state: { previousUrl: this.props.location.pathname, message: 'Please login to see the puppy request messages.' } }}/>;
        // } else if (authenticated && user && !user.emailVerified) {
        //     toastr.error('Please verify your email first.');
        //     return <Redirect to="/email-verification" />;
        // } else {
        //     toastr.error('You need to login to continue.');
        //     return <Redirect to={{ pathname: "/login", state: { previousUrl: this.props.location.pathname, message: 'Please login to see the puppy request messages.' } }}/>;
        // }
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