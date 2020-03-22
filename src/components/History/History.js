import React from 'react';
import { Component } from 'react';
import './History.css';
import UploadImage from '../UploadImage/UploadImage';
import { connect } from 'react-redux';
import { server } from '../../properties';
import { LineChart, XAxis, YAxis, Line, Tooltip, Legend, CartesianGrid } from 'recharts';

class History extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            key: [],
            home: false
        }
    }

    componentDidMount() {
        fetch(server + '/history/'+localStorage.getItem('UserId'), {
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
                data: responseJson.data
            })
        }).catch(e => console.log(e))
    }

    history = () => {
        return(
            <div>
                <div>
                    {
                        this.state.data.map((d, i) => (
                            <div key={i} className="history-container">
                                <div>{new Intl.DateTimeFormat("en-GB", {
                                      year: "numeric",
                                      month: "long",
                                      day: "2-digit",
                                      hour: "numeric",
                                      minute: "numeric",
                                      second: "numeric",
                                      hour12: true,
                                    //   timeZoneName: 'short'
                                    }).format(new Date(d.access_dts))}
                                </div>
                                <div className='history'>
                                    <div className='imagePreview'>
                                        <img 
                                        src={'file:///D:/Python/xRay/Code/outs/images/'+d.image_path}
                                        height='200'
                                        width='200'
                                        alt='' />
                                    </div>
                                    <div>
                                        <LineChart 
                                            width={800} 
                                            height={400} 
                                            data={[
                                                {name: 'Cardiomegaly', value: (d.cardiomegaly * 100).toFixed(2)},
                                                {name: 'Edema', value: (d.edema * 100).toFixed(2)},
                                                {name: 'Consolidation', value: (d.consolidation * 100).toFixed(2)},
                                                {name: 'Atelectasis', value: (d.atelectasis * 100).toFixed(2)},
                                                {name: 'Pleural effusion', value: (d.pleural_effusion * 100).toFixed(2)}
                                            ]}
                                            margin={{
                                                top:5, left:20, right:80
                                            }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey='name' />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type='linear' dataKey='value' activeDot={{ r:3 }} />
                                        </LineChart>
                                    </div>
                                    <div className="flex-container">
                                        <div> Cardiomegaly <br/> {(d.cardiomegaly * 100).toFixed(2) + '%'} </div>
                                        <div> Edema <br /> {(d.edema * 100).toFixed(2) + '%'} </div>
                                        <div> Consolidation <br /> {(d.consolidation * 100).toFixed(2) + '%'} </div>
                                        <div> Atelectasis <br /> {(d.atelectasis * 100).toFixed(2) + '%'} </div>
                                        <div> Pleural effusion <br /> {(d.pleural_effusion * 100).toFixed(2) + '%'} </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <button onClick={this.home}>
                    Home
                </button>
            </div>
        )}

        home = () => {
            this.setState({
                home: true
            })
        }

    render() {
        if(this.state.home) {
            return <UploadImage />
        } else {
            return this.history();
        }
    }
}

const mapStateToProps = state => ({
    userId: state.userId
})

export default connect(mapStateToProps, null)(History);