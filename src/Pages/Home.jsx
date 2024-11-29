import React from 'react'
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Services from "../components/Services";
import Navbar from "../components/Navbar";
import TopSection from "../components/TopSection";
import Session from "../components/Session";

const Home = () => {
  return (
    <>
      <Navbar/>
      <TopSection/>
      <Session/>
      <Services/>
      <Contact/>
      <Footer/>
    </>
  )
}

export default Home