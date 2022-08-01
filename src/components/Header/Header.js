import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login, history, result } from '../../redux/action';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    drawer: {
        width: 250
    }
})

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    // toggleDrawer = (status) => {
    //     this.setState({
    //         open: status
    //     })
    // }

    header = () => {
        return (
            <div>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            Smart X-Ray <sup>BETA</sup>
                        </Typography>
                        {/* <Typography variant="h6" style={{ flexGrow: 1 }}>
                        {
                            this.props.login.login || sessionStorage.getItem('Login')
                                ? sessionStorage.getItem('UserName') === null
                                    ? 'Hi, there'+this.props.userName.userName
                                : 'Hi, there'+sessionStorage.getItem('UserName')
                                : ''
                        }
                    </Typography>
                    <Button color="inherit" onClick={() => this.props.resultAction(false)}>
                        {this.props.login.login || sessionStorage.getItem('Login') ? 'Upload' : ''}
                    </Button> */}
                        {/*<Button color="inherit" onClick={() => this.props.historyAction(true)}>
                        {this.props.login.login || sessionStorage.getItem('Login') ? 'History' : ''}
                    </Button>*/}
                        {/* {button} */}
                        {/* <Button color="inherit" onClick={() => {
                            if (this.props.history.history) {
                                if (sessionStorage.getItem('is_radiologist') === '1') {
                                    window.location.replace('/#/radiology')
                                } else {
                                    window.location.replace('/')
                                }
                            } else {
                                window.location.replace('/#/history')
                            }
                        }}>
                            {this.props.login.login ? this.props.history.history ? 'Home' : 'History' : ''}
                        </Button> */}
                        <Button color="inherit" onClick={this.logout}>
                            {this.props.login.login || sessionStorage.getItem('Login') ? 'SIGNOUT' : ''}
                        </Button>
                    </Toolbar>
                </AppBar>
                <Toolbar />
            </div>
        )
    }

    logout = () => {
        sessionStorage.clear();
        this.props.loginAction(false);
        this.props.historyAction(false);
        window.location.replace('/')
    }

    render() {
        return this.header();
    }
}

const mapStateToProps = state => ({
    login: state.login,
    history: state.history,
    userName: state.userName,
})

const mapDispatchToProps = dispatch => ({
    loginAction: status => {
        dispatch(login(status))
    },
    historyAction: status => {
        dispatch(history(status))
    },
    resultAction: status => {
        dispatch(result(status))
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header));
