import React, { Component } from 'react';
import http from "../services/httpService";

class Dashboard extends Component {
    state = { 
        uploadno:''
    } 
    async componentDidMount() {
        const jwt=localStorage.getItem("token");
        if(jwt==null){
            this.props.history.replace('/')
        }
        const {data} = await http.get(`http://localhost:4000/faculty/uploads/${this.props.userid}`);
        const uploadno= data.length
        this.setState({uploadno});
      }
    render() { 
        return (
            <div className="panel panel-default">
                            <div className="panel-heading main-color-bg">
                              <h2 className="panel-title dash-box"><span className="glyphicon glyphicon-cog" aria-hidden="true"></span> Dashboard</h2>
                            </div>
                            <div className="panel-body">
                                    <div className="well dash-box">
                                        <h3><span className="glyphicon glyphicon-open" aria-hidden="true"></span>{this.state.uploadno}</h3>
                                        <h4>Portfolio Submissions</h4>
                                    </div>
                                </div>
                            </div>
        );
    }
}
 
export default Dashboard;