import React, { Component } from 'react';
import http from '../services/httpService';
import * as html2pdf from 'html2pdf.js'


class DownloadReport extends Component {
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

     GeneratePdf() {
        var element = document.getElementById('download data');
        html2pdf(element,{
            margin:       1,
            filename:     `${this.state.uploaddata.name}-${this.state.uploaddata.title}-${String(this.state.uploaddata.created_at).slice(0,10)}.pdf`,
            image:        { type: 'png', quality: 0.98 },
            html2canvas:  { dpi: 300,
                            letterRendering: true,
                            useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
});
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
        this.props.history.goBack()
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
            <img src={`data:${this.state.uploaddata.img.contentType};base64,${this._arrayBufferToBase64(this.state.uploaddata.img.data.data)}`}  width="600" height="600"/><br/>
            </div>
            </div>
            </div>
            </div>
            <div className='col-md-12 text-center'>
            <button type="button" className="btn btn-primary" onClick={()=>this.GeneratePdf()} >Download</button>&nbsp;
            <button type="button" className="btn btn-secondary" onClick={()=> this.Back()} >Back</button>
            </div>
        </div>
        );
    }
}
 
export default DownloadReport;