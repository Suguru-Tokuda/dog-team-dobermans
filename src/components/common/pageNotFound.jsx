import React, { Component } from 'react';

class PageNotFound extends Component {
    render() {
        return (
            <React.Fragment>
                <section className="hero hero-page gray-bg padding-small">
                    <div className="container">
                        <h1>Page not found</h1>
                    </div>
                </section>
                <section className="padding-small">
                    <div className="container">
                        <div className="row">
                        <div className="col-xl-8 col-lg-10">
                            <h2 className="text-superbig">404</h2>
                            <p className="lead">We don't know what what happened but that <strong>page is not here</strong>.</p>
                        </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default PageNotFound;