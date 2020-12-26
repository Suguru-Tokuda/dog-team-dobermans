import React, { Component } from 'react';
import { connect } from 'react-redux';
import LaddaButton, { S, SLIDE_LEFT } from 'react-ladda';
import ValidationService from '../../services/validationService';
import WaitListService from '../../services/waitListService';
import ConstantsService from '../../services/contactService';
import toastr from 'toastr';
import DatePicker from 'react-datepicker';

class PuppyRequestForm extends Component {

    state = {
        selections: {
            message: '',
            color: '',
            expectedPurchaseDate: null
        },
        validations: {},
        formSubmitted: false,
        loading: false
    };

    getColorOptions() {
        const colors = ["Black & Tan", "Red", "Blue", "Fawn", "Black (Melanistic)"];
        return colors.map(color => <option value={color} key={color}>{color}</option>);
    }

    getTypeOptions() {
        const types = ["American", "European"];
        return types.map(type => <option value={type} key={type}>{type}</option>);
    }

    getStateOptions() {
        const states = ConstantsService.getStates();
        return states.map(state => <option value={state.abbreviation} key={state.abbreviation}>{`${state.abbreviation} - ${state.name}`}</option>);
    }

    getFormClass(key) {
        const { formSubmitted, validations } = this.state;
        return formSubmitted === true && typeof validations[key] !== 'undefined' && validations[key].length > 0 ? 'is-invalid' : '';
    }


    handleSetColor = (event) => {
        const color = event.target.value;
        const { selections, validations } = this.state;
        if (color !== '') {
            delete validations.color;
        } else {
            validations.type = 'Enter color';
        }
        selections.color = color;
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

    handleSubmitForm = (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        const { selections, validations } = this.state;
        let isValid = true;
        const selectionKeys = Object.keys(selections);
        selectionKeys.forEach(key => {
            if ((selections[key] === '' || selections[key] === null) && key !== 'color') {
                isValid = false;
                if (key === 'color') {
                    validations[key] = `Select ${key}`;
                } else if (key === 'expectedPurchaseDate') {
                    validations[key] = `Select Expected Purchase Date`;
                } else {
                    validations[key] = `Enter ${key}`;
                }
            } else {
                delete validations[key];
            }
            if (key === 'email') {
                if (selections[key].length > 0) {
                    if (ValidationService.validateEmail(selections[key]) === true) {
                        delete validations[key];
                    } else {
                        isValid = false;
                        
                        validations[key] = 'Invalid email';
                    }
                }
            }
        });

        if (isValid === true) {
            const { userID } = this.props.user;
            const { phone, message, color, expectedPurchaseDate } = selections;

            this.setState({ loading: true });

            const waitRequestData = {
                userID: userID,
                phone: phone,
                message: message,
                color: color,
                expectedPurchaseDate: expectedPurchaseDate,
                created: new Date(),
                lastModified: new Date(),
                notified: null
            };

            this.props.showLoading({ reset: true, count: 1 });

            WaitListService.createWaitRequest(waitRequestData)
                .then(() => {
                    toastr.success('Request submitted!');
                    const selections = {
                        message: '',
                        color: '',
                        expectedPurchaseDate: null
                    };
                    this.setState({selections, formSubmitted: false });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.setState({ loading: false });
                    this.props.doneLoading({ reset: true });
                });
        }
    }

    render() {
        const { selections, validations, loading, formSubmitted } = this.state;
        const { message, color, expectedPurchaseDate } = selections;

        return (
            <section id="waitListForm">
                <div className="container">
                    <header className="mb-5">
                        <h2 className="heading-line">Doberman Puppy Wait List Form</h2>
                    </header>
                    <div className="row">
                        <div className="col-md-7">
                            <form noValidate className="custom-form form">
                                <div className="controls">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <label htmlFor="color" className={`form-label`}>Color</label>
                                            <select className={`form-control`} name="color" id="color" style={{ height: '50px' }} value={color} onChange={this.handleSetColor}>
                                                <option value="">--Select color for puppy--</option>
                                                {this.getColorOptions()}
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label">Expected Purchase Date *</label><br/>
                                            <DatePicker className={`form-control ${this.getFormClass('expectedPurchaseDate')}`} style={{ height: '50px'}} selected={expectedPurchaseDate} onChange={this.handleSelectExpectedPurchaseDate} minDate={new Date()} />
                                            <br />{formSubmitted === true && validations.expectedPurchaseDate && (<small className="text-danger">{validations.expectedPurchaseDate}</small>)}
                                        </div>
                                    </div>
                                    <div className="form-group mt-5">
                                        <label htmlFor="message" className={`form-label`}>Message for us *</label>
                                        <textarea row="4" className={`form-control ${this.getFormClass('message')}`} placehodler="Enter your message" value={message} onChange={this.handleSetMessage}></textarea>
                                        {formSubmitted === true && validations.message && (
                                            <small className="text-danger">{validations.message}</small>
                                        )}
                                    </div>
                                    <LaddaButton className="btn btn-primary" loading={loading} onClick={this.handleSubmitForm} data-size={S} data-style={SLIDE_LEFT}>Send Request</LaddaButton>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-5">
                            <p>If you'd like to send a request us for a Doberman puppy, please fill out the form. When we have puppies that match your preferences, we will contact you.</p>
                        </div>
                    </div>
                </div>
            </section>
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
        doneLoading: () => dispatch({ type: 'DONE_LOADING' })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PuppyRequestForm);