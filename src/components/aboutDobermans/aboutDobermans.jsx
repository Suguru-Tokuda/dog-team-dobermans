import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AboutDobermanService from '../../services/aboutDobermansService'

class AboutDobermans extends Component {
    state = {
        message: ''
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        AboutDobermanService.getAboutDobermans()
            .then(res => {
                this.setState({
                    message: res.data
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>About Dobermans</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    About Dobermans
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getMessage() {
        const { message } = this.state;
        if (message.length > 0) {
            return <div dangerouslySetInnerHTML={{__html: message }} />
        } else {
            return <div style={{marginTop: '700px'}} />
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}      
                <section className="padding-small">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-8 col-lg-10">
                                {this.getMessage()}
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }

}

export default AboutDobermans;