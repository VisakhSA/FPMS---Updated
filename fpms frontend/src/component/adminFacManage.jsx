import React, { Component, useState } from 'react';
import http from '../services/httpService';
import Popup from 'reactjs-popup';
import Modal from './modal';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { NavLink , Link } from 'react-router-dom';

class AdminFacManage extends Component {
    state = { 
      facdata:[],
      isOpen : false,
      currid:''
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

    setIsOpen =(a,currid) =>{
        const isOpen = a
        this.setState({isOpen,currid})
    }

    handleDelete = async data => {
      const originalfacdata = this.state.facdata;
  
      const facdata = this.state.facdata.filter(p => p._id !== data._id);
      this.setState({ facdata,isOpen:false});
      try {
        await http.delete(`http://localhost:4000/admin/faculty/${data._id}`);
        toast.success("Faculty record deleted")
      } catch (ex) {
        this.setState({ facdata: originalfacdata });
      }
    };

    render() {
        return (
            <div className="panel panel-default">
                            <div className="panel-heading main-color-bg">
                              <h2 className="panel-title dash-box"><span className="glyphicon glyphicon-user" aria-hidden="true"></span> Faculty</h2>
                            </div>
                            <div className="panel-body">
                                <table className="table table-striped">
                                    <thead className="main-color-bg">
                                      <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Designation</th>
                                        <th scope="col">E-mail</th>
                                        <th scope="col">Edit</th>
                                        <th scope="col">Delete</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.facdata.map(data => (
                                        <tr key={data._id}>
                                        <th scope="row">{data.name}</th>
                                        <td>{data.designation}</td>
                                        <td>{data.email}</td>
                                        <td><Link className="btn btn-default" to={`/admin/facmanage/${data._id}`} >Edit</Link></td>
                                        <td><a className="btn btn-danger" onClick={() => this.setIsOpen(true,data._id)}>
                                              Delete
                                            </a>
                                            {(this.state.isOpen && (this.state.currid==data._id)) && <Modal data={data} handleDelete={this.handleDelete} setIsOpen={this.setIsOpen} />}
                                        </td></tr>
                                    ))}
                                    </tbody>
                                  </table>
                            </div>
                        </div>
        );
    }
}
 
export default AdminFacManage;