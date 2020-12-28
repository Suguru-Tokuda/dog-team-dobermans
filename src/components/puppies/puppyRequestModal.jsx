import React, { Component } from 'react';
import LaddaButton, { S, SLIDE_LEFT } from 'react-ladda';
import { connect } from 'react-redux';
import WaitListService from '../../services/waitListService';
import ConstantsService from '../../services/contactService';
import DatePicker from 'react-datepicker';
import toastr from 'toastr';
import $ from 'jquery';

class PuppyRequestModal extends Component {
    state = {
        puppyData: {},
        selections: {
            message: '',
            expectedPurchaseDate: null
        },
        validations: {},
        formSubmitted: false,
        loading: false
    }

    constructor(props) {
        super(props);
        this.state.puppyData = props.puppyData;
    }

    getFormClass(key) {
        const { formSubmitted, validations } = this.state;
        return formSubmitted === true && typeof validations[key] !== 'undefined' && validations[key].length > 0 ? 'is-invalid' : '';
    }

    getStateOptions() {
        const states = ConstantsService.getStates();
        return states.map(state => <option value={state.abbreviation} key={state.abbreviation}>{`${state.abbreviation} - ${state.name}`}</option>);
    }

    handleSetMessage = (event) => {
        const message = event.target.value;
        const { selections, validations } = this.state;
        if (message !== '') {
            selections.message = message;
            delete validations.message;
        } else {
            validations.message = 'Enter message';
        }
        selections.message = message;
        this.setState({ selections, validations });
    }

    handleSelectExpectedPurchaseDate = (expectedPurchaseDate) => {
        const { selections, validations } = this.state;
        selections.expectedPurchaseDate = expectedPurchaseDate;
        if (expectedPurchaseDate !== null) {
            validations.expectedPurchaseDate = '';
        } else {
            validations.expectedPurchaseDate = 'Enter expected purchase date';
        }
        this.setState({ selections, validations });
    }

    handleCancelBtnClicked = () => {
        $('#puppyRequestModal').modal('hide');
    }

    handleSubmitForm = (e) => {
        e.preventDefault();
        this.setState({ formSubmitted: true });
        const { puppyData, selections, validations } = this.state;
        let isValid = true;
        const selectionKeys = Object.keys(selections);
        for (const key of selectionKeys) {
            if ((selections[key] === '' || selections[key] === null)) {
                isValid = false;
                if (key !== 'expectedPurchaseDate') {
                    validations[key] = `Enter ${key}`;
                } else {
                    validations[key] = `Enter expected purchase date`;
                }
            } else {
                delete validations[key];
            }
        }

        if (isValid === true) {
            const { user } = this.props;
            const {  expectedPurchaseDate } = selections;
            const { puppyID } = puppyData;

            this.setState({ loading: true });
            this.props.showLoading({ reset: true, count: 1 });

            const waitRequest = {
                userID: user.userID,
                puppyID: puppyID,
                created: new Date().toISOString(),
                color: puppyData.color,
                notified: null,
                expectedPurchaseDate: expectedPurchaseDate
            };

            WaitListService.createWaitRequest(waitRequest)
                .then(() => {
                    toastr.success('The inquiry was successfuly sent. We will get back to you within a couple business days.');
                    this.setState({
                        selections: {
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            city: '',
                            state: '',
                            message: '',
                            expectedPurchaseDate: null
                        },
                        validations: {},
                        formSubmitted: false,
                    });
                    $('#puppyRequestModal').modal('hide');
                })
                .catch(err => {
                    toastr.error('There was an error in creating an inquiry');
                })
                .finally(() => {
                    this.setState({ loading: false });
                    this.props.doneLoading({ reset: true });
                });
        }
    }

    render() {
        const { puppyData, selections, validations, formSubmitted, loading } = this.state;
        const { message, expectedPurchaseDate } = selections;
        return (
            <div className="modal fade" id="puppyRequestModal" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <form noValidate className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Puppy Request Form</h5>
                        </div>
                        <div className="modal-body">
                            <div className="custo-form form">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="table-responsive">
                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <th>Name</th>
                                                        <td>{puppyData.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Color</th>
                                                        <td>{puppyData.color}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Type</th>
                                                        <td>{puppyData.type}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Price</th>
                                                        <td>{`$${parseFloat(puppyData.price)}`}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <label className="form-label">Expected Purchase Date *</label><br/>
                                        <DatePicker className={`form-control ${this.getFormClass('expectedPurchaseDate')}`} selected={expectedPurchaseDate} onChange={this.handleSelectExpectedPurchaseDate} minDate={new Date()} />
                                        <br />{formSubmitted === true && validations.expectedPurchaseDate && (<small className="text-danger">{validations.expectedPurchaseDate}</small>)}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message" className={`form-label`}>Your message for us *</label>
                                    <textarea row="4" className={`form-control ${this.getFormClass('message')}`} placehodler="Enter your message" value={message} onChange={this.handleSetMessage}></textarea>
                                    {formSubmitted === true && validations.message && (
                                        <small className="text-danger">{validations.message}</small>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <LaddaButton className="btn btn-primary" loading={loading} onClick={this.handleSubmitForm} data-size={S} data-style={SLIDE_LEFT}>Send Inquiry</LaddaButton>
                            <button type="button" className="btn btn-secondary" onClick={this.handleCancelBtnClicked}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(PuppyRequestModal);