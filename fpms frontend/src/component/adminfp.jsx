import React, { Component } from 'react';
import { NavLink , Link } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import http from '../services/httpService';

class Adminfp extends Component {
    state = {
        account : {
            username: ''
        },
        errors : {}
    }

    validate=()=>{
        const errors = {};

        const { account } = this.state;
        if (account.username.trim() === "")
            errors.username="Username is required.";
        return Object.keys(errors).length===0? null : errors;
    }

    handleSubmit =async (e)=>{
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors : errors || {}});
        if (errors) return;
        try{
            await http.post('http://localhost:4000/admin/forget-password',{email:this.state.account.username})
            toast.success("A Link to reset password is sent to registered E-mail id")
        }
        catch(err){
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
            <div className="container">
                <h2 className="form-signin-heading text-center">Faculty Portfolio Management System</h2>
                <div className="wrapper">
                    <form className="form-signin" onSubmit={this.handleSubmit}>       
                    <h2 className="form-signin-heading">Recover Password</h2>
                    <input id="username" name="username" type="text" className="form-control" placeholder="Enter the e-mail address" value={this.state.account.username} onChange={this.handleChange} /> 
                    {this.state.errors.username && <div className="alert alert-danger">{this.state.errors.username}</div>}
                    <br />
                    <small>Note : Enter the FPMS registered e-mail address</small><br/><br/>
                    <div class="row">
                        <div class="col-sm">
                        <button type="submit" disabled={this.validate()} className="btn btn-primary">Submit</button>
                        </div>
                        <div class="col-sm">
                        </div>
                        <div class="col-sm">
                        <Link type="button" to="/login" className="btn btn-secondary">Login</Link>
                        </div>
                    </div>
                    </form>
                </div>
                </div>
        );
    }
}
 
export default Adminfp;