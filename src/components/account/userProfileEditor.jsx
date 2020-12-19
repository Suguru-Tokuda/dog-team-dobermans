import React, { Component } from 'react';
import { connect } from 'react-redx';

class UserProfileEditor extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        state: ''
    };
   
}

const mapStateToProps = state => ({
    user: state.user,
    authenticated: state.authenticated
});

export default connect(mapStateToProps)(UserProfileEditor);