import React, {Component} from 'react';
import {connect} from 'react-redux';
import {login, history} from '../../redux/action';
import {AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import {withStyles} from "@material-ui/core/styles";

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
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        {
                            this.props.login.login || sessionStorage.getItem('Login')
                                ? sessionStorage.getItem('UserName') === null
                                    ? 'Hi, '+this.props.userName.userName
                                : 'Hi, '+sessionStorage.getItem('UserName')
                                : ''
                        }
                    </Typography>
                    <Button color="inherit" onClick={() => this.props.historyAction(false)} disabled={!this.props.history.history}>
                        {this.props.login.login || sessionStorage.getItem('Login') ? 'Upload' : ''}
                    </Button>
                    {/*<Button color="inherit" onClick={() => this.props.historyAction(true)}>
                        {this.props.login.login || sessionStorage.getItem('Login') ? 'History' : ''}
                    </Button>*/}
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
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header));
