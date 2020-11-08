import React, { Component } from 'react';

class Login extends Component {

    render() {
        return (
            <div className="block">
                <div className="block-header">
                    <h5>Login</h5>
                </div>
                <div className="block-body">
                    <p className="lead">Alrady a member?</p>
                    <form noValidate>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input id="email" type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input id="password" type="password" className="form-control" />
                    </div>
                    <div className="form-group text-center">
                        <button type="button" className="btn btn-primary"><i className="fas fa-sign-in-alt"></i> Log in</button>
                        <span className="ml-2 mr-2">or</span>
                        <button type="button" className="btn btn-facebook"><i className="fab fa-facebook-f"></i> Continue with Facebook</button>
                     </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;