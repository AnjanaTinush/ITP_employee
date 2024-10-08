import React from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css'; // Custom CSS file for styling
import Dashboard from "../Images/dashboard.png"
import Dash2 from "../Images/Dash2.png"


function Home() {
  return (
    <div className="">
    <div className='flex mt-32 mb-32'>
    <div>
    <img src={Dash2} alt="Dashboard" className="w-[500px] h-auto rounded-xl" />
    </div>
    <div>
    <img src={Dashboard} alt="Dashboard" className="w-[500px] h-auto rounded-xl" />
    
    </div>
    
</div>


    </div>
  );
}

export default Home;