import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import BlogTables from './blogsTable';
import BlogService from '../../services/blogService';
import toastr from 'toastr';

class BlogList extends Component {
    state = {
        blogs: [],
        loaded: false
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.showLoading({ reset: true, count: 1 });
        BlogService.getAllBlogs()
            .then(res => {
                this.setState({ blogs: res.data });
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in loading blogs');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
                this.setState({ loaded: true });
            });
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order2 order-lg-1">
                            <h1>Blog</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Blog
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    getBlogList() {
        const { blogs, loaded } = this.state;
        if (blogs.length > 0 && loaded === true) {
            return <BlogTables {...this.props} blogs={blogs} />
        } else if (blogs.length === 0 && loaded === true) {
            return <p style={{marginTop: "100px", marginBottom: "500px"}}>No blogs available...</p>
        } else {
            return <div style={{marginTop: "800px"}}></div>;
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                {this.getBlogList()}
            </React.Fragment>
        )
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(BlogList);