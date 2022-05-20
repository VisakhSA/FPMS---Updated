import React, { Component } from 'react';
import { NavLink , Link } from 'react-router-dom';
import { Switch, Route, Redirect } from "react-router-dom";
import FacultyUploads from './facultyuploads';
import FacultyResults from './facultyresults';
import FacultyReportView from './facultyreportview';
import CreatePortfolio from './facultycreateport';
import Dashboard from './facultydashboard';
import jwtDecode from "jwt-decode";

class Faculty extends Component {
    state = {
        activetab:{  
        dash: true,
        crf: false,
        repgen:false
        },
        user:{},
        upload:[]
     } 

    activechange=name=>{
        const activetab={  
            dash: false,
            crf: false,
            repgen:false
            }
        if(name==="dash") activetab.dash=true
        if(name==="crf") activetab.crf=true
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

    uploadrefresh=(data)=>{
        const upload = this.state.upload.filter(p => p._id !== data._id);
        this.setState({ upload});
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
                        <a className="nav-link active" aria-current="page" >{this.state.user.name}</a></li>
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
                            <Link className={this.state.activetab.dash ? "list-group-item main-color-bg" : "list-group-item"} to="/faculty/dashboard" onClick={()=>this.activechange("dash")}>Dashboard</Link>
                            <Link className={this.state.activetab.crf ? "list-group-item main-color-bg" : "list-group-item"}  to="/faculty/createportfolio" onClick={()=>this.activechange("crf")}>Create Portfolio</Link>
                            <Link className={this.state.activetab.repgen ? "list-group-item main-color-bg" : "list-group-item"} to="/faculty/reports" onClick={()=>this.activechange("repgen")}>Your Uploads</Link>
                          </div>
                    </div>



                    <div className="col-md-9">
                    <Switch>
                        <Route path="/faculty/result" render={(props)=><FacultyResults  uploadrefresh={this.uploadrefresh} uploaddata={this.state.upload} {...props}/>}></Route>
                        <Route path="/faculty/reports/:id" component={FacultyReportView} />
                        <Route path="/faculty/createportfolio" render={(props)=><CreatePortfolio  userid={this.state.user._id} {...props}/>}/>
                        <Route path="/faculty/reports" render={(props)=><FacultyUploads  userid={this.state.user._id} uploaddata={this.uploaddata} {...props}/>}/>
                        <Route path="/faculty/dashboard"  render={(props)=><Dashboard  userid={this.state.user._id} {...props}/>} />
                        <Redirect from="/"  to="/faculty/dashboard" />
                    </Switch>
                    </div>
                </div>
            </div>
        </section>
        </div>
        );
    }
}
 
export default Faculty;
