import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import PageNotFound from '../common/pageNotFound';
import BlogService from '../../services/blogService';
import toastr from 'toastr';

class BlogDetail extends Component {
    state = {
        title: '',
        message: '',
        author: '',
        created: '',
        prevBlogID: undefined,
        nextBlogID: undefined,
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
        window.scrollTo(0, 0);
        this.getBlogData();
    }

    componentDidUpdate() {
        const { updateData } = this.state;
        if (updateData === true) {
            this.setState({ updateData: false });
            this.getBlogData();
        }
    }

    getBlogData() {
        const { blogID } = this.state;
        this.props.showLoading({ reset: true, count: 1 });
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
                        prevBlogID: blogData.prevBlogID,
                        nextBlogID: blogData.nextBlogID,
                        blogFound: true
                    });
                }
            })
            .catch(() => {
                toastr.error('There was an error in loading blog data');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
                this.setState({ pageLoaded: true });
            });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.blogID !== prevState.blogID) {
            return { blogID: nextProps.match.params.blogID, updateData: true };
        }
        return null;
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
                        <div className="col-lg-3 text-right order-1 order-lg-2">
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
        const { message, nextBlogID, prevBlogID } = this.state;
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
                    <nav aria-label="..." className="d-block w-100">
                        <ul className="pagination pagination-custom d-flex justify-content-between d-block w-100">
                            <li className="page-item">
                                {nextBlogID !== undefined && (
                                    <Link className={`page-link ${nextBlogID === undefined ? 'disabled' : ''}`} to={`/blog/${nextBlogID}`}>Newer Post</Link>
                                )}
                            </li>
                            <li className="page-item">
                                {prevBlogID !== undefined && (
                                    <Link className={`page-link ${prevBlogID === undefined ? 'disabled' : ''}`} to={`/blog/${prevBlogID}`}>Older Post</Link>
                                )}
                            </li>
                        </ul>
                    </nav>
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

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated,
    loadCount: state.loadCount,
    userChecked: state.userChecked,
    redirectURL: state.redirectURL
  });
  
  const mapDispatchToProps = dispatch => {
    return {
      login: () => dispatch({ type: 'SIGN_IN' }),
      logout: () => dispatch({ type: 'SIGN_OUT' }),
      checkUser: () => dispatch({ type: 'USER_CHECKED' }),
      setUser: (user) => dispatch({ type: 'SET_USER', user: user }),
      getUser: () => dispatch({ type: 'GET_USER' }),
      showLoading: (params) => dispatch({ type: 'SHOW_LOADING', params: params }),
      doneLoading: () => dispatch({ type: 'DONE_LOADING' }),
      resetRedirectURL: () => dispatch({ type: 'RESET_REDIRECT_URL' })
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(BlogDetail);