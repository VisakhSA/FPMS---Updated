import React, { Component } from 'react';
import http from "../services/httpService";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

class AdminCreateFaculty extends Component {
    state = { 
        account:{
            name:'',
            designation:'',
            email:'',
            password:''
        },
        errors:{}
     } 

     componentDidMount(){
        const jwt=localStorage.getItem("token");
        if(jwt==null){
            this.props.history.replace('/')
        }
     }
     validate=()=>{
        const errors = {};

        const { account } = this.state;
        if (account.name.trim() === "")
            errors.name="name is required.";
        if (account.password.trim() === "")
            errors.password="Password is required.";
        if (account.designation.trim() === "")
            errors.designation="Designation is required.";
        if (account.email.trim() === "")
            errors.email="email is required";
        return Object.keys(errors).length===0? null : errors;
    }

    handleSubmit =async (e)=>{
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors : errors || {}});
        if (errors) return;
        console.log(this.state.account)
        try{
        const { data }= await http.post('http://localhost:4000/admin/createfaculty',this.state.account)
        toast.success("Profile created successfully")
        }
        catch (err){
            toast.error(err.response.data.message)
        }
    };

    handleChange = e =>{
        const account = { ...this.state.account};
        account[e.currentTarget.name] = e.currentTarget.value;
        this.setState({account});
    }


    render() { 
        return (
            <div className="panel panel-default">
                        <div className="panel-heading main-color-bg">
                          <h2 className="panel-title dash-box"><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Create Profile</h2>
                        </div>
                        <br />
                        <form className="panel-body" onSubmit={this.handleSubmit}>
                            <div className="form-group row">
                                <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                                <div className="col-sm-10">
                                  <input type="text" className="form-control" id="name" name="name" autocomplete="off" value={this.state.account.name} onChange={this.handleChange} placeholder="Enter the name" />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="designation" className="col-sm-2 col-form-label">Designation</label>
                                <div className="col-sm-10">
                                  <input type="text" className="form-control" id="designation" autocomplete="off"  name="designation" value={this.state.account.designation} onChange={this.handleChange} placeholder="Enter the designation" />
                                </div>
                            </div>

                            <div className="form-group row">
                              <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                              <div className="col-sm-10">
                                <input type="email" className="form-control" id="email" name="email" autocomplete="off"  value={this.state.account.email} onChange={this.handleChange} placeholder="Email" />
                              </div>
                            </div>

                            <div className="form-group row">
                              <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                              <div className="col-sm-10">
                                <input type="text" className="form-control" id="password" name="password" autocomplete="off" value={this.state.account.password} onChange={this.handleChange} placeholder="Password" />
                              </div>
                            </div>
                          
                            <div className="form-group row">
                              <div className='col-md-12 text-center'>
                              <button type="submit" className="btn btn-primary" disabled={this.validate()} >Create</button>
                              </div>
                          </div>
                          </form>
                      </div>
        );
    }
}
 
export default AdminCreateFaculty;