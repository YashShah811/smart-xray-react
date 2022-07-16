import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login, userId, userName } from '../../redux/action';
import UploadImage from '../UploadImage/UploadImage';
import { server } from '../../properties';
import { Button, TextField, CircularProgress, Snackbar, Grid, withStyles, Typography, Radio } from '@material-ui/core';
import Radiology from '../Radiology/Radiology';

const styles = theme => ({
    login: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loading: false,
            open: false,
            alertMessage: ''
        }
    }

    alert = () => (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={this.state.open}
            onClose={() => this.setState({ open: !this.state.open })}
            autoHideDuration={3000}
            message={this.state.alertMessage}
        />
    )

    ckeckInput = (msg) => {
        if (this.state.username === '' || this.state.password === '') {
            this.props.loginAction(false)
            this.setState({ open: true, alertMessage: msg, loading: false })
        }
    }
    onSubmit = () => {
        this.setState({
            loading: true
        })
        this.ckeckInput('username or password cannot be empty');
        fetch(server + '/login', {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    this.props.loginAction(true)
                }
                return response.json()
            }).then(responseJson => {
                if (responseJson.data === null) {
                    this.setState({
                        loading: false,
                        open: true,
                        alertMessage: responseJson.message
                    })
                } else {
                    this.props.userAction(responseJson.data.id)
                    this.props.userNameAction(responseJson.data.username)
                    sessionStorage.setItem('access_token', responseJson.data.access_token)
                    sessionStorage.setItem('refresh_token', responseJson.data.refresh_token)
                    sessionStorage.setItem('Login', this.props.login.login)
                    sessionStorage.setItem('UserId', responseJson.data.id)
                    sessionStorage.setItem('UserName', responseJson.data.username)
                    sessionStorage.setItem('is_radiologist', responseJson.data.is_radiologist)
                    this.setState({
                        loading: false
                    })
                }
            })
            .catch(e => console.log(e))
    }

    login = () => {
        return (
            <Grid container item direction='column' justify='center' alignItems='center' style={{ minHeight: '80vh' }}>
                <TextField
                    margin='normal'
                    color='primary'
                    onChange={(i) => { this.setState({ username: i.target.value }) }}
                    label="Username"
                    id="outlined-size-normal"
                    variant="outlined"
                    fullWidth={false}
                />
                <br />
                <TextField
                    color='primary'
                    onChange={(i) => { this.setState({ password: i.target.value }) }}
                    label="Password"
                    id="outlined-size-normal"
                    variant="outlined"
                    fullWidth={false}
                    type='password'
                />
                <br />
                <Button onClick={this.onSubmit} color='primary'>
                    Login
                </Button>
                <Typography>Don't have account? Create <a href='/#/signup'>here </a></Typography>
                {this.alert()}
            </Grid>
        )
    }

    render() {
        if (this.state.loading) {
            return (
                <Grid container item justify='center' alignItems='center' style={{ minHeight: '80vh' }}>
                    <CircularProgress
                        disableShrink
                    />
                </Grid>
            )
        } else {
            if (sessionStorage.getItem('Login')) {
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
    loginAction: status => { dispatch(login(status)) },
    userAction: id => { dispatch(userId(id)) },
    userNameAction: name => { dispatch(userName(name)) },
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
