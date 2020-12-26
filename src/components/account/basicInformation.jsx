import React, { Component } from 'react';
import { connect } from 'react-redux';

class BasicInformation extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { user } = this.props;

        if (user) {
            return (
                <React.Fragment>
                    <div className="block-header mb-5">
                        <h5>Profile</h5>
                    </div>
                    <div className="content-block" style={{ margin: '20px', color: 'gray' }}>
                        <div className="form-group row">
                            <label className="col-xs-12 col-sm-12 col-md-3 col-lg-2">UserID</label>
                            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-10">{ `${user.userID}` }</div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xs-12 col-sm-12 col-md-3 col-lg-2">Name</label>
                            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-10">{ `${user.firstName} ${user.lastName}` }</div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xs-12 col-sm-12 col-md-3 col-lg-2">Email</label>
                            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-10">{ user.email }</div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xs-12 col-sm-12 col-md-3 col-lg-2">Phone</label>
                            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-10">{ user.phone }</div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xs-12 col-sm-12 col-md-3 col-lg-2">City</label>
                            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-10">{ user.city }</div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xs-12 col-sm-12 col-md-3 col-lg-2">State</label>
                            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-10">{ user.state }</div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount,
    userChecked: state.userChecked,
    redirectURL: state.redirectURL
  });
  
  const mapDispatchToProps = dispatch => {
    return {
      login: () => dispatch({ type: 'SIGN_IN' }),
      logout: () => dispatch({ type: 'SIGN_OUT' }),
      checkUser: () => dispatch({ type: 'USER_CHECKED' }),
      setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
      getUser: () => dispatch({ type: 'GET_USER' }),
      showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
      doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
      resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' })
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(BasicInformation);