import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Messages from './messages';
import Messenger from './messenger';
import waitListService from '../../services/waitListService';
import toastr from 'toastr';
import moment from 'moment';

class PuppyRequestDetail extends Component {
    state = {
        userID: '',
        requestID: '',
        request: {},
        messages: [],
        dataLoaded: false
    };

    constructor(props) {
        super(props);
        const reuqestID = props.match.params.puppyRequestID;
        
        if (reuqestID.length === 0)
            this.state.requestFound = false;
        else
            this.state.requestID = reuqestID;

        if (this.props.user) {
            this.state.userID = this.props.user.userID;
        }
    }

    componentDidMount = async () => {
        const { requestID } = this.state;
        const { userID } = this.props.user;

        window.scrollTo(0, 0);

        this.props.showLoading({ reset: false, count: 1 });

            Promise.all([
                waitListService.getWaitRequestMessages(requestID),
                waitListService.getWaitRequestList(userID, requestID)
                ])
                .then(async res => {
                    const messages = res[0].data;

                    const waitRequest = res[1].data[0];

                    if (messages.length > 0) {
                        const messageIDsMarkAsRead = [];

                        messages.forEach(message => {
                            if (message.recipientID === this.props.user.userID && !message.read)
                                messageIDsMarkAsRead.push(message.messageID);
                        });
        
                        if (messageIDsMarkAsRead.length > 0) {
                            try {
                                await waitListService.markMessageAsRead(messageIDsMarkAsRead);
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    }

                    this.setState({ request: waitRequest, messages: messages });        
                })
                .catch(err => {
                    toastr.error('There was an error in loading request data.');
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
                    this.setState({ dataLoaded: true });
                })
    }

    getHeader() {
        const { name } = this.state;
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>Puppy Request</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Puppy Request
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    renderRequestDetail = () => {
        const { request } = this.state;

        if (request && Object.keys(request).length > 0) {
            return (
                <div className="container mt-2">
                    <div className="card">
                        <div className="card-header">
                            <h2>Request Summary</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">RequestID</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { request.waitRequestID }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">Request Sent</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { request.created }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">Expected Purchase Date</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { moment(request.expectedPurchaseDate).format('MM/DD/YYYY') }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">Request Message</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { request.message }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-xs-12 col-sm-4 col-md-2 col-lg-2">Color Preference</label>
                                <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10">
                                    { request.color }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    handleUpdateMessages = (messages) => {
        if (messages.length > 0)
            this.setState({ messages: messages });
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                {this.renderRequestDetail()}
                <div className="mb-3">
                    <Messenger {...this.props}
                               messages={this.state.messages}
                               requestID={this.state.requestID}
                               updateMessages={this.handleUpdateMessages.bind(this)}
                    />
                </div>
                <Messages {...this.props} 
                          messages={this.state.messages} 
                          dataLoaded={this.state.dataLoaded}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(PuppyRequestDetail);