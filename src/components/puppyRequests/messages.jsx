import React, { Component } from 'react';

class Messages extends Component {
    state = {
        messages: []
    };

    constructor(props) {
        super(props);

        for (let i = 0, max = 10; i < max; i++) {
            this.state.messages.push({
                sender: 'Bob',
                messageBody: 'New puppies are available.',
                postDate: new Date()
            });
        }
    }

    renderMessages = () => {
        const { messages } = this.state;

        const retVal = messages.map(message => {
            return (
                <div style={{ padding: '20px' }}>
                    <div className="row">
                        <div class="col-6">
                            From: { message.sender }
                        </div>
                        <div class="col-6">
                            <div class="float-right">
                                { message.postDate.toString() }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div class="col-12">
                            <textarea className="form-control" value={message.messageBody} rows="7" style={{ resize: 'none', color: '#ffffff', backgroundColor: 'rgba(184, 133, 255, 0.7)' }} readonly></textarea>
                        </div>
                    </div>
                </div>
            );
        });

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

export default Messages;