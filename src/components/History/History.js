import React from 'react';
import { Component } from 'react';
import './History.css';
import UploadImage from '../UploadImage/UploadImage';
import { connect } from 'react-redux';
import { login, history, result } from '../../redux/action';
import { server } from '../../properties';
import { XAxis, YAxis, Bar, Legend, Line, ComposedChart, Cell } from 'recharts';
import {
    Grid,
    TableBody,
    TableRow,
    TableCell,
    withStyles,
    Typography,
    FormControlLabel,
    Radio,
    RadioGroup,
    Table,
    CircularProgress, Snackbar, FormControl, FormGroup, Button, Checkbox
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Tooltip } from 'recharts';

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
        alignContent: 'center',
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
            page: 1,
            content: null,
            isUpdate: false,
            inputSelection: 0,
            config: [],
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true })
        fetch(server + '/history', {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                // "x-access-token": sessionStorage.getItem('access_token'),
                // "x-refresh-token": sessionStorage.getItem('refresh_token')
            }
        }).then(respose => {
            if (respose.status === 401) {
                sessionStorage.clear();
                this.props.loginAction(false);
                window.location.replace('/')
            } else if (respose.status === 200) {
                this.props.historyAction(true);
            }
            return respose.json()
        })
            .then(responseJson => {
                console.log(responseJson)
                if (responseJson.accessToken) {
                    console.log('token: ', responseJson.accessToken)
                    // sessionStorage.setItem('access_token', responseJson.accessToken)
                }
                this.setState({
                    config: responseJson.configuration,
                    data: responseJson.data,
                    loading: false,
                    isUpdate: false
                })
            }).catch(e => console.log(e))
    }


    calculate = (userAccessId) => {
        this.setState({
            loading: true
        })
        fetch(server + "/userInput", {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                cardiomegaly: this.state.cardiomegaly,
                edema: this.state.edema,
                consolidation: this.state.consolidation,
                atelectasis: this.state.atelectasis,
                pleural_effusion: this.state.pleural_effusion,
                active_tuberculosis: this.state.active_tuberculosis,
                healed_tuberculosis: this.state.healed_tuberculosis,
                metastasis: this.state.metastasis,
                mass_lesion: this.state.mass_lesion,
                calcification: this.state.calcification,
                none: this.state.none,
                userAccessId: userAccessId,
            }),
            headers: {
                "Content-Type": "application/json",
                "x-access-token": sessionStorage.getItem('access_token'),
                "x-refresh-token": sessionStorage.getItem('refresh_token')
            },
        }).then(response => {
            if (response.status === 401) {
                sessionStorage.clear();
                this.props.loginAction(false);
                window.location.replace('/')
            }
            return response.json()
        })
            .then(responseJson => {
                console.log(responseJson)
                if (responseJson.access_token) {
                    sessionStorage.setItem('access_token', responseJson.access_token)
                }
                if (responseJson.status === 500) {
                    this.setState({
                        loading: false,
                        open: true,
                        alertMessage: 'Something went wrong, please contact system admin',
                        isUpdate: false
                    })
                } else {
                    this.getData()
                    console.log(this.state)
                }
            })
            .catch(error => console.log(error))
    }

    history = () => {
        var { data, page, content } = this.state;
        if (data.length === 0 && content === null) {
            return (
                <div style={{ flexGrow: 1, padding: '3%', margin: '3%' }}>
                    <Grid container item direction='column' sm wrap='wrap' alignItems='center' alignContent='center' justify='center' spacing={2} >
                        <Typography variant='h3'>
                            No AI data found
                        </Typography>
                    </Grid>
                </div>
            )
        } else {
            content = data[page - 1]
            const chartData = [
                {
                    'name': 'Cardiomegaly',
                    'value': (content.score.cardiomegaly * 100).toFixed(2),
                    'threshold': 46.52,
                }, {
                    'name': 'Edema',
                    'value': (content.score.edema * 100).toFixed(2),
                    'threshold': 71.05,
                }, {
                    'name': 'Consolidation',
                    'value': (content.score.consolidation * 100).toFixed(2),
                    'threshold': 65.9,
                }, {
                    'name': 'Atelectasis',
                    'value': (content.score.atelectasis * 100).toFixed(2),
                    'threshold': 54.93,
                }, {
                    'name': 'Pleural Effusion',
                    'value': (content.score.pleural_effusion * 100).toFixed(2),
                    'threshold': 34.61,
                }
            ]
            const colors = ['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921']
            return (
                <div style={{ flexGrow: 1, margin: '1.5%' }}>
                    <Grid container item direction='column' sm wrap='wrap' alignItems='center' alignContent='center' justify='center' spacing={2} >
                        <Grid container item direction='row' justify='center' alignItems='center' wrap='wrap'>
                            <Grid container item direction='column' justify='center' alignItems='center' sm={3} wrap='wrap'>
                                <img
                                    style={{ maxWidth: '100%', marginBottom: '10%' }}
                                    src={server + '/' + content.processed_image_path}
                                    alt='X-Ray'
                                />
                                {content.report_path === null ?
                                    <Typography variant='h5'> No report available </Typography> :
                                    <a href={server + '/' + content.report_path} target="_blank">Report</a>}
                            </Grid>
                            <Grid container item direction='column' justify='center' alignItems='center' sm wrap='wrap'>
                                <ComposedChart
                                    style={{ fontSize: 'calc(5px + 2vmin)' }}
                                    width={1000}
                                    height={600}
                                    data={chartData}>
                                    <XAxis tick={false} dataKey='name' />
                                    <YAxis interval="preserveStartEnd" domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend align='right' layout='vertical' verticalAlign='middle' content={() => (
                                        <ul>
                                            {
                                                chartData.map((entry, i) => (
                                                    <li key={i} style={{ color: colors[i], listStyleType: 'square' }}>
                                                        <p style={{ color: "black" }}>{entry.name}</p>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    )} />
                                    <Bar dataKey='value'>
                                        {
                                            chartData.map((entry, i) => (
                                                <Cell key={`cell-${i}`} fill={colors[i]} stroke={colors[i]} />
                                            ))
                                        }
                                    </Bar>
                                    {/* <Line dataKey='threshold' /> */}
                                </ComposedChart>
                            </Grid>
                        </Grid>
                        <Grid container item direction='row' justify='center' alignItems='center' wrap='wrap'>
                            <Grid container item direction='column' justify='center' alignItems='center' sm wrap='wrap'>
                                <Table style={{ border: '2px solid black' }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align='center'></TableCell>
                                            <TableCell align='center'>Cardiomegaly</TableCell>
                                            <TableCell align='center'>Edema</TableCell>
                                            <TableCell align='center'>Consolidation</TableCell>
                                            <TableCell align='center'>Atelectasis</TableCell>
                                            <TableCell align='center'>Pleural effusion</TableCell>
                                            <TableCell align='center'>Active Tuberculosis</TableCell>
                                            <TableCell align='center'>Healed Tuberculosis</TableCell>
                                            <TableCell align='center'>Metastasis</TableCell>
                                            <TableCell align='center'>Mass Lesion</TableCell>
                                            <TableCell align='center'>Calcification</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>1<sup>st</sup> Level</TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.userInput.cardiomegaly === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.userInput.edema === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.userInput.consolidation === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.userInput.atelectasis === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.userInput.pleural_effusion === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.userInput.active_tuberculosis === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.userInput.healed_tuberculosis === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.userInput.metastasis === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.userInput.mass_lesion === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.userInput.calcification === 1} disabled />} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>2<sup>nd</sup> Level</TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.radiologistInput.cardiomegaly === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.radiologistInput.edema === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.radiologistInput.consolidation === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.radiologistInput.atelectasis === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.radiologistInput.pleural_effusion === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.radiologistInput.active_tuberculosis === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.radiologistInput.healed_tuberculosis === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.radiologistInput.metastasis === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.radiologistInput.mass_lesion === 1} disabled />} />
                                            </TableCell>
                                            <TableCell align='center'>
                                                <FormControlLabel control={<Radio color='primary' checked={content.radiologistInput.calcification === 1} disabled />} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        {this.state.config[0].allow_radiologist_reassess === 'true' ? (this.state.isUpdate ?
                            <Grid container item direction='row' justify='center' alignItems='center' wrap='wrap'>
                                <Grid container item direction='column' justify='center' alignItems='center' sm wrap='wrap'>
                                    <Table style={{ border: '2px solid black' }}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align='center'></TableCell>
                                                <TableCell align='center'>Cardiomegaly</TableCell>
                                                <TableCell align='center'>Edema</TableCell>
                                                <TableCell align='center'>Consolidation</TableCell>
                                                <TableCell align='center'>Atelectasis</TableCell>
                                                <TableCell align='center'>Pleural effusion</TableCell>
                                                <TableCell align='center'>Active Tuberculosis</TableCell>
                                                <TableCell align='center'>Healed Tuberculosis</TableCell>
                                                <TableCell align='center'>Metastasis</TableCell>
                                                <TableCell align='center'>Mass Lesion</TableCell>
                                                <TableCell align='center'>Calcification</TableCell>
                                                <TableCell align='center'>None</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Update 2<sup>nd</sup> Level Input</TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='cardiomegaly' onChange={this.onChange} />} />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='edema' onChange={this.onChange} />} />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='consolidation' onChange={this.onChange} />} />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='atelectasis' onChange={this.onChange} />} />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='pleural_effusion' onChange={this.onChange} />} />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='active_tuberculosis' onChange={this.onChange} />} />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='healed_tuberculosis' onChange={this.onChange} />} />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='metastasis' onChange={this.onChange} />} />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='mass_lesion' onChange={this.onChange} />} />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='calcification' onChange={this.onChange} />} />
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControlLabel control={<Checkbox color='primary' name='none' onChange={this.onChange} />} />
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <Grid container item direction='row' justify='center' alignItems='center' sm wrap='wrap'>
                                        <Button onClick={() => this.calculate(sessionStorage.getItem('UserId'))}> Save </Button>
                                        <Button onClick={() => { this.setState({ isUpdate: false }) }}> Cancel </Button>
                                    </Grid>
                                </Grid>
                            </Grid> :
                            <Grid container item direction='row' justify='center' alignItems='center' wrap='wrap'>
                                <Grid container item direction='column' justify='center' alignItems='center' sm wrap='wrap'>
                                    <Button shape='rounded' variant='outlined' size='large' onClick={() => {
                                        this.setState({
                                            isUpdate: true,
                                        })
                                    }} >
                                        Update Input
                                    </Button>
                                </Grid>
                            </Grid>) : null}

                        <Grid container item direction='row' justify='center' alignItems='center' wrap='wrap'>
                            <Grid container item direction='column' justify='center' alignItems='center' sm wrap='wrap'>
                                <Pagination shape='rounded' variant='outlined' size='large' count={data.length} page={page} onChange={(event, value) => {
                                    this.setState({
                                        page: value,
                                    })
                                }} />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            )
        }
    }

    alert = () => (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={this.state.open}
            onClose={() => this.setState({ open: !this.state.open })}
            autoHideDuration={2000}
            message={this.state.message}
        />
    )

    onChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.checked,
            inputSelection: event.target.checked === true ? this.state.inputSelection + 1 : (this.state.inputSelection === 0 ? 0 : this.state.inputSelection - 1)
        })
    }

    feedbackChangeHandler = (e, id) => {
        const { name, value } = e.target;
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
        fetch(server + '/feedback/' + id, {
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
        if (this.state.loading) {
            return (
                <Grid container item justify='center' alignItems='center' style={{ minHeight: '80vh' }}>
                    <CircularProgress
                        disableShrink
                    />
                </Grid>
            )
        } else {
            if (this.state.home) {
                return <UploadImage />
            } else {
                return this.history();
            }
        }
    }
}

const mapStateToProps = state => ({
    login: state.login,
    history: state.history,
    userName: state.userName,
    userId: state.userId
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(History));
