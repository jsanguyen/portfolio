import React from "react";
import '../CSS/FrontEnd.css'
const Frontend = () => {

    return (
        <div className='routeComp'>
            <p className='feHeader'> 4 Years - React.js • JavaScript • HTML • CSS • FireBase</p>
            <p className='feParagraph'>
                • Designed, developed, tested and maintained multiple role-based React web portal for external
                clients and brokers. 
                These web portals contained various tools that allowed clients and brokers to manage their members healthcare coverages and employee counts. 
               </p>

            <p className='feParagraph'>
                •   Tools built included; Data tables for displaying all employees of group as well as their employee information. 
                Eligibility forms that allowed clients to add new employees to their groups and select their repsective heath care products. 
                Custom document manager that allowed internal employees to save custom files and documents tosecure firebase folders for each respective group to see. Utilized Firebase rules to ensure security was met.
            
            </p>


            <p className='feParagraph'>
                •  Developed and maintained internal web applications that served as data reporting tools for employees to use. 
                Resulted in drastic reduction of burned time as manual processes were automated and visualized for employees to use. 
                These tools included data visualization of group censuses, reporting tables for claims cost for groups or specific employees, claims information for specific claims and additional data visualization for other reports that were based on SQL demands and asks. 
            </p>

            <p className='feParagraph'>
                • Web apps were built with Material UI and additional custom CSS
                with responsive design in mind. UI applications connected with Firebase SDK as well as
                inhouse REST endpoints. </p>
            <p className='feParagraph'>
                • All apps dockerized and deployed into GCP Kubernetes.</p>

        </div>
    )
}

export default Frontend
