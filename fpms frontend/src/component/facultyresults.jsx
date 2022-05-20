import React, { Component } from 'react';
import http from '../services/httpService';
import Popup from 'reactjs-popup';
import Modal from './modal';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { NavLink , Link } from 'react-router-dom';


class FacultyResults extends Component {
    state = { 
        uploaddata:this.props.uploaddata,
        isOpen : false,
        currid:''
     } 

     async componentDidMount() {
        const jwt=localStorage.getItem("token");
        if(jwt==null){
            this.props.history.replace('/')
        }
    }

     GoBack=()=>{
         this.props.history.goBack()
     }

     setIsOpen =(a,currid) =>{
        const isOpen = a
        this.setState({isOpen,currid})
    }

    handleDelete = async data => {
        const originaluploaddata = this.state.uploaddata;

        console.log(data)
        const uploaddata = this.state.uploaddata.filter(p => p._id !== data._id);
        this.setState({ uploaddata,isOpen:false});
        try {
          await http.delete(`http://localhost:4000/faculty/upload/${data._id}`);
          this.props.uploadrefresh(data)
          toast.success("Portfolio deleted")
        } catch (ex) {
          this.setState({ uploaddata: originaluploaddata });
        }
      };

     componentDidMount(){
        const jwt=localStorage.getItem("token");
        if(jwt==null){
            this.props.history.replace('/')
        }
     }
    render() { 
        return (
          <div className="panel panel-default">
          <div className="panel-heading main-color-bg">
            <h2 className="panel-title dash-box"><span className="glyphicon glyphicon-list-alt" aria-hidden="true"></span>Results</h2>
          </div>
          <div className="panel-body">
        <table className="table table-striped">
        <thead className="main-color-bg">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
            <th scope="col">View</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {this.state.uploaddata.map(upload=>(                        
            <tr key={upload._id}>
            <th>{upload.name}</th>
            <td>{upload.title}</td>
            <td>{String(upload.created_at).slice(0,10)}</td>
            <td><Link className="btn btn-primary" to={`/faculty/reports/${upload._id}`} >view</Link></td>
            <td><a className="btn btn-danger" onClick={() => this.setIsOpen(true,upload._id)}>
                                              Delete
                                            </a>
                                            {(this.state.isOpen && (this.state.currid==upload._id)) && <Modal data={upload} handleDelete={this.handleDelete} setIsOpen={this.setIsOpen} />}</td>
            
          </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-secondary" onClick={()=>this.GoBack()}>Back</button>
      </div>
      </div>
      );
    }
}
 
export default FacultyResults;