import React, {Component} from 'react';
import './UploadImage.css';
import History from '../History/History';
import {connect} from 'react-redux';
import {server} from '../../properties';
import {XAxis, YAxis, Legend, Bar, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip} from 'recharts';
import {
    Button,
    CircularProgress,
    Snackbar,
    Typography,
    Grid,
    TableBody,
    TableRow,
    TableCell,
    RadioGroup, FormControlLabel, Radio, Table, FormControl, TableContainer, List, Paper
} from '@material-ui/core';
import {withStyles} from "@material-ui/core/styles";
import {history, result} from "../../redux/action";
import { threshold } from '../../constants/threshold';

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
            selectedFile: null,
            responseData: null,
            loading: false,
            preview: null,
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
            feedbackSubmitted: false
        }
    }

    onChangeHandler = event => {
        var reader = new FileReader();
        const file = event.target.files[0];
        this.setState({
            selectedFile: null,
            preview: null
        })
        if(file) {
            const fileName = event.target.files[0].name;
            const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (extension === 'jpg' || extension === 'png' || extension === 'jpeg' || extension === 'JPG' || extension === 'PNG' || extension === 'JPEG') {
                reader.onloadend = () => {
                    this.setState({
                        invalidFile: false,
                        selectedFile: file,
                        preview: reader.result
                    })
                }
                reader.readAsDataURL(file)
            } else {
                this.setState({
                    invalidFile: true,
                    open: true,
                    alertMessage: 'Invalid file.'
                })
            }
        }
    }

    calculate = () => {
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
            let data = new FormData();
            data.append('image', this.state.selectedFile)
            fetch(server + "/calculate/" + sessionStorage.getItem('UserId'), {
                method: 'POST',
                mode: 'cors',
                body: data,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            }).then(response => response.json())
                .then(responseJson => {
                    if (responseJson.data === null) {
                        this.setState({
                            loading: false,
                            limit: true
                        })
                    } else {
                        this.setState({
                            loading: false,
                            responseData: responseJson.data,
                            preview: null,
                            selectedFile: null
                        })
                        this.props.resultAction(true)
                    }
                })
                .catch(error => console.log(error))
        }
    }

    uploadImage = () => {
        return(
            <div style={{ flexGrow: 1, padding: '7%' }}>
            <Grid container wrap='wrap' alignItems='center' alignContent='center' justify='center' spacing={2} >
                <Grid container item sm direction='column' justify='center' alignItems='center' wrap='wrap'>
                    <Typography style={{ padding: '2px' }}>Sample xray</Typography>
                    <img
                        id="target"
                        src={server + '/sample.jpg'}
                        style={{ maxWidth: '100%' }}
                        alt='sample image'
                    />
                    <br/>
                    <Grid>
                        <Button disabled style={{ padding: '6px 8px' }}>
                        </Button>
                        <Button disabled>
                        </Button>
                    </Grid>
                </Grid>
                <Grid container item direction='column' justify='center' alignItems='center' sm wrap='wrap'>
                    <input
                        color='inherit'
                        type='file'
                        accept='image/*'
                        onChange={this.onChangeHandler}
                    />
                    <img
                        id="target"
                        src={this.state.preview}
                        style={{ maxWidth: '100%' }}
                        alt=''
                    />
                    <br/>
                    <Grid>
                        <Button
                            type="submit"
                            disabled={this.state.invalidFile || this.state.selectedFile === null}
                            onClick={this.calculate}>
                            Upload
                        </Button>
                        <Button type='reset' onClick={this.goHome}>
                            Cancel
                        </Button>
                    </Grid>
                    {this.alert()}
                </Grid>
                <Grid container item sm justify='center' alignItems='center' alignContent='center' wrap='wrap'>
                    <ul>
                        <li>Only jpg, jpeg and png images are valid</li>
                        <li>Please upload properly cropped and aligned image<br/>(Refer to the sample xray)</li>
                        <li>Please upload only black and white xray image</li>
                        <li>At this moment, we support only chest xrays</li>
                    </ul>
                </Grid>
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

    alert = () => (
        <Snackbar
            anchorOrigin={{vertical: "top", horizontal: "center"}}
            open={this.state.open}
            onClose={() => this.setState({open: !this.state.open})}
            autoHideDuration={2000}
            message={this.state.alertMessage}
        />
    )

    result = () => {
        if (this.state.responseData.isError === 'false') {
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
            const colors = ['#5BC0EB','#FDE74C','#9BC53D','#E55934','#FA7921']
            return(
                <div style={{ flexGrow: 1, padding: '5%' }}>
                    <Grid container justify='center' wrap='wrap' spacing={1} direction='column'>
                        <Grid item sm container wrap='wrap' justify='center' alignItems='center' spacing={1} >
                            <Grid container item sm alignContent='center' alignItems='center' justify='center' wrap='wrap'>
                                <img
                                    src={server + '/' + d[1].split('.')[0] + '_' + sessionStorage.getItem('UserId') + '.' + d[1].split('.')[1]}
                                    style={{ maxWidth: '100%' }}
                                    alt=''/>
                            </Grid>
                            <Grid container item sm alignContent='center' alignItems='center' justify='center' wrap='wrap'>
                                <TableContainer>
                                    <ResponsiveContainer height={400} minWidth={700}>
                                        <ComposedChart data={data}>
                                            <XAxis dataKey='name'/>
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
                                                )}/>
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
                                                            <FormControlLabel control={<Radio/>} label='Yes' value='Yes'/>
                                                            <FormControlLabel control={<Radio/>} label='No' value='No'/>
                                                        </RadioGroup>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControl>
                                                        <RadioGroup name='edema' onChange={e => this.feedbackChangeHandler(e)}>
                                                            <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                                            <FormControlLabel control={<Radio/>} label='No' value='No' />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControl>
                                                        <RadioGroup name='consolidation' onChange={e => this.feedbackChangeHandler(e)}>
                                                            <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                                            <FormControlLabel control={<Radio/>} label='No' value='No' />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControl>
                                                        <RadioGroup name='atelectasis' onChange={e => this.feedbackChangeHandler(e)}>
                                                            <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                                            <FormControlLabel control={<Radio/>} label='No' value='No' />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormControl>
                                                        <RadioGroup name='pleural_effusion' onChange={e => this.feedbackChangeHandler(e)}>
                                                            <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                                            <FormControlLabel control={<Radio/>} label='No' value='No' />
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
        const {name, value} = e.target;
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
        }).then(response =>{
            if(response.status === 200) {
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
                        <br/>
                        <Button onClick={this.goHome}>
                            Home
                        </Button>
                    </Grid>
                )
            } else {
                return this.uploadImage();
            }
        } else {
            return <History/>
        }

    }
}

const mapStateToProps = state => ({
    userId: state.userId,
    history: state.history,
    result: state.result
})

const mapDispatchToProps = dispatch => ({
    resultAction: status => {
        dispatch(result(status))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UploadImage));
