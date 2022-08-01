import React, { Component } from 'react';
import fs, { stat } from 'fs';
import './Radiology.css';
import History from '../History/History';
import { connect } from 'react-redux';
import { server } from '../../properties';
import { XAxis, YAxis, Legend, Bar, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import {
    Button,
    CircularProgress,
    Snackbar,
    Typography,
    Grid,
    TableBody,
    TableRow,
    TableCell,
    RadioGroup, FormControlLabel, Radio, Table, FormControl, TableContainer, List, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Checkbox, FormGroup
} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { history, result, login, userId, userName } from "../../redux/action";
import { threshold } from '../../constants/threshold';
import { ContactsOutlined, PhotoCamera } from '@material-ui/icons';
import { styled } from '@material-ui/styles';
import { Document, Page } from 'react-pdf';
import Header from '../Header/Header';

const Input = styled('input')({
    display: 'none',
});

const styles = theme => ({
    upload: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5%'
    },
})

class Radiology extends Component {

    constructor(props) {
        super(props);
        this.state = {
            responseData: null,
            loading: true,
            open: false,
            alertMessage: '',
            inputSelection: 0,
            pageNumber: null,
            data: [],
            index: 0
        }
    }

    componentDidMount() {
        this.props.historyAction(false)
        fetch(server + "/userInput" /* + sessionStorage.getItem('UserId') */, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Accept": "application/form-data",
                "Access-Control-Allow-Origin": "*",
                // "x-access-token": sessionStorage.getItem('access_token'),
                // "x-refresh-token": sessionStorage.getItem('refresh_token')
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
                sessionStorage.setItem('Login', true)
                this.setState({
                    data: responseJson,
                    loading: false
                })
            })
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
                        alertMessage: 'Something went wrong, please contact system admin'
                    })
                } else {
                    this.setState({
                        loading: false,
                        open: true,
                        alertMessage: 'Response submitted successfully',
                        index: this.state.index + 1,
                        inputSelection: 0,
                        cardiomegaly: undefined,
                        edema: undefined,
                        consolidation: undefined,
                        atelectasis: undefined,
                        pleural_effusion: undefined,
                        active_tuberculosis: undefined,
                        healed_tuberculosis: undefined,
                        metastasis: undefined,
                        mass_lesion: undefined,
                        calcification: undefined,
                        none: undefined
                    })
                    console.log(this.state)
                }
            })
            .catch(error => console.log(error))
    }

    radiology = () => {
        var { data, index } = this.state
        while (index < data.length) {
            var x = data[index];
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', server + '/' + x.image_path.split('.')[0] + '.' + x.image_path.split('.')[1], false);
            xhr.send();
            if (xhr.status == "404") {
                // console.log('File not exist')
                index++
                continue;
            } else {
                return (
                    <div style={{ flexGrow: 1, padding: '3%', margin: '3%' }}>
                        <Grid container item direction='column' sm wrap='wrap' alignItems='center' alignContent='center' justify='center' spacing={2} >
                            <Grid container item sm direction='row' justify='center' alignItems='center' wrap='wrap'>
                                <Grid container item sm direction='column' justify='center' alignItems='center' wrap='wrap'>

                                    <img
                                        id="target"
                                        src={server + '/' + x.processed_image_path}
                                        style={{ maxWidth: '100%' }}
                                        alt='image'
                                    />
                                </Grid>
                                <Grid container item sm direction='column' justify='center' alignItems='center' wrap='wrap'>
                                    {x.report_path === null ?
                                        <Typography variant='h6'> No report available </Typography> :
                                        <a href={server + '/' + x.report_path} target="_blank">Report</a>}
                                </Grid>
                                <Grid container item direction='column' justify='flex-start' alignItems='stretch' sm wrap='wrap'>
                                    <Grid container item direction='row' justify='center' alignItems='center' sm wrap='wrap'>
                                        <Typography variant='h4' >Level 1 Input</Typography><br />
                                    </Grid>
                                    <Grid container item direction='row' justify='center' alignItems='center' sm wrap='wrap' style={{ marginLeft: '5%' }}>
                                        <FormGroup>
                                            <FormControlLabel control={<Radio color='primary' name='cardiomegaly' checked={x.cardiomegaly === 1} disabled />} label="Cardiomegaly" />
                                            <FormControlLabel control={<Radio color='primary' name='edema' checked={x.edema === 1} disabled />} label="Edema" />
                                            <FormControlLabel control={<Radio color='primary' name='consolidation' checked={x.consolidation === 1} disabled />} label="Consolidation" />
                                            <FormControlLabel control={<Radio color='primary' name='atelectasis' checked={x.atelectasis === 1} disabled />} label="Atelectasis" />
                                            <FormControlLabel control={<Radio color='primary' name='pleural_effusion' checked={x.pleural_effusion === 1} disabled />} label="Pleural Effusion" />
                                            <FormControlLabel control={<Radio color='primary' name='active_tuberculosis' checked={x.active_tuberculosis === 1} disabled />} label="Active Tuberculosis" />
                                            <FormControlLabel control={<Radio color='primary' name='healed_tuberculosis' checked={x.healed_tuberculosis === 1} disabled />} label="Healed Tuberculosis" />
                                            <FormControlLabel control={<Radio color='primary' name='metastasis' checked={x.metastasis === 1} disabled />} label="Metastasis" />
                                            <FormControlLabel control={<Radio color='primary' name='mass_lesion' checked={x.mass_lesion === 1} disabled />} label="Mass Lesion" />
                                            <FormControlLabel control={<Radio color='primary' name='calcification' checked={x.calcification === 1} disabled />} label="Calcification" />
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid container item sm direction='column' wrap='wrap'>
                                <Grid container item direction='row' justify='center' alignItems='baseline' sm wrap='wrap'>
                                    <Grid container item direction='column' justify='flex-start' alignItems='stretch' sm wrap='wrap'>
                                        <Grid container item direction='row' justify='center' alignItems='center' sm wrap='wrap'>
                                            <Typography variant='h4' >Please select the condition(s) for the uploaded X-Ray</Typography><br />
                                        </Grid>
                                        <Grid container item direction='row' justify='center' alignItems='center' sm wrap='wrap'>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox color='primary' name='cardiomegaly' onChange={this.onChange} />} label="Cardiomegaly" />
                                                <FormControlLabel control={<Checkbox color='primary' name='edema' onChange={this.onChange} />} label="Edema" />
                                                <FormControlLabel control={<Checkbox color='primary' name='consolidation' onChange={this.onChange} />} label="Consolidation" />
                                            </FormGroup>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox color='primary' name='atelectasis' onChange={this.onChange} />} label="Atelectasis" />
                                                <FormControlLabel control={<Checkbox color='primary' name='pleural_effusion' onChange={this.onChange} />} label="Pleural Effusion" />
                                                <FormControlLabel control={<Checkbox color='primary' name='active_tuberculosis' onChange={this.onChange} />} label="Active Tuberculosis" />
                                            </FormGroup>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox color='primary' name='healed_tuberculosis' onChange={this.onChange} />} label="Healed Tuberculosis" />
                                                <FormControlLabel control={<Checkbox color='primary' name='metastasis' onChange={this.onChange} />} label="Metastasis" />
                                                <FormControlLabel control={<Checkbox color='primary' name='mass_lesion' onChange={this.onChange} />} label="Mass Lesion" />
                                            </FormGroup>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox color='primary' name='calcification' onChange={this.onChange} />} label="Calcification" />
                                                <FormControlLabel control={<Checkbox color='primary' name='none' onChange={this.onChange} />} label="None" />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container item direction='row' justify='center' alignItems='center' sm wrap='wrap'>
                                    <Button
                                        type="submit"
                                        disabled={this.state.inputSelection == 0}
                                        onClick={() => {
                                            this.calculate(x.id)
                                            index++
                                        }}
                                        variant='contained'
                                        style={{ marginRight: '2.5%', marginTop: '1%' }}
                                    >
                                        Submit
                                    </Button>
                                    <Button type='reset' onClick={this.goHome} variant='contained' style={{ marginLeft: '2.5%', marginTop: '1%' }}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                            {this.alert()}
                        </Grid>
                    </div>
                )
            }
        }
        return (
            <div style={{ flexGrow: 1, padding: '3%', margin: '3%' }}>
                <Grid container item direction='column' sm wrap='wrap' alignItems='center' alignContent='center' justify='center' spacing={2} >
                    <Typography variant='h3'>
                        Nothing to show
                    </Typography>
                </Grid>
            </div>
        )
    }

    goHome = () => {
        window.location.reload();
        // this.setState({
        //     selectedFile: null,
        //     preview: null,
        //     limit: null
        // })
    }

    onChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.checked,
            inputSelection: event.target.checked === true ? this.state.inputSelection + 1 : (this.state.inputSelection === 0 ? 0 : this.state.inputSelection - 1)
        })
    }

    alert = () => (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={this.state.open}
            onClose={() => this.setState({ open: !this.state.open })}
            autoHideDuration={2000}
            message={this.state.alertMessage}
        />
    )

    /* result = () => {
        if (this.state.responseData.isError === 'true' && this.state.responseData.message == 'Raising error: unwantedImage') {
            return (
                <Dialog
                    open={this.state.responseData.isError === 'true' && this.state.responseData.message == 'Raising error: unwantedImage'}
                    onClose={this.goHome}
                >
                    <DialogTitle style={{ backgroundColor: '#3F51B5', color: 'white' }}>{"Invalid Image"}</DialogTitle>
                    <DialogContent style={{ marginTop: 20 }}>
                        <DialogContentText color='black'>
                            Please upload valid chest x-ray image.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.goHome}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            )
        } else if (this.state.responseData.isError === 'false') {
            const d = this.state.responseData.result;
            const data = [
                {
                    'name': 'Cardiomegaly',
                    'value': (d[2] * 100).toFixed(2),
                    'threshold': threshold.Cardiomegaly,
                }, {
                    'name': 'Edema',
                    'value': (d[3] * 100).toFixed(2),
                    'threshold': threshold.Edema,
                }, {
                    'name': 'Consolidation',
                    'value': (d[4] * 100).toFixed(2),
                    'threshold': threshold.Consolidation,
                }, {
                    'name': 'Atelectasis',
                    'value': (d[5] * 100).toFixed(2),
                    'threshold': threshold.Atelectasis,
                }, {
                    'name': 'Pleural Effusion',
                    'value': (d[6] * 100).toFixed(2),
                    'threshold': threshold.Pleural_Effusion,
                }
            ]
            const colors = ['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921']
            return (
                <div style={{ flexGrow: 1, padding: '5%' }}>
                    <Grid container justify='center' wrap='wrap' spacing={1} direction='column'>
                        <Grid item sm container wrap='wrap' justify='center' alignItems='center' spacing={1} >
                            <Grid container item sm alignContent='center' alignItems='center' justify='center' wrap='wrap'>
                                <img
                                    src={server + '/' + d[1].split('.')[0] + '_' + sessionStorage.getItem('UserId') + '.' + d[1].split('.')[1]}
                                    style={{ maxWidth: '100%' }}
                                    alt='' />
                            </Grid>
                            <Grid container item sm alignContent='center' alignItems='center' justify='center' wrap='wrap'>
                                <TableContainer>
                                    <ResponsiveContainer height={400} minWidth={700}>
                                        <ComposedChart data={data}>
                                            <XAxis dataKey='name' />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend
                                                align='center'
                                                verticalAlign='bottom'
                                                content={() => (
                                                    <List style={{ display: 'flex', flexDirection: "row", flexWrap: 'wrap', paddingLeft: '10%' }}>
                                                        <li style={{ color: 'black', listStyleType: 'square', marginRight: '5%' }}>
                                                            <Typography variant='caption' style={{ color: "black" }}>cut-off line</Typography>
                                                        </li>
                                                    </List>
                                                )} />
                                            <Bar dataKey='value'>
                                                {
                                                    data.map((entry, i) => (
                                                        <Cell key={`cell-${i}`} fill={colors[i]} stroke={colors[i]} />
                                                    ))
                                                }
                                            </Bar>
                                            <Line dataKey='threshold' stroke='black' />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </TableContainer>
                            </Grid>
                        </Grid>
                        <Grid item sm container wrap='wrap' alignContent='center' alignItems='center' justify='center' spacing={1}>
                            <Grid container item sm alignContent='center' alignItems='center' justify='center' wrap='wrap'>
                                <ul>
                                    <li>Bar graph of any condition above the cut-off line indicates the positive result of that condition in the supplied xray</li>
                                    <li>Please submit your analysis of xray conditions through the table below the graph.</li>
                                    <li>Select Yes/No for all conditions and press 'Submit Feedback' button</li>
                                    <li>Please refrain from submitting incomplete/wrong feedback</li>
                                </ul>
                                <Button
                                    variant='contained'
                                    onClick={this.submitFeedback}
                                    disabled={
                                        this.state.feedback.cardiomegaly === null ||
                                        this.state.feedback.edema === null ||
                                        this.state.feedback.consolidation === null ||
                                        this.state.feedback.atelectasis === null ||
                                        this.state.feedback.pleural_effusion === null
                                    }>
                                    Submit feedback
                                </Button>
                            </Grid>
                            <Grid container item sm wrap='wrap'>
                                <TableContainer>
                                    <Table style={{ border: '2px solid black', minWidth: 650 }}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align='center'>Cardiomegaly</TableCell>
                                                <TableCell align='center'>Edema</TableCell>
                                                <TableCell align='center'>Consolidation</TableCell>
                                                <TableCell align='center'>Atelectasis</TableCell>
                                                <TableCell align='center'>Pleural effusion</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center'>{(d[2] * 100).toFixed(2) + '%'}</TableCell>
                                                <TableCell align='center'>{(d[3] * 100).toFixed(2) + '%'}</TableCell>
                                                <TableCell align='center'>{(d[4] * 100).toFixed(2) + '%'}</TableCell>
                                                <TableCell align='center'>{(d[5] * 100).toFixed(2) + '%'}</TableCell>
                                                <TableCell align='center'>{(d[6] * 100).toFixed(2) + '%'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align='center'>
                                                    <FormControl>
                                                        <RadioGroup name='cardiomegaly' onChange={e => this.feedbackChangeHandler(e)}>
                                                            <FormControlLabel control={<Radio />} label='Yes' value='Yes' />
                                                            <FormControlLabel control={<Radio />} label='No' value='No' />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControl>
                                                        <RadioGroup name='edema' onChange={e => this.feedbackChangeHandler(e)}>
                                                            <FormControlLabel control={<Radio />} label='Yes' value='Yes' />
                                                            <FormControlLabel control={<Radio />} label='No' value='No' />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControl>
                                                        <RadioGroup name='consolidation' onChange={e => this.feedbackChangeHandler(e)}>
                                                            <FormControlLabel control={<Radio />} label='Yes' value='Yes' />
                                                            <FormControlLabel control={<Radio />} label='No' value='No' />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControl>
                                                        <RadioGroup name='atelectasis' onChange={e => this.feedbackChangeHandler(e)}>
                                                            <FormControlLabel control={<Radio />} label='Yes' value='Yes' />
                                                            <FormControlLabel control={<Radio />} label='No' value='No' />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControl>
                                                        <RadioGroup name='pleural_effusion' onChange={e => this.feedbackChangeHandler(e)}>
                                                            <FormControlLabel control={<Radio />} label='Yes' value='Yes' />
                                                            <FormControlLabel control={<Radio />} label='No' value='No' />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            )
        } else {
            this.setState({
                open: true,
                alertMessage: 'Error occured, contact system admin'
            })
            return this.alert();
        }
    }
    
    feedbackChangeHandler = (e) => {
        const { name, value } = e.target;
        this.setState({
            feedback: {
                ...this.state.feedback,
                [name]: value
            }
        })
    }
    
    submitFeedback = () => {
        this.props.resultAction(false)
        this.setState({
            loading: true
        })
        fetch(server + '/feedback/' + this.state.responseData.feedbackResponseId, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                feedback: this.state.feedback
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 200) {
                this.setState({
                    loading: false,
                    feedbackSubmitted: true,
                    selectedFile: null,
                    responseData: null,
                    preview: null,
                    limit: false,
                    open: true,
                    alertMessage: 'feedback added successfully'
                })
            } else {
                this.setState({
                    loading: false,
                    selectedFile: null,
                    responseData: null,
                    preview: null,
                    limit: false,
                    open: true,
                    alertMessage: 'error while submitting feedback'
                })
            }
        })
    } */

    /* render() {
        if (!this.props.history.history) {
            if (this.state.loading) {
                return (
                    <Grid container item justify='center' alignItems='center' style={{ minHeight: '80vh' }}>
                        <CircularProgress
                            disableShrink
                        />
                    </Grid>
                )
            } else if (this.props.result.result) {
                return this.result();
            } else if (this.state.limit) {
                return (
                    <Grid container justify='center' direction='column' alignItems='center' style={{ minHeight: '80vh' }}>
                        <Typography variant="h4">
                            You have reached max limit. Please contact admin
                        </Typography>
                        <br />
                        <Button onClick={this.goHome}>
                            Home
                        </Button>
                    </Grid>
                )
            } else {
                return this.radiology();
            }
        } else {
            return <History />
        }
    
    } */

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
            return this.radiology();
        }
    }
}

const mapStateToProps = state => ({
    userId: state.userId,
    history: state.history,
    result: state.result,
    login: state.login
})

const mapDispatchToProps = dispatch => ({
    loginAction: status => { dispatch(login(status)) },
    historyAction: status => {
        dispatch(history(status))
    },
    userAction: id => { dispatch(userId(id)) },
    userNameAction: name => { dispatch(userName(name)) },
    resultAction: status => {
        dispatch(result(status))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Radiology));
