import React, { Component } from 'react';

class DetailedSignUp extends Component {

    state = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        state: ''
    };

    constructor(props) {
        super(props);

        
    }

    handleFirstNameChanged = (e) => {

    }

    render() {
        const { firstName, lastName, email, phone, city, state } = this.state;

        return (
            <React.Fragment>
                <div className="block">
                    <div className="block-header">
                        <h5>New Account</h5>
                    </div>
                    <div className="block-body">
                        <p className="leader">Not a Doberman Member yet?</p>
                        <form>
                            <div className="form-group">
                                <label for="firstName" className="form-label">First Name</label>
                                <input 
                                    id="firstName" 
                                    type="text" 
                                    className="form-control" 
                                    value={firstName}
                                    onKeyUp={this.handleFirstNameChanged}
                                />
                            </div>
                            <div className="form-group">
                                <label for="lastName" className="form-label">Last Name</label>
                                <input 
                                    id="lastName" 
                                    type="text" 
                                    className="form-control" 
                                    value={lastName}
                                    onKeyUp={this.handleFirstNameChanged}
                                />
                            </div>
                            <div className="form-group">
                                <label for="email" className="form-label">Email</label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    className="form-control" 
                                    value={email}
                                    onKeyUp={this.handleFirstNameChanged}
                                />
                            </div>
                            <div className="form-group">
                                <label for="firstName" className="form-label">Phone</label>
                                <input 
                                    id="phone" 
                                    type="text" 
                                    className="form-control" 
                                    value={phone}
                                    onKeyUp={this.handleFirstNameChanged}
                                />
                            </div>
                            <div className="form-group">
                                <label for="city" className="form-label">City</label>
                                <input 
                                    id="city" 
                                    type="text" 
                                    className="form-control" 
                                    value={city}
                                    onKeyUp={this.handleFirstNameChanged}
                                />
                            </div>
                            <div className="form-group">
                                <label for="state" className="form-label">State</label>
                                <input 
                                    id="state" 
                                    type="text" 
                                    className="form-control" 
                                    value={state}
                                    onKeyUp={this.handleFirstNameChanged}
                                />
                            </div>
                            <div className="from-group text-center">
                                <button type="submit" className="btn btn-primary">Register</button><br />
                                Or
                                <button type="button" className="btn btn-success">Sign in with Facebook</button>
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default DetailedSignUp;