import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../../redux/action';
import './Header.css'

class Header extends Component {

    header = () => {
        return(
            <div>
                <div className="header">
                    <a className="logo">
                        Smart X-Ray
                    </a>
                    <a className='options' onClick={() => {
                        localStorage.clear();
                        this.props.loginAction(false);
                     }}>
                    {this.props.login.login || localStorage.getItem('Login') ? 'SIGNOUT' : '' }
                </a>
                </div>
            </div>
        )
    }

    render() {
        return this.header();
    }
}

const mapStateToProps = state => ({
    login: state.login
})

const mapDispatchToProps = dispatch => ({
    loginAction: status => {dispatch(login(status))}
})


export default connect(mapStateToProps, mapDispatchToProps)(Header);