import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login, userId, userName } from '../../redux/action';
import Login from '../Login/Login';
import { server } from '../../properties';
import { Button, TextField, CircularProgress, Snackbar, Grid, withStyles, Typography, FormGroup, FormControlLabel, Radio, FormControl, RadioGroup, FormLabel, Switch } from '@material-ui/core';
import { Navigate } from 'react-router-dom';
import { Label } from 'recharts';

const styles = theme => ({
    login: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            is_radiologist: false,
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
        if (this.state.username === '' || this.state.password === '' || this.state.email === '') {
            // this.props.loginAction(false)
            this.setState({ open: true, alertMessage: msg, loading: false })
        }
    }
    onSubmit = () => {
        this.setState({
            loading: true
        })
        this.ckeckInput('All fields are mendatory');
        fetch(server + '/signup', {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                is_radiologist: this.state.is_radiologist
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                this.setState({
                    loading: false
                })
                return response.json()
            }).then(responseJson => {
                this.setState({
                    open: true,
                    alertMessage: responseJson.message
                })
            })
            .catch(e => console.log(e))
    }

    onChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.checked
        })
    }

    signup = () => {
        return (
            <form>
                <Grid container direction='column' justify='center' alignItems='center' style={{ minHeight: '80vh' }}>
                    <Grid item>
                        <TextField
                            margin='normal'
                            color='primary'
                            onChange={(i) => { this.setState({ username: i.target.value }) }}
                            label="Username"
                            id="outlined-size-normal"
                            variant="outlined"
                            fullWidth={false}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            margin='normal'
                            color='primary'
                            onChange={(i) => { this.setState({ email: i.target.value }) }}
                            label="Eamil"
                            id="outlined-size-normal"
                            variant="outlined"
                            fullWidth={false}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            margin='normal'
                            color='primary'
                            onChange={(i) => { this.setState({ password: i.target.value }) }}
                            label="Password"
                            id="outlined-size-normal"
                            variant="outlined"
                            fullWidth={false}
                            type='password'
                        />
                    </Grid>
                    <Grid item>
                        <FormControl margin='normal'>
                            <FormControlLabel control={<Switch color='primary' />}
                                name='is_radiologist'
                                defaultValue='false'
                                onChange={this.onChange}
                                labelPlacement='start'
                                label="Radiologist" />
                        </FormControl>
                    </Grid>
                    <Button onClick={this.onSubmit} color='primary'>
                        Signup
                    </Button>
                    <Typography>Already have account? Login <a href='/'>here </a></Typography>
                    {this.alert()}
                </Grid>
            </form>
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
            return this.signup()
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Signup));
