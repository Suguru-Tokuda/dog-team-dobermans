import React, { Component } from 'react';
import SignUpForm from './signUpForm';

class SignUpModal extends Component {

    render() {
        return (
            <div className="modal fade" id="signUpModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title col-10">
                                Register
                            </h5>
                            <button type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                            >
                                <span aria-hidden="true"><i className="fa fa-close"></i></span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <SignUpForm onRegistrationCompleted={this.props.onRegistrationCompleted} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUpModal;