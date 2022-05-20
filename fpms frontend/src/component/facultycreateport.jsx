import React, { Component } from 'react';
import http from "../services/httpService";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

class CreatePortfolio extends Component {
    state = { 
        portfol:{
            title:'',
            desc:'',
            image:null
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

        const { portfol } = this.state;
        if (portfol.title.trim() === "")
            errors.title="title is required.";
        if (portfol.desc.trim() === "")
            errors.desc="desc is required.";
        if (portfol.image === "")
            errors.image="image is required.";
        return Object.keys(errors).length===0? null : errors;
    }

    handleSubmit =async (e)=>{
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors : errors || {}});
        if (errors) return;
        console.log(this.state.portfol)
        try{
            let formData = new FormData();
            formData.append('image', this.state.portfol.image);
            formData.append('title',this.state.portfol.title);
            formData.append('desc',this.state.portfol.desc);
            formData.append('facid',this.props.userid)
            console.log(formData)
         const data=await http.post(
                'http://localhost:4000/faculty/newdoc',
                formData,
                {
                    headers: {
                        "Content-type": "multipart/form-data",
                    },                    
                }
            )
            toast.success("Portfolio Created Successfully")
        }
        catch (err){
            toast.error(err.response.data.message)
        }
    };

    handleChange = e =>{
        const portfol = { ...this.state.portfol};
        if(e.currentTarget.name=="image") portfol[e.currentTarget.name]=e.target.files[0]
        else portfol[e.currentTarget.name] = e.currentTarget.value;
        this.setState({portfol});
    }


    render() { 
        return (
            <div className="panel panel-default">
                        <div className="panel-heading main-color-bg">
                          <h2 className="panel-title dash-box"><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Create Portfolio</h2>
                        </div>
                        <br />
                        <form className="panel-body" onSubmit={this.handleSubmit}>
                            <div className="form-group row">
                                <label  htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                                <div className="col-sm-10">
                                  <input className="form-control" autocomplete="off" type="text" id="title" placeholder="Enter the title" 
                                    value={this.state.portfol.title} name="title" onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="desc" className="col-sm-2 col-form-label">Description</label>
                                <div className="col-sm-10">
                                  <textarea className="form-control" autocomplete="off" id="desc" name="desc" rows="2" value={this.state.portfol.desc}
                                        placeholder="Enter the Description" onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="form-group row">
                              <label htmlFor="image" className="col-sm-2 col-form-label">Upload Image</label>
                              <div className="col-sm-10">
                                <input type="file" className="form-control" id="image" 
                                    name="image"  onChange={this.handleChange}/>
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
 
export default CreatePortfolio;