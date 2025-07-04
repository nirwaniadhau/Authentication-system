import React from 'react'
import Navbar from '../Components/Navbar.jsx'
import Header from '../Components/Header.jsx'

function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")]'>
    <Navbar></Navbar>
    <Header></Header>
    </div>
  );
}

export default Home;