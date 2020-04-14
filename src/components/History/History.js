import React from 'react';
import { Component } from 'react';
import './History.css';
import UploadImage from '../UploadImage/UploadImage';
import { connect } from 'react-redux';
import { server } from '../../properties';
import { LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

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
                                <div className="time">
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
                                </div>
                                <div className='history'>
                                    <img 
                                    src={server+'/'+d.image_path.split('.')[0]+'_'+localStorage.getItem('UserId')+'.'+d.image_path.split('.')[1]}
                                    height='400'
                                    width='400'
                                    alt='' />
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
                                                top:5, left:20, right:100
                                            }}>
                                                <CartesianGrid />
                                                <XAxis dataKey='name' />
                                                <YAxis />
                                                <Tooltip />
                                                <Line dataKey='value'/>
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