import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Messages from './messages';
import Messenger from './messenger';
import waitListService from '../../services/waitListService';
import toastr from 'toastr';
import WaitListService from '../../services/waitListService';

class PuppyRequestDetail extends Component {
    state = {
        userID: '',
        requestID: '',
        messages: []
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
        const { requestID, userID } = this.state;

        window.scrollTo(0, 0);

        this.props.showLoading({ reset: false, count: 1 });

        try { 
            const messagesRes = waitListService.getWaitRequestMessages(requestID);
            const messages = messagesRes.data;

            if (messages.length > 0) {
                const messageIDsMarkAsRead = [];

                messages.forEach(message => {
                    if (message.recipientID === this.props.user.userID)
                        messageIDsMarkAsRead.push(message.messageID);
                });

                if (messageIDsMarkAsRead.length > 0) {
                    await WaitListService.markMessageAsRead(messageIDsMarkAsRead);
                }
            }
        } catch (err) {
            console.log(err);
            toastr.error('There was an error in loading messages.');
        }

        waitListService.getWaitRequestMessages(requestID)
            .then(res => {
                this.setState({
                    messages: res.data
                });
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in loading messages.');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    getHeader() {
        const { name } = this.state;
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>{name}</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Puppy Request Request
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    handleUpdateMessages = (messages) => {
        if (messages.length > 0)
            this.setState({ messages: messages });
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                <div className="mb-3">
                    <Messenger {...this.props}
                               messages={this.state.messages}
                               requestID={this.state.requestID}
                               updateMessages={this.handleUpdateMessages.bind(this)}
                    />
                </div>
                <Messages {...this.props} 
                          messages={this.state.messages} 
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