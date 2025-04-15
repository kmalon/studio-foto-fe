// import React from 'react'
import Navbar from '../Navbar.tsx'
import './About.css'

import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";

const images = [
    {
        original: "https://picsum.photos/id/1018/1000/600/",
        thumbnail: "https://picsum.photos/id/1018/250/150/",
    },
    {
        original: "https://picsum.photos/id/1015/1000/600/",
        thumbnail: "https://picsum.photos/id/1015/250/150/",
    },
    {
        original: "https://picsum.photos/id/1019/1000/600/",
        thumbnail: "https://picsum.photos/id/1019/250/150/",
    }
];

const About = () => {
    return (
        <>
            {/*<FitScreen mode="full" className="gallery-page">*/}


            <div className="gallery-page">


            <div className="aaa">
                <Navbar/>
                <h1>About</h1>
                <ImageGallery items={images}/>
            </div>
            </div>
            {/*</FitScreen>*/}
        </>
    )
}

export default About