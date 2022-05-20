import React, { Component } from 'react';
import { NavLink , Link } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import http from '../services/httpService';

class Facultyresetpw extends Component {
    state = {
        account : {
            password: ''
        },
        errors : {}
    }

    validate=()=>{
        const errors = {};

        const { account } = this.state;
        if (account.password.trim() === "")
            errors.password="password is required.";
        return Object.keys(errors).length===0? null : errors;
    }

    handleSubmit =async (e)=>{
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors : errors || {}});
        if (errors) return;
        try{
            await http.post(`http://localhost:4000/faculty/reset-password/${this.props.match.params.id}/${this.props.match.params.token}`,{password:this.state.account.password})
            toast.success("Password Reset Successful")
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
                    <h2 className="form-signin-heading">Reset Password</h2>
                    <input id="password" name="password" type="text" className="form-control" placeholder="Enter new password" value={this.state.account.password} onChange={this.handleChange} /> 
                    {this.state.errors.password && <div className="alert alert-danger">{this.state.errors.password}</div>}
                    <br />
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
 
export default Facultyresetpw;