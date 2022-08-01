import React, { Component } from 'react';
import './UploadImage.css';
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

class UploadImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedXrayFile: null,
            selectedReportFile: null,
            responseData: null,
            loading: true,
            xrayPreview: null,
            xrayFileName: null,
            reportPreview: null,
            reportFileName: null,
            limit: false,
            invalidFile: null,
            open: false,
            alertMessage: '',
            isFeedbackSet: false,
            feedback: {
                cardiomegaly: null,
                edema: null,
                consolidation: null,
                atelectasis: null,
                pleural_effusion: null
            },
            feedbackSubmitted: false,
            inputSelection: 0,
        }
    }

    componentDidMount() {
        console.log(sessionStorage)
        if(sessionStorage.getItem('Login') && sessionStorage.getItem('is_radiologist') === '1') {
            console.log('Inside...')
            window.location.replace('/#/radiology')
        } else {
            this.setState({
                loading: false
            })
        }
    }

    onChangeHandlerXray = event => {
        var reader = new FileReader();
        const file = event.target.files[0];
        this.setState({
            selectedXrayFile: null,
            xrayPreview: null,
            xrayFileName: null
        })
        if (file) {
            const fileName = event.target.files[0].name;
            console.log(fileName)
            const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (extension === 'dcm' || extension === 'DCM' || extension === 'jpg' || extension === 'JPG' || extension === 'raw' || extension === 'RAW' || extension === 'jpeg' || extension === 'JPEG') {
                reader.onloadend = () => {
                    this.setState({
                        invalidFile: false,
                        selectedXrayFile: file,
                        xrayPreview: reader.result,
                        xrayFileName: fileName
                    })
                }
                reader.readAsDataURL(file)
            } else {
                this.setState({
                    invalidFile: true,
                    open: true,
                    alertMessage: 'Please upload valid xray'
                })

            }
        }
        console.log(this.state)
    }

    onChangeHandlerReport = event => {
        var reader = new FileReader();
        const file = event.target.files[0];
        this.setState({
            selectedReportFile: null,
            reportPreview: null,
            reportFileName: null
        })
        if (file) {
            const fileName = event.target.files[0].name;
            console.log(fileName)
            const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (extension === 'pdf' || extension === 'PDF') {
                reader.onloadend = () => {
                    this.setState({
                        invalidFile: false,
                        selectedReportFile: file,
                        reportPreview: reader.result,
                        reportFileName: fileName
                    })
                }
                reader.readAsDataURL(file)
            } else {
                this.setState({
                    open: true,
                    alertMessage: 'Please upload valid report',
                    invalidFile: true
                })
            }
        }
    }

    calculate = () => {
        console.log('State: ', this.state)
        this.setState({
            loading: true
        })
        if (this.state.selectedFile === null) {
            alert("Please select file.")
            this.setState({
                loading: false,
                open: true,
                alertMessage: 'Please select file.'
            })
        } else {
            var files = {
                xray: this.state.selectedXrayFile,
                report: this.state.selectedReportFile
            }
            let data = new FormData();
            data.append('xray', files.xray)
            data.append('report', files.report)
            data.append('cardiomegaly', this.state.cardiomegaly)
            data.append('edema', this.state.edema)
            data.append('consolidation', this.state.consolidation)
            data.append('atelectasis', this.state.atelectasis)
            data.append('pleural_effusion', this.state.pleural_effusion)
            data.append('active_tuberculosis', this.state.active_tuberculosis)
            data.append('healed_tuberculosis', this.state.healed_tuberculosis)
            data.append('metastasis', this.state.metastasis)
            data.append('mass_lesion', this.state.mass_lesion)
            data.append('calcification', this.state.calcification)
            data.append('none', this.state.none)

            fetch(server + "/calculate/" + sessionStorage.getItem('UserId'), {
                method: 'POST',
                mode: 'cors',
                body: data,
                headers: {
                    "Accept": "application/form-data",
                    "Access-Control-Allow-Origin": "*",
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
            }).then(responseJson => {
                if (responseJson.data === null) {
                    this.setState({
                        loading: false,
                        limit: true
                    })
                } else {
                    this.setState({
                        loading: false,
                        responseData: responseJson.data,
                        xrayPreview: null,
                        selectedXrayFile: null,
                        xrayFileName: null,
                        reportPreview: null,
                        selectedReportFile: null,
                        reportFileName: null,
                        open: true,
                        alertMessage: 'File submitted successfully',
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
                    // this.props.resultAction(true)
                }
            })
                .catch(error => console.log(error))
        }
    }

    uploadImage = () => {
        return (
            <div style={{ flexGrow: 1, padding: '3%', margin: '3%' }}>
                <Grid container item direction='row' sm wrap='wrap' alignItems='center' alignContent='center' justify='center' spacing={2} >
                    <Grid container item sm={3} direction='column' justify='center' alignItems='center' wrap='wrap'>
                        <Grid container item sm direction='column' justify='center' alignItems='center' wrap='wrap'>
                            <Typography style={{ padding: '5px 10px' }} variant='h4'>Instructions</Typography>
                            <Typography style={{ padding: '2px' }}>Sample xray</Typography>
                            <img
                                id="target"
                                src={server + '/sample.jpg'}
                                style={{ maxWidth: '100%' }}
                                alt='sample image'
                            />
                            <br />
                            <ul>
                                <li>Only raw files are valid for xray</li>
                                <li>Only pdf files are valid for report</li>
                                <li>Please upload properly cropped and aligned image<br />(Refer to the sample xray)</li>
                                <li>Please upload only black and white xray image</li>
                                <li>Only chest xrays are supported</li>
                            </ul>
                        </Grid>
                    </Grid>
                    <Grid container item sm direction='column' wrap='wrap'>
                        <Grid container item direction='column' justify='center' alignItems='center' sm wrap='wrap'>

                            <Grid container item direction='row' justify='center' alignItems='center' sm wrap='wrap'>
                                <Grid container item direction='column' justify='center' alignItems='center' sm wrap='wrap'>
                                    {/* <Typography style={{ padding: '5px 10px', marginTop: '-10%', marginBottom: '15%' }} variant='h4'>2. Upload</Typography> */}
                                    <label htmlFor='upload-button-xray'>
                                        <Input
                                            color='primary'
                                            id='upload-button-xray'
                                            type='file'
                                            onChange={this.onChangeHandlerXray}
                                        />
                                        <Button variant="contained" endIcon={<PhotoCamera />} component='span'>
                                            Upload Raw File
                                        </Button>
                                    </label>
                                    <img
                                        id="target-xray"
                                        src={this.state.xrayPreview}
                                        style={{ maxWidth: 320, maxHeight: 320 }}
                                        alt={this.state.xrayFileName}
                                    />
                                </Grid>
                                <Grid container item direction='column' justify='center' alignItems='center' sm wrap='wrap'>
                                    {/* <Typography style={{ padding: '5px 10px', marginTop: '-10%', marginBottom: '15%' }} variant='h4'>2. Upload</Typography> */}

                                    <label htmlFor='upload-button-report'>
                                        <Input
                                            color='primary'
                                            id='upload-button-report'
                                            type='file'
                                            onChange={this.onChangeHandlerReport}
                                        />
                                        <Button variant="contained" endIcon={<PhotoCamera />} component='span'>
                                            Report
                                        </Button>
                                    </label>
                                    <img
                                        id="target-report"
                                        src={this.state.reportPreview}
                                        style={{ maxWidth: 320, maxHeight: 320 }}
                                        alt={this.state.reportFileName}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* <Grid container item sm direction='column' wrap='wrap'> */}
                        <Grid container item direction='row' justify='center' alignItems='baseline' sm wrap='wrap' style={{ marginTop: '5%' }}>
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
                        <Grid container item direction='row' justify='center' alignItems='baseline' sm wrap='wrap'>
                            <Button
                                type="submit"
                                disabled={this.state.invalidFile || this.state.selectedXrayFile === null || this.state.inputSelection === 0}
                                onClick={this.calculate}
                                variant='contained'
                                style={{ marginRight: '5%', marginTop: '7.5%' }}
                            >
                                Submit
                            </Button>
                            <Button type='reset' onClick={this.goHome} variant='contained'>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                    {this.alert()}
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

    result = () => {
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
    }

    render() {
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
                return this.uploadImage();
            }
        } else {
            return <History />
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
    userAction: id => { dispatch(userId(id)) },
    userNameAction: name => { dispatch(userName(name)) },
    resultAction: status => {
        dispatch(result(status))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UploadImage));
