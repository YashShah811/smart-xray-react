import React, { Component } from 'react';
import './UploadImage.css';
import History from '../History/History';
import { connect } from 'react-redux';
import { server } from '../../properties';

class UploadImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            responseData: null,
            loading: false,
            preview: null,
            history: false,
            limit: false
        }
    }

onChangeHandler = event => {
    var reader = new FileReader();
    const file = event.target.files[0];
    reader.onloadend = () => {
        this.setState({
            selectedFile: file,
            preview: reader.result
        })
    }
    reader.readAsDataURL(file)
}

calculate = () => {
    this.setState({
        loading: true
    })
    let data = new FormData();
    data.append('image', this.state.selectedFile)
    fetch(server + "/calculate/"+this.props.userId.userId, {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }).then(response => response.json())
    .then(responseJson => {
        if(responseJson.data === null) {
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


uploadImage = () => {
    return(
        <div className="uploadImage">
            <div className="upload">
                <input 
                    className="uploadButton" 
                    type="file" 
                    name="file"
                    onChange={this.onChangeHandler} />
                <div className="previewImage">
                    <img 
                        id="target"
                        src={this.state.preview}
                        width="400"
                        height="400"
                        alt='' />
                </div>
                <div>
                    <button className="submitButton" type="submit" onClick={this.calculate}>
                        Submit
                    </button>
                    <button className="submitButton" type="reset" onClick={this.goHome}>
                        Cancel
                    </button>
                    <button className="submitButton" type="button" onClick={this.history}>
                        History
                    </button>
                </div>                    
            </div>
        </div>
    );
}

result = () => {
    if(this.state.responseData.isError === 'false') {
        var d = this.state.responseData.result;
        return(
            <div>
                <div className='response'>
                    <div>
                        <img 
                        src={'file:///D:/Python/xRay/Code/outs/images/'+d[1]}
                        height='200'
                        width='200'
                        alt='' />
                    </div>
                    <div className='result'>
                        <div> cardiomegaly <br/> {d[2]} </div>
                        <div> edema <br /> {d[3]} </div>
                        <div> consolidation <br /> {d[4]} </div>
                        <div> atelectasis <br /> {d[5]} </div>
                        <div> pleural effusion <br /> {d[6]} </div>
                    </div><br />
                </div>
                <button onClick={this.goHome}>
                    Home
                </button>
            </div>
        );    
    } else {
        return('Error...');
    }
}

goHome = () => {
    this.setState({
        responseData: null,
        preview: null,
        limit: false
    })
}

history = () => {
    this.setState({
        history: true
    })
}

 render() {
     if(!this.state.history) {
        if(this.state.loading) {
           return(
               <div>
                   Loading...
               </div>
           )
        } else if(this.state.responseData !== null) {
            console.log(this.state)
           return this.result();
        } else if(this.state.limit) {
            return(
                <div>
                    <div>
                        You have reached max limit. Please contact admin
                    </div>
                    <button onClick={this.goHome}>
                        Home
                    </button>
                </div>
            )
        } else {
            console.log(this.state)
           return this.uploadImage();
        }
    } else if(this.state.history) {
        console.log(this.state)
        return <History />
    }
 }
}

const mapStateToProps = state => ({
    userId: state.userId
})

export default connect(mapStateToProps, null)(UploadImage);