import React, {Component} from 'react';
import {connect} from 'react-redux';
import {login, history} from '../../redux/action';
import {AppBar, Toolbar, IconButton, Typography, Button, Drawer} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'
import History from '../History/History';
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
            open: false
        }
    }

    toggleDrawer = (status) => {
        this.setState({
            open: status
        })
    }

    header = () => {
        const { classes } = this.props;
        return (
            <div>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon onClick={() => this.toggleDrawer(true)}/>
                        <Drawer anchor='left' open={this.state.open} onClose={() => this.toggleDrawer(false)}>
                            <div className={classes.drawer}>
                                History
                            </div>
                        </Drawer>
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Smart X-Ray
                    </Typography>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        {
                            this.props.login.login || localStorage.getItem('Login')
                                ? localStorage.getItem('UserName') === null
                                    ? window.location.reload(true)
                                    : 'Hi, '+localStorage.getItem('UserName')
                                : ''
                        }
                    </Typography>
                    <Button color="inherit" onClick={() => this.props.historyAction(true)}>
                        {this.props.login.login || localStorage.getItem('Login') ? 'History' : ''}
                    </Button>
                    <Button color="inherit" onClick={this.logout}>
                        {this.props.login.login || localStorage.getItem('Login') ? 'SIGNOUT' : ''}
                    </Button>
                </Toolbar>
            </AppBar>
            <Toolbar />
            </div>
        )
    }

    logout = () => {
        localStorage.clear();
        this.props.loginAction(false);
        this.props.historyAction(false);
    }

    render() {
        return this.header();
    }
}

const mapStateToProps = state => ({
    login: state.login,
    history: state.history
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
