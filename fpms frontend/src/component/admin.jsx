import React, { Component } from 'react';
import { NavLink , Link } from 'react-router-dom';
import { Switch, Route, Redirect } from "react-router-dom";
import AdminCreateFaculty from './adminCreateFac';
import AdminDashboard from './adminDashboard';
import AdminFacManage from './adminFacManage';
import AdminReportGen from './adminReportGen';
import editFaculty from './editfaculty';
import DownloadReport from './downloadReport';
import Results from './result';
import jwtDecode from "jwt-decode";

class Admin extends Component {
    state = {
        activetab:{  
        dash: true,
        crf: false,
        facman:false,
        repgen:false
        },
        user:{},
        upload:[]
    } 

    activechange=name=>{
        const activetab={  
            dash: false,
            crf: false,
            facman:false,
            repgen:false
            }
        if(name==="dash") activetab.dash=true
        if(name==="crf") activetab.crf=true
        if(name==="facman") activetab.facman=true
        if(name==="repgen") activetab.repgen=true
        this.setState({activetab:activetab})
    }

    componentDidMount() {
        const jwt=localStorage.getItem("token");
        if(jwt!=null){
        const user=jwtDecode(jwt)
        this.setState({user})
        }
        else {
            this.props.history.replace('/')
        }
    }

   uploaddata=(upload)=>{
    this.setState({upload})
   }

   logout=()=>{
       localStorage.removeItem('token')
       this.props.history.replace('/')
   }

    render() { 
        return (
            <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" >Faculty Portfolio Management System</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav navbar-right">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" >{this.state.user.email}</a></li>
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" onClick={()=>this.logout()}>Logout</a></li>
                </ul>
              </div>
            </div>
        </nav>


        <section id="main" class="gap">
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <div className="list-group">
                            <Link className={this.state.activetab.dash ? "list-group-item main-color-bg" : "list-group-item"} to="/admin/dashboard" onClick={()=>this.activechange("dash")}>Dashboard</Link>
                            <Link className={this.state.activetab.crf ? "list-group-item main-color-bg" : "list-group-item"}  to="/admin/createprofile" onClick={()=>this.activechange("crf")}>Create Profile</Link>
                            <Link className={this.state.activetab.facman ? "list-group-item main-color-bg" : "list-group-item"} to="/admin/facmanage" onClick={()=>this.activechange("facman")}>Faculty Management</Link>
                            <Link className={this.state.activetab.repgen ? "list-group-item main-color-bg" : "list-group-item"} to="/admin/repgen" onClick={()=>this.activechange("repgen")}>Report Generation</Link>
                          </div>
                    </div>



                    <div className="col-md-9">
                    <Switch>
                        <Route path="/admin/result" render={(props)=><Results  uploaddata={this.state.upload} {...props}/>}></Route>
                        <Route path="/admin/repgen/:id" component={DownloadReport} />
                        <Route path="/admin/facmanage/:id" component={editFaculty} />
                        <Route path="/admin/createprofile" component={AdminCreateFaculty}/>
                        <Route path="/admin/facmanage" component={AdminFacManage} />
                        <Route path="/admin/repgen" render={(props)=><AdminReportGen  uploaddata={this.uploaddata} {...props}/>}/>
                        <Route path="/admin/dashboard" component={AdminDashboard} />
                        <Redirect from="/"  to="/admin/dashboard" />
                    </Switch>
                    </div>
                </div>
            </div>
        </section>
        </div>
        );
    }
}
 
export default Admin;