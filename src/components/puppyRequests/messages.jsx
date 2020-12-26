import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class Messages extends Component {
    state = {
        messages: [],
        userID: ''
    };

    constructor(props) {
        super(props);

        this.state.userID = this.props.user.userID;
    }

    componentDidMount() {
        if (this.props.messages !== undefined)
            this.setState({ messages: this.props.messages });
    }

    componentDidUpdate(props) {
        if (this.props.messages && this.props.messages.length > 0 && JSON.stringify(this.props.messages) !== JSON.stringify(this.state.messages))
            this.setState({ messages: props.messages })
    }

    handleSentMessageChanged = (e) => {

    }

    renderMessages = () => {
        const { messages, userID } = this.state;

        let retVal;

        if (messages.length > 0) {
            retVal = messages.map(message => {
                return (
                    <div key={message.messageID} style={{ padding: '20px' }} className={`chat-message ${message.senderID === userID ? 'right' : 'left'}`}>
                        <div className="row">
                            <div className="col-6">
                                {(message.senderID !== userID) && (
                                    <span>From: </span>
                                )}
                                {(message.senderID === userID) && (
                                    <span>{this.props.user.firstName} {this.props.user.lastName}</span>
                                )}
                            </div>
                            <div className="col-6">
                                <div className="float-right">
                                    { moment(message.sentDate._seconds).format('MM/DD/YYYY hh:mm:ss') }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <textarea className="form-control" value={message.messageBody} onChange={this.handleSentMessageChanged} rows="7" style={{ resize: 'none', color: '#ffffff', backgroundColor: 'rgba(184, 133, 255, 0.7)' }} readOnly></textarea>
                            </div>
                        </div>
                    </div>
                );
            });
        } else {
            retVal = <div className="text-center"><h3>You have no messages.</h3></div>;
        }

        return (
            <React.Fragment>
                {retVal}
            </React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    { this.renderMessages() }
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Messages);