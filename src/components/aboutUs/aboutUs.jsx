import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import MissionStatements from './missionStatements';
import OurTeam from './ourTeam';
import AboutUsService from '../../services/aboutUsService';

class AboutUs extends Component {
    state = {
        missionStatements: [],
        ourTeam: []
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.showLoading({ reset: true, count: 1 });
        AboutUsService.getAboutUs()
            .then(res => {
                this.setState({
                    missionStatements: res.data.missionStatements,
                    ourTeam: res.data.ourTeam
                });
            })
            .catch(err => {
                console.log(err);
                toastr.error('There was an error in loading about us data');
            })
            .finally(() => {
                this.props.doneLoading({ reset: true });
            });
    }

    getHeader() {
        return (
            <section className="hero hero-page gray-bg padding-small">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-9 order-2 order-lg-1">
                            <h1>About us</h1>
                        </div>
                        <div className="col-lg-3 text-right order-1 order-lg-2">
                            <ul className="breadcrumb justify-content-lg-end">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    About us
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getMissionStatements() {
        const { missionStatements } = this.state;
        if (missionStatements.length > 0) { 
            return <MissionStatements missionStatements={missionStatements} />
        }
        return <div style={{marginTop: '400px'}}></div>;
    }

    getOurTeam() {
        const { ourTeam } = this.state;
        if (ourTeam.length > 0) {
            return <OurTeam ourTeam={ourTeam} />
        }
        return <div style={{marginTop: '400px'}}></div>;
    }

    render() {
        return (
            <React.Fragment>
                {this.getHeader()}
                {this.getMissionStatements()}
                {this.getOurTeam()}
            </React.Fragment>
        );
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(AboutUs);