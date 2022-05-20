import React, { Component } from 'react';
import http from "../services/httpService";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

class editFaculty extends Component {
    state = { 
        account:{
            name:'',
            designation:'',
            email:'',
            password:''
        },
        errors:{}
     }
    
    async componentDidMount() {
        const jwt=localStorage.getItem("token");
        if(jwt==null){
            this.props.history.replace('/')
        }
        const {data : account } = await http.get(`http://localhost:4000/admin/faculty/${this.props.match.params.id}`);
        this.setState({account})
    }

    validate=()=>{
        const errors = {};

        const { account } = this.state;
        if (account.name.trim() === "")
            errors.name="name is required.";
        if (account.designation.trim() === "")
            errors.designation="Designation is required.";
        return Object.keys(errors).length===0? null : errors;
    }

    handleSubmit =async (e)=>{
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors : errors || {}});
        if (errors) return;
        try{
        const { data }= await http.patch(`http://localhost:4000/admin/faculty/${this.props.match.params.id}`,this.state.account)
        toast.success("Faculty data updated successfully")
        this.props.history.push('/admin/facmanage')
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
                          <h2 className="panel-title dash-box"><span className="glyphicon glyphicon-erase" aria-hidden="true"></span> Edit Profile</h2>
                        </div>
                        <br />
            <form className="panel-body" onSubmit={this.handleSubmit}>
                <div className="form-group row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="name" name="name" value={this.state.account.name} onChange={this.handleChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="designation" className="col-sm-2 col-form-label">Designation</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="designation" name="designation"  value={this.state.account.designation} onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                    <input type="email" className="form-control"  placeholder={this.state.account.email} disabled />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                    <input type="password" className="form-control" value={this.state.account.password} disabled />
                    </div>
                </div> 
                <div className="form-group row">
                    <div className='col-md-12 text-center'>
                    <button type="submit" className="btn btn-primary" disabled={this.validate()} >Save</button>
                    </div>
                </div>
                </form>
                </div>
        );
    }
}
export default editFaculty;