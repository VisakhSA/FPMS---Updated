import React, { Component } from 'react';
import http from '../services/httpService';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { NavLink , Link } from 'react-router-dom';

class AdminReportGen extends Component {
    state = {
      dateset:{
        startdate:'',
        enddate:'',
        facname:''
      },
      uploaddata:[],
      facdata:[],
      errors:{}
      } 
    
      async componentDidMount() {
        const jwt=localStorage.getItem("token");
        if(jwt==null){
            this.props.history.replace('/')
        }
        // pending > resolved (success) OR rejected (failure)
        const {data :facdata} = await http.get('http://localhost:4000/admin/faculty');
        this.setState({ facdata });
      }

      validate=()=>{
        const errors = {};

        const { dateset } = this.state;
        if (dateset.startdate.trim() === "")
            errors.startdate="startdate is required.";
        if (dateset.enddate.trim() === "")
            errors.enddate="enddate is required.";
        if (dateset.facname.trim() === "")
            errors.facname="facultyname is required.";
        return Object.keys(errors).length===0? null : errors;
    }

    handleSubmit =async (e)=>{
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors : errors || {}});
        if (errors) return;
        console.log(this.state.dateset)
        try{
        const { data }= await http.post('http://localhost:4000/admin/datefilter',this.state.dateset)
        const uploaddata=data.data
        this.setState({uploaddata})
        this.props.uploaddata(uploaddata)
        console.log(uploaddata)
        this.props.history.push('/admin/result')
        }
        catch (err){
            toast.error(err.response.data.message)
            const uploaddata=[]
            this.setState({uploaddata})
        }
    };

    handleChange = e =>{
        const dateset = { ...this.state.dateset};
        dateset[e.currentTarget.name] = e.currentTarget.value;
        this.setState({dateset});
    }


    render() { 
        return (
            <div className="panel panel-default">
            <div className="panel-heading main-color-bg">
              <h2 className="panel-title dash-box"><span className="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Report Generation</h2>
            </div>
            <div className="panel-body dash-box">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label>Start Date</label>
                      <input type="date" name="startdate" value={this.state.dateset.startdate} onChange={this.handleChange}/>
                    </div>
                    <div className="col-sm-6">
                      <label>End Date</label>
                      <input type="date" name="enddate" value={this.state.dateset.enddate} onChange={this.handleChange}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div>
                      <label>Faculty Name</label>
                      <select name="facname" id="facname" onChange={this.handleChange}>
                          <option value="">choose...</option>
                          {this.state.facdata.map(g=>(
                                <option key={g._id} value={g.name}>{g.name}</option>
                            ))}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={this.validate()}>Submit</button>
                </form>
                <br />
            </div>
        </div>
        );
      }
}
 
export default AdminReportGen;