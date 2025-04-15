// import {useState} from 'react'
// import reactLogo from './assets/react.svg'
import {Route, Routes} from "react-router"
import Home from "./pages/Home.tsx";
// import viteLogo from '/vite.svg'
import './App.css'
import About from "./pages/About.tsx";


function App() {
    // const [count, setCount] = useState(0)

    return (
        // <Router>
        //     <Sidebar />
        //     <Switch>
        //         <Route exact path='/data' component={Data} />
        //         <Route path='/data/subdata' component={SubData} />
        //         <Route path='/data/subdata2' component={SubData2} />
        //     </Switch>
        // </Router>
        // <div className="main">

            //<FitScreen mode="scrollX" className="first-page">
            //<div style={{backgroundImage: `url(${reactLogo})`}}>

           <>
               <Routes>
                   <Route path='/' element={<Home/>}/>
                   <Route path='/about' element={<About/>} />
                   {/*<Route path='/contact' element={<Contact/>} />*/}
               </Routes>
           </>


            // {/`*<div className="first-page-first-part">*/}
            // {/*    */}
            // {/*    */}
            // {/*</div>*/}
            // {/`*</FitScreen>*/}


        // </div>
    )
}

export default App
