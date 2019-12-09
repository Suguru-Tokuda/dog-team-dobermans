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
                                <img src="https://i2.wp.com/wall.coloringpagelogo.com/wp-content/uploads/2019/01/dobermann-hd-wallpaper-background-images-in-doberman-dog-sad-animal-wallpaper-free-7618.jpg?w=800&ssl=1" alt="sad-doberman" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

export default PageNotFound;