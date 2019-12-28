import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PageNotFound from '../common/pageNotFound';
import BlogService from '../../services/blogService';

class BlogDetail extends Component {
    state = {
        title: '',
        message: '',
        author: '',
        created: '',
        pageLoaded: false,
        blogFound: false
    };

    constructor(props) {
        super(props);
        const blogID = props.match.params.blogID;
        if (blogID.length === 0) {
            this.state.blogFound = false;
        } else {
            this.state.blogID = blogID;
        }
    }

    componentDidMount() {
        const { blogID } = this.state;
        BlogService.getBlog(blogID)
            .then(res => {
                if (Object.keys(res.data).length === 0) {
                    this.setState({ blogFound: false });
                } else {
                    const blogData = res.data;
                    this.setState({
                        title: blogData.title,
                        message: blogData.message,
                        author: blogData.author,
                        created: blogData.created,
                        blogFound: true
                    });
                }
            })
    }

    getHeader() {
        const { title, author, created } = this.state;
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-">
                            <h1>{title}</h1>
                            {(author !== '' && created !== '') && (
                                <p className="author-data-top">
                                    {`By ${author} | ${moment(new Date(created)).format('MMMM DD, YYYY')}`}
                                </p>
                            )}
                        </div>
                        <div classname="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/blog">Blog</Link>
                                </li>
                                {title !== '' && (
                                    <li className="breadcrumb-item active">
                                        {title}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getMainMessage() {
        const { message } = this.state;
        return (
            <section className="padding-small">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-8 col-lg-10">
                            {message !== '' && (
                                <div dangerouslySetInnerHTML={{__html: message }} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    render() {
        const { blogFound, pageLoaded } = this.state;
        if (blogFound === true && pageLoaded === true) {
            return (
                <React.Fragment>
                    {this.getHeader()}
                    {this.getMainMessage()}
                </React.Fragment>
            );
        } else if (blogFound === false && pageLoaded === true) {
            return <PageNotFound />;
        } else if (pageLoaded === false) {
            return (
                <React.Fragment>
                    {this.getHeader()}
                    <div style={{ marginTop: '700px' }}></div>
                </React.Fragment>
            );
        }
    }

}

export default BlogDetail;