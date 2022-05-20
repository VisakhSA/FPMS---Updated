import React, { Component } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../services/httpService';
import Login from './login';
import Adminfp from './adminfp';
import Facultyfp from './facultyfp';
import Faculty from './faculty';
import Admin from './admin';
import Adminresetpw from './adminresetpw';
import Facultyresetpw from './facultyresetpw';
import '../styles/style1.css'
import '../styles/style2.css'

class Root extends Component {
    state = { 
    } 

    render() { 
        return (
            <div>
                <ToastContainer />
                <main>
                <Switch>
                    <Route path="/facfp/:id/:token" component={Facultyresetpw} />
                    <Route path="/adminfp/:id/:token" component={Adminresetpw} />
                    <Route path="/faculty" component={Faculty} />
                    <Route path="/admin" component={Admin}/>
                    <Route path="/login" component={Login} />
                    <Route path="/admfp" component={Adminfp} />
                    <Route path="/facfp" component={Facultyfp} />
                    <Redirect from="/" exact to="/login" />
                </Switch>
                </main>
            </div>
        );
    }
}
 
export default Root;