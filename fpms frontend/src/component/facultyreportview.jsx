import React, { Component, useState } from 'react';
import http from '../services/httpService';
import Popup from 'reactjs-popup';
import Modal from './modal';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { NavLink , Link } from 'react-router-dom';

class FacultyReportView extends Component {
    state = { 
        uploaddata : {
            img:{
                contentType:'',
                data:{
                    data:''
                }
            }
        }
     } 


    async componentDidMount() {
        const jwt=localStorage.getItem("token");
        if(jwt==null){
            this.props.history.replace('/')
        }
        // pending > resolved (success) OR rejected (failure)
        const {data : uploaddata} = await http.get(`http://localhost:4000/admin/report/${this.props.match.params.id}`);
        this.setState({ uploaddata });
      }

      _arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

    Back(){
        this.props.history.goBack();
    }
    render() { 
        return (
            <div>
            <div id="download data">
            <div className="panel panel-default">
            <div className="panel-heading">
            <h2 className="panel-title dash-box"><span className="glyphicon glyphicon" aria-hidden="true"></span><b>Report</b></h2>
            </div>
            <div className="panel-body">
            <table class="table table-striped">
                <tbody>
                    <tr>
                    <td class="text-center"><b>Faculty Name</b></td>
                    <td class="text-center">{this.state.uploaddata.name}</td>
                    </tr>
                    <tr>
                    <td class="text-center"><b>Title</b></td>
                    <td class="text-center">{this.state.uploaddata.title}</td>
                    </tr>
                    <tr>
                    <td class="text-center"><b>Description</b></td>
                    <td class="text-center">{this.state.uploaddata.desc}</td>
                    </tr>
                </tbody>
                </table>
            <h4 className="text-center"><b>Image Proof</b></h4>
            <div className='col-md-12 text-center'>
            <img src={`data:${this.state.uploaddata.img.contentType};base64,${this._arrayBufferToBase64(this.state.uploaddata.img.data.data)}`}  width="700" height="500"/><br/>
            </div>
            </div>
            </div>
            </div>
            <button type="button" className="btn btn-secondary" onClick={()=> this.Back()} >Back</button>
        </div>
        );
    }

}
 
export default FacultyReportView;