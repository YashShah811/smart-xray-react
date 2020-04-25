import React, {Component} from 'react';
import './UploadImage.css';
import History from '../History/History';
import {connect} from 'react-redux';
import {server} from '../../properties';
import {LineChart, XAxis, YAxis, Line, Tooltip, Legend, CartesianGrid} from 'recharts';
import {
    Button,
    CircularProgress,
    Snackbar,
    Typography,
    Grid,
    TableBody,
    TableRow,
    TableCell,
    RadioGroup, FormControlLabel, Radio, Table
} from '@material-ui/core';
import {withStyles} from "@material-ui/core/styles";

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
        const fileName = event.target.files[0].name;
        const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
        console.log(extension)
        if (extension === 'jpg' || extension === 'png') {
            reader.onloadend = () => {
                this.setState({
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
            fetch(server + "/calculate/" + localStorage.getItem('UserId'), {
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
                            responseData: responseJson.data
                        })
                    }
                })
                .catch(error => console.log(error))
        }
    }

    uploadImage = () => {
        return(
            <Grid container item direction='column' justify='center' alignItems='center' style={{ minHeight: '80vh' }}>
                <input
                    color='inherit'
                    type='file'
                    accept='image/*'
                    onChange={this.onChangeHandler}
                />
                <img
                    id="target"
                    src={this.state.preview}
                    width="400"
                    height="400"
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
                    <Button type='cancel' onClick={this.goHome}>
                        Cancel
                    </Button>
                </Grid>
                {this.alert()}
            </Grid>
        )
    }

    alert = () => (
        <Snackbar
            anchorOrigin={{vertical: "top", horizontal: "center"}}
            open={this.state.open}
            onClose={() => this.setState({open: !this.state.open})}
            autoHideDuration={3000}
            message={this.state.alertMessage}
        />
    )

    result = () => {
        if (this.state.responseData.isError === 'false') {
            var d = this.state.responseData.result;
            return(
                <Grid container justify='center' style={{ marginTop: '2%' }}>
                    <Grid xs={4}>
                        <img
                            style={{ display: 'block', marginRight: 'auto', marginLeft: 'auto' }}
                            src={server + '/' + d[1].split('.')[0] + '_' + localStorage.getItem('UserId') + '.' + d[1].split('.')[1]}
                            height='400'
                            width='400'
                            alt=''/>
                    </Grid>
                    <Grid xs={8}>
                        <LineChart
                            style={{ fontSize: 'calc(5px + 2vmin)'}}
                            width={1000}
                            height={400}
                            data={[
                                {name: 'Cardiomegaly', value: (d[2] * 100).toFixed(2)},
                                {name: 'Edema', value: (d[3] * 100).toFixed(2)},
                                {name: 'Consolidation', value: (d[4] * 100).toFixed(2)},
                                {name: 'Atelectasis', value: (d[5] * 100).toFixed(2)},
                                {name: 'Pleural effusion', value: (d[6] * 100).toFixed(2)}
                            ]}
                            margin={{
                                right: 70
                            }}>
                            <CartesianGrid/>
                            <XAxis dataKey='name'/>
                            <YAxis/>
                            <Tooltip/>
                            <Line dataKey='value'/>
                        </LineChart>
                    </Grid>
                    <Grid container item xs={4} alignContent='center' alignItems='center' justify='center'>
                        <Button onClick={this.submitFeedback}>
                            Submit feedback
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
                                    <TableCell>{(d[2] * 100).toFixed(2) + '%'}</TableCell>
                                    <TableCell>{(d[3] * 100).toFixed(2) + '%'}</TableCell>
                                    <TableCell>{(d[4] * 100).toFixed(2) + '%'}</TableCell>
                                    <TableCell>{(d[5] * 100).toFixed(2) + '%'}</TableCell>
                                    <TableCell>{(d[6] * 100).toFixed(2) + '%'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <RadioGroup name='cardiomegaly' onChange={e => this.feedbackChangeHandler(e)}>
                                            <FormControlLabel control={<Radio/>} label='Yes' value='Yes'/>
                                            <FormControlLabel control={<Radio/>} label='No' value='No'/>
                                        </RadioGroup>
                                    </TableCell>
                                    <TableCell>
                                        <RadioGroup name='edema' onChange={e => this.feedbackChangeHandler(e)}>
                                            <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                            <FormControlLabel control={<Radio/>} label='No' value='No' />
                                        </RadioGroup>
                                    </TableCell>
                                    <TableCell>
                                        <RadioGroup name='consolidation' onChange={e => this.feedbackChangeHandler(e)}>
                                            <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                            <FormControlLabel control={<Radio/>} label='No' value='No' />
                                        </RadioGroup>
                                    </TableCell>
                                    <TableCell>
                                        <RadioGroup name='atelectasis' onChange={e => this.feedbackChangeHandler(e)}>
                                            <FormControlLabel control={<Radio/>} label='Yes' value='Yes' />
                                            <FormControlLabel control={<Radio/>} label='No' value='No' />
                                        </RadioGroup>
                                    </TableCell>
                                    <TableCell>
                                        <RadioGroup name='pleural_effusion' onChange={e => this.feedbackChangeHandler(e)}>
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
        console.log(this.state.feedback)
        this.setState({
            loading: true
        })
        fetch(server + '/feedback/' + this.state.responseData.userAccessDetailsId, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                feedbackBody: this.state.feedback
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response =>{
            if(response.status === 201) {
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
        console.log(this.state)
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
            } else if (this.state.responseData !== null) {
                console.log(this.state)
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
    history: state.history
})

export default connect(mapStateToProps, null)(withStyles(styles)(UploadImage));
