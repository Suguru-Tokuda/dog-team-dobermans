import { ReadStream } from 'fs-extra';
import React, { Component } from 'react';

class Messenger extends Component {
    state = {
        requestID: 0,
        messageBody: ''
    };

    constructor(props) {
        super(props);
        
        // if (props.requestID)
        //     this.state.requestID;
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
                    <div class="col-12">
                        <div style={{ padding: '10px'}}>
                            <textarea className="form-control" rows="10" style={{ resize: 'none' }} value={ messageBody } onChange={ e => this.setState({ messageBody: e.target.value }) }></textarea>
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div class="col-12">
                        <div class="pull-right">
                            <button className="btn btn-primary"><i className="fa fa-send"></i> Send</button>
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

export default Messenger;