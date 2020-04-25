import React from 'react';
import {Component} from 'react';
import './History.css';
import UploadImage from '../UploadImage/UploadImage';
import {connect} from 'react-redux';
import {history} from '../../redux/action';
import {server} from '../../properties';
import {LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts';
import {
    Grid,
    Paper,
    TableContainer,
    TableBody,
    TableRow,
    TableCell,
    Button,
    withStyles,
    Typography,
    FormControlLabel,
    Radio,
    RadioGroup,
    Table,
    CircularProgress, Snackbar
} from '@material-ui/core';
import Header from '../Header/Header';

const styles = theme => ({
    offset: theme.mixins.toolbar,
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '400',
        maxHeight: '400',
    },
    item: {
        alignContent:'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

class History extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            key: [],
            home: false,
            loading: false,
            open: false,
            message: '',
        }
    }


    componentDidMount() {
        this.setState({ loading: true })
        fetch(server + '/history/' + localStorage.getItem('UserId'), {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(respose => respose.json())
            .then(responseJson => {
                this.setState({
                    data: responseJson.data,
                    loading: false
                })
            }).catch(e => console.log(e))
    }

    history = () => {
        return (
            <Grid container justify='center'>
                {
                    this.state.data.map((d, i) => {
                        return (
                            <Grid container item xs={12} style={{ background: 'aliceblue', marginTop: '1%' }}>
                                <Grid item xs={12}>
                                    <Typography variant='h5' color='primary' align='center'>
                                        {new Intl.DateTimeFormat("en-GB", {
                                            year: "numeric",
                                            month: "long",
                                            day: "2-digit",
                                            hour: "numeric",
                                            minute: "numeric",
                                            second: "numeric",
                                            hour12: true,
                                            //   timeZoneName: 'short'
                                        }).format(new Date(d.access_dts))}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <img
                                        style={{ display: 'block', marginRight: 'auto', marginLeft: 'auto' }}
                                        src={server + '/' + d.image_path.split('.')[0] + '_' + localStorage.getItem('UserId') + '.' + d.image_path.split('.')[1]}
                                        alt=''
                                        width={400}
                                        height={400}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <LineChart
                                        style={{ fontSize: 'calc(5px + 2vmin)'}}
                                        width={1000}
                                        height={400}
                                        margin={{
                                            right: 70
                                        }}
                                        data={[
                                            {name: 'Cardiomegaly', value: (d.cardiomegaly * 100).toFixed(2)},
                                            {name: 'Edema', value: (d.edema * 100).toFixed(2)},
                                            {name: 'Consolidation', value: (d.consolidation * 100).toFixed(2)},
                                            {name: 'Atelectasis', value: (d.atelectasis * 100).toFixed(2)},
                                            {name: 'Pleural effusion', value: (d.pleural_effusion * 100).toFixed(2)}
                                        ]}>
                                        <XAxis dataKey='name'/>
                                        <YAxis/>
                                        <CartesianGrid/>
                                        <Tooltip/>
                                        <Line dataKey='value'/>
                                    </LineChart>
                                </Grid>
                                <Grid container item xs={4} alignContent='center' alignItems='center' justify='center'>
                                    <Button onClick={() => this.updateFeedbackHandler(i, d.userFeedback.id)}>
                                        Update feedback
                                    </Button>
                                </Grid>
                                <Grid container item xs={8}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Cardiomegaly</TableCell>
                                                <TableCell>Edema</TableCell>
                                                <TableCell>Consolidation</TableCell>
                                                <TableCell>Atelectasis</TableCell>
                                                <TableCell>Pleural effusion</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>{(d.cardiomegaly * 100).toFixed(2) + '%'}</TableCell>
                                                <TableCell>{(d.edema * 100).toFixed(2) + '%'}</TableCell>
                                                <TableCell>{(d.consolidation * 100).toFixed(2) + '%'}</TableCell>
                                                <TableCell>{(d.atelectasis * 100).toFixed(2) + '%'}</TableCell>
                                                <TableCell>{(d.pleural_effusion * 100).toFixed(2) + '%'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <RadioGroup name='cardiomegaly' value={d.userFeedback.cardiomegaly} onChange={e => this.feedbackChangeHandler(e, d.userFeedback.user_access_details_id)}>
                                                        <FormControlLabel control={<Radio/>} label='Yes' value='Yes'/>
                                                        <FormControlLabel control={<Radio/>} label='No' value='No'/>
                                                    </RadioGroup>
                                                </TableCell>
                                                <TableCell>
                                                    <RadioGroup name='edema' value={d.userFeedback.edema} onChange={e => this.feedbackChangeHandler(e, d.userFeedback.user_access_details_id)}>
                                                        <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                                        <FormControlLabel control={<Radio/>} label='No' value='No' />
                                                    </RadioGroup>
                                                </TableCell>
                                                <TableCell>
                                                    <RadioGroup name='consolidation' value={d.userFeedback.consolidation} onChange={e => this.feedbackChangeHandler(e, d.userFeedback.user_access_details_id)}>
                                                        <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                                        <FormControlLabel control={<Radio/>} label='No' value='No' />
                                                    </RadioGroup>
                                                </TableCell>
                                                <TableCell>
                                                    <RadioGroup name='atelectasis' value={d.userFeedback.atelectasis} onChange={e => this.feedbackChangeHandler(e, d.userFeedback.user_access_details_id)}>
                                                        <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                                        <FormControlLabel control={<Radio/>} label='No' value='No' />
                                                    </RadioGroup>
                                                </TableCell>
                                                <TableCell>
                                                    <RadioGroup name='pleural_effusion' value={d.userFeedback.pleural_effusion} onChange={e => this.feedbackChangeHandler(e, d.userFeedback.user_access_details_id)}>
                                                        <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                                        <FormControlLabel control={<Radio/>} label='No' value='No' />
                                                    </RadioGroup>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        )
                    })}
                <Button onClick={this.home} variant="contained" style={{ marginTop: '1%' }}>
                    Home
                </Button>
                {this.alert()}
            </Grid>
        )
    }

    alert = () => (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={this.state.open}
            onClose={() => this.setState({ open: !this.state.open })}
            autoHideDuration={3000}
            message={this.state.message}
        />
    )

    feedbackChangeHandler = (e, id) => {
        const {name, value} = e.target;
        var index = this.state.data.findIndex(x => x.userFeedback.user_access_details_id === id);
        var newState = [...this.state.data]
        newState[index].userFeedback = {
            ...newState[index].userFeedback,
                [name]: value
        }
        this.setState({
            data: newState
        })
    }

    updateFeedbackHandler = (index, id) => {
        this.setState({
            loading: true
        })
        fetch(server+'/feedback/'+id, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                feedback: this.state.data[index].userFeedback
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
                console.log(response)
                if (response.status === 200) {
                    this.setState({
                        loading: false,
                        open: true,
                        message: 'Feedback successfully updated'
                    })
                } else {
                    this.setState({
                        loading: false,
                        open: true,
                        message: 'Error in updating feedback, try after some time'
                    })
                }
            }
        ).catch(e => {
            this.setState({
                loading: false,
                open: true,
                message: e
            })
        })
    }

    home = () => {
        this.props.historyAction(false);
        this.setState({
            home: true
        })
    }

    render() {
        if(this.state.loading) {
            return(
                <Grid container item justify='center' alignItems='center' style={{ minHeight: '80vh' }}>
                    <CircularProgress
                        disableShrink
                    />
                </Grid>
            )
        } else {
            if (this.state.home) {
                return <UploadImage/>
            } else {
                return this.history();
            }
        }
    }
}

const mapStateToProps = state => ({
    userId: state.userId
})

const mapDispatchToProps = dispatch => ({
    historyAction: status => {
        dispatch(history(status))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(History));
