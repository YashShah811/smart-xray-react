import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login, userId } from '../../redux/action';
import UploadImage from '../UploadImage/UploadImage';
import { server } from '../../properties';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loading: false
        }
    }

    ckeckInput = () => {
        if(this.state.username === '' || this.state.password === ''){
            alert('Please check username or password.')
        }
    }

    onSubmit = () => {
        this.ckeckInput();
        this.setState({
            loading: true
        })
        fetch(server + '/login', {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.status === 200) {
                this.props.loginAction(true)
            }
            localStorage.setItem('Login', this.props.login.login)
            return response.json();
        }).then(responseJson => {
            if(responseJson.data) {
                this.props.userAction(responseJson.data.id)
            }
            localStorage.setItem('UserId', responseJson.data.id)
            this.setState({
                loading: false
            })
        })
        .catch( e => console.log(e) )
    }

    login = () => {
        return(
            <div className="login">
                <label>Username </label>
                <input type="text" onChange={(i) => {this.setState({username: i.target.value})}} /><br />
                <label>Password </label>
                <input type="password" onChange={(i) => {this.setState({password: i.target.value})}}/><br /><br />
                <button className="submitButton" onClick={this.onSubmit}>
                    Submit
                </button>
            </div>
        )
    }

    render() {
        if(this.state.loading) {
            return (
                <p>
                    Loading...
                </p>
            )
        } else {
            if(localStorage.getItem('Login')) {
                return <UploadImage />
            } else {
                return this.login()
            }
        }
    }
}

const mapStateToProps = state => ({
    login: state.login
})

const mapDispatchToProps = dispatch => ({
    loginAction: status => {dispatch(login(status))},
    userAction: id => {dispatch(userId(id))}
})

export default connect(mapStateToProps, mapDispatchToProps) (Login);