import React, { Component } from 'react';
import { connect } from 'react-redux';
import waitListService from '../../services/waitListService';
import toastr from 'toastr';

class Messenger extends Component {
    state = {
        userID: '',
        requestID: '',
        messageBody: '',
        messages: []
    };

    constructor(props) {
        super(props);
        
        if (this.props.userID) {
            this.state.userID = this.props.userID;
        }
        
        if (this.props.requestID) {
            this.state.requestID = this.props.requestID;
        }
    }

    componentDidUpdate() {
        const { messages } = this.state;

        this.props.updateMessages([]);

        if (this.props.messages && JSON.stringify(messages) !== JSON.stringify(this.props.messages)) {
            this.setState({ messages: this.props.messages });
        }
    }

    handleSendBtnClicked = () => {
        const { userID, requestID, messageBody } = this.state;

        if (messageBody.length > 0) {
            this.props.showLoading({ reset: true, count: 1 });

            
            waitListService.sendWaitRequestMessage(userID, requestID, messageBody)
                .then(res => {
                    let { messages } = this.state;

                    messages.push(res.data);
                    messages = messages.sort((messageA, messageB) => {
                        return messageA.sentDate > messageB.sentDate ? -1 : messageA.sentDate < messageB.sentDate ? 1 : 0;
                    });

                    this.props.updateMessages(messages);

                    this.setState({
                        messageBody: ''
                    });

                    toastr.success('A message was successfully sent.');
                })
                .catch(err => {
                    console.log(err);
                    toastr.error('There was an error in sending a message.');
                })
                .finally(() => {
                    this.props.doneLoading({ reset: true });
                });
        }
    }

    renderTextEditor = () => {
        const { messageBody } = this.state;

        return (
            <div style={{ padding: '20px' }}>
                <div className="row">
                    <div className="col-12">
                        <h2 className="ml-2 mt-2">New Message</h2>
                    </div>
                </div>
                <div className="form-grup row">
                    <div className="col-12">
                        <div style={{ padding: '10px'}}>
                            <textarea className="form-control" rows="5" style={{ resize: 'none' }} value={ messageBody } onChange={ e => this.setState({ messageBody: e.target.value }) }></textarea>
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-12">
                        <div className="pull-right">
                            <button className="btn btn-primary" onClick={this.handleSendBtnClicked}><i className="fa fa-send"></i> Send</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="container">
                { this.renderTextEditor() }
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);