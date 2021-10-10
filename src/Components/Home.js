import {React, useState} from 'react'
import Splash from './Splash'
import '../CSS/Home.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Frontend from './Frontend';
import Backend from './Backend';
import DevOps from './Devops';

const Home = () => {

    return (

        <Router>

            <div class="container">
                <div className='header'>
                    <p className='header-name'>Jonathan Nguyen </p>
                    <div className='Header-About'> Software Developer | Atlanta, GA <br /></div>

                </div>

                <Switch>



                    <Route path="/FE">
                        <Frontend />
                    </Route>
                    <Route path="/BE">
                        <Backend />
                    </Route>
                    <Route path="/DO">
                        <DevOps />
                    </Route>
                    <Route path="/">
                        <Splash />
                    </Route>
                </Switch>

                <div className='leftHandNav'>
                    <div>
                        <nav>
                            <ul>
                                <li>
                                    <Link className='NavItem' tabIndex="1" to="/">Home</Link>
                                </li>
                                <li>
                                    <Link className='NavItem' tabIndex="2" to="/FE">Front End</Link>
                                </li>
                                <li>
                                    <Link className='NavItem' tabIndex="3" to="/BE">Back End</Link>
                                </li>
                                <li>
                                    <Link className='NavItem' tabIndex="4" to="/DO">DevOps</Link>
                                </li>
                            </ul>
                        </nav>

                    </div>

                    <div className='row'>

                        <a className='column' target="_blank" href="https://github.com/jsanguyen" >
                            <img src="/GitHub-Mark-32px.png" alt="Git"/>
                        </a>
                        <a className='column' target="_blank" href="https://www.linkedin.com/in/jonathan-nguyen-11302b138/" >
                            <img src="/linkedin-logo-32px.png" alt="LinkedIn"/>
                        </a>

                    </div>


                </div>

                <div className='footer'>A labor of <span style={{color: 'red'}}>love</span>. Made with React and CSS. Hosted with Kubernetes, Docker and GCP.</div>
            </div>

        </Router>
    )
}

export default Home
