import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class Messages extends Component {
    state = {
        messages: [],
        userID: '',
        request: {},
        dataLoaded: false
    };

    constructor(props) {
        super(props);

        this.state.userID = this.props.userID;
        this.state.request = this.props.request;
    }

    componentDidMount() {
        if (this.props.messages !== undefined)
            this.setState({ messages: this.props.messages });
    }

    componentDidUpdate(props) {
        if (this.props.messages && this.props.messages.length > 0 && JSON.stringify(this.props.messages) !== JSON.stringify(this.state.messages)) {
            this.setState({ messages: props.messages });
        }

        if (this.props.dataLoaded !== this.state.dataLoaded) {
            this.setState({ dataLoaded: this.props.dataLoaded });
        }
    }

    renderMessages = () => {
        const { messages, userID, dataLoaded } = this.state;

        let retVal;

        if (messages.length > 0) {
            retVal = messages.map(message => {
                return (
                    <div key={message.messageID} style={{ padding: '20px' }} className={`chat-message ${message.senderID === userID ? 'right' : 'left'}`}>
                        <div className="row">
                            <div className="col-6">
                                {(message.senderID !== userID) && (
                                    <span>Bob Johnson</span>
                                )}
                                {(message.senderID === userID) && (
                                    <span>{this.state.request.firstName} {this.state.request.lastName}</span>
                                )}
                            </div>
                            <div className="col-6">
                                <div className="float-right">
                                    { moment(message.sentDate).format('MM/DD/YYYY hh:mm:ss') }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div style={ message.senderID !== userID ? { resize: 'none', color: '#ffffff', backgroundColor: 'rgba(184, 133, 255, 0.7)', borderRadius: '30px' } : { resize: 'none', 'color': 'black', borderRadius: '30px', border: '0.5px solid black' }}>
                                    <div style={{ padding: '10px' }}>
                                        <div dangerouslySetInnerHTML={{ __html: message.messageBody }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
        }
        //  else if (messages.length === 0 && dataLoaded) {
        //     retVal = <div className="text-center" style={{ marginBottom: '50px' }}><h3>You have no messages.</h3></div>;
        // }

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