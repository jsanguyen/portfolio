import React from "react";
import '../CSS/Splash.css'

const Splash = () => {
    return (
        <div className='routeComp'>
            <h2 className='splashHeader'>Thank you for Visiting my Page.</h2>
            <p className='splahParagraph'>I'm Jonathan, and I appreciate you taking the time to come check out my site. 
            This site's still a work in progress and I will be adding more to it as time goes on. </p>
            
            <p className='splahParagraph'>Writing code is what I do for a living and as a hobby. I have 5 years of experience working on/with a myriad of technical tools and ecosystems. You can found out more about the tools I've used with the left thand nav bar. </p>
            <p className='splahParagraph'>
            My experience includes architecting web portals that serves hundreds of thousands of clients for healthcare coverage and eligibility, complex data analytics processing and cleansing with Scala, and end-to-end cloud management of applications and ecosystems.
            </p>
        </div>
    )
}

export default Splash
