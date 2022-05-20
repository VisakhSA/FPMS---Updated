import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import http from "../services/httpService";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

class Login extends Component {
    state = {
        facultyaccount : {
            username: '',password: ''
        },
        facultyerrors : {},
        adminaccount : {
            username: '',password: ''
        },
        adminerrors : {}
    }

    facultyvalidate=()=>{
        const facultyerrors = {};

        const { facultyaccount } = this.state;
        if (facultyaccount.username.trim() === "")
            facultyerrors.username="Username is required.";
        if (facultyaccount.password.trim() === "")
            facultyerrors.password="Password is required.";

        return Object.keys(facultyerrors).length===0? null : facultyerrors;
    }

    adminvalidate=()=>{
        const adminerrors = {};

        const { adminaccount } = this.state;
        if (adminaccount.username.trim() === "")
            adminerrors.username="Username is required.";
        if (adminaccount.password.trim() === "")
            adminerrors.password="Password is required.";

        return Object.keys(adminerrors).length===0? null : adminerrors;
    }
    
    facultyhandleSubmit =async (e)=>{
        e.preventDefault();
        const facultyerrors = this.facultyvalidate();
        this.setState({facultyerrors : facultyerrors || {}});
        if (facultyerrors) return;
        try{
            const facultyaccount={email:this.state.facultyaccount.username,password:this.state.facultyaccount.password}
            const { data : jwt }= await http.post('http://localhost:4000/faculty/login',facultyaccount)
            toast.success("Login Successful")
            localStorage.setItem("token",jwt.accessToken);
            this.props.history.push("/faculty")
            }
            catch (err){
                toast.error(err.response.data.message)
            }
        
    };

    adminhandleSubmit =async (e)=>{
        e.preventDefault();
        const adminerrors = this.adminvalidate();
        this.setState({adminerrors : adminerrors || {}});
        if (adminerrors) return;
        try{
            const adminaccount={email:this.state.adminaccount.username,password:this.state.adminaccount.password}
            const { data:jwt }= await http.post('http://localhost:4000/admin/login',adminaccount)
            toast.success("Login Successful")
            localStorage.setItem("token",jwt.accessToken);
            this.props.history.push("/admin")
            }
            catch (err){
                toast.error(err.response.data.message)
            }
    };

    facultyhandleChange = e =>{
        const facultyaccount = { ...this.state.facultyaccount};
        facultyaccount[e.currentTarget.name] = e.currentTarget.value;
        this.setState({facultyaccount});
    }

    adminhandleChange = e =>{
        const adminaccount = { ...this.state.adminaccount};
        adminaccount[e.currentTarget.name] = e.currentTarget.value;
        this.setState({adminaccount});
    }


    render() { 
        return (
            <div className="container">
                <h2 className="form-signin-heading text-center">Faculty Portfolio Management System</h2>
                <div className="row justify-content-center">
                <div className="col-sm-6">
                    <div className="wrapper">
                        <form className="form-signin" onSubmit={this.adminhandleSubmit}>
                        <h2 className="form-signin-heading">Admin login</h2>
                        <div className="form-group">
                        <label htmlFor="username">Email</label>
                        <input id="username" name="username" type="text" className="form-control" value={this.state.adminaccount.username} onChange={this.adminhandleChange}/>
                        {this.state.adminerrors.username && <div className="alert alert-danger">{this.state.adminerrors.username}</div>}
                        </div>
                        <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" className="form-control" value={this.state.adminaccount.password} onChange={this.adminhandleChange}/>
                        {this.state.adminerrors.password && <div className="alert alert-danger">{this.state.adminerrors.password}</div>}
                        </div>
                        <button type="submit" disabled={this.adminvalidate()} className="btn btn-primary">Login</button>
                        <NavLink className="nav-link" to="/admfp">Forgot Passsword?</NavLink>
                        </form>
                    </div>
                </div>
                <div className="col-sm-6">
                <div className="wrapper">
                        <form className="form-signin" onSubmit={this.facultyhandleSubmit}>
                        <h2 className="form-signin-heading">Faculty login</h2>
                        <div className="form-group">
                        <label htmlFor="username">Email</label>
                        <input id="username" name="username" type="text" className="form-control" value={this.state.facultyaccount.username} onChange={this.facultyhandleChange}/>
                        {this.state.facultyerrors.username && <div className="alert alert-danger">{this.state.facultyerrors.username}</div>}
                        </div>
                        <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" className="form-control" value={this.state.facultyaccount.password} onChange={this.facultyhandleChange}/>
                        {this.state.facultyerrors.password && <div className="alert alert-danger">{this.state.facultyerrors.password}</div>}
                        </div>
                        <button type="submit" disabled={this.facultyvalidate()} className="btn btn-primary">Login</button>
                        <NavLink className="nav-link" to="/facfp">Forgot Passsword?</NavLink>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}
 
export default Login;