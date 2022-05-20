import React, { Component } from 'react';
import { NavLink , Link } from 'react-router-dom';

class Results extends Component {
    state = { 
        uploaddata:this.props.uploaddata
     } 

     GoBack=()=>{
         this.props.history.goBack()
     }
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
          </tr>
        </thead>
        <tbody>
          {this.state.uploaddata.map(upload=>(                        
            <tr key={upload._id}>
            <th>{upload.name}</th>
            <td>{upload.title}</td>
            <td>{String(upload.created_at).slice(0,10)}</td>
            <td><Link className="btn btn-primary" to={`/admin/repgen/${upload._id}`} >view</Link></td>
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
 
export default Results;