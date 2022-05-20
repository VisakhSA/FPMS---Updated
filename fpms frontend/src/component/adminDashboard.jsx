import React, { Component } from 'react';
import http from "../services/httpService";
import "react-toastify/dist/ReactToastify.css";

class AdminDashboard extends Component {
    state = { 
        facno:0,
        uploadno:0
    } 
    async componentDidMount() {
        const jwt=localStorage.getItem("token");
        if(jwt==null){
            this.props.history.replace('/')
        }
        const {data :facno} = await http.get('http://localhost:4000/admin/facultycount');
        const {data :uploadno} = await http.get('http://localhost:4000/admin/uploadcount');
        this.setState({ facno,uploadno});
      }
    render() { 
        return (
            <div className="panel panel-default">
                            <div className="panel-heading main-color-bg">
                              <h2 className="panel-title dash-box"><span className="glyphicon glyphicon-cog" aria-hidden="true"></span> Dashboard</h2>
                            </div>
                            <div className="panel-body row">
                                <div className="col-md-6">
                                    <div className="well dash-box">
                                        <h3><span className="glyphicon glyphicon-user" aria-hidden="true"></span>{this.state.facno}</h3>
                                        <h4>Faculty</h4>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="well dash-box">
                                        <h3><span className="glyphicon glyphicon-open" aria-hidden="true"></span>{this.state.uploadno}</h3>
                                        <h4>Uploads</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
        );
    }
}
 
export default AdminDashboard;