import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import BlogDetail from './blogDetail';
import BlogList from './blogList';

class Blog extends Component {
    componentDidUpdate() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <React.Fragment>
                <Route path="/blog/:blogID" exact render={(props) => <BlogDetail {...props} />} />
                <Route path="/blog" exact render={(props) => <BlogList {...props} />} />
            </React.Fragment>
        );
    }
}

export default Blog;