import React from 'react'
import './dashbord.css'
import NaviBar from '../components/NaviBar';
import SideBar from '../components/SideBar';
import NoticeBoard from '../components/NoticeBoard';





const noticeImages = [
  "https://res.cloudinary.com/da2wbtci0/image/upload/v1755964000/WhatsApp_Image_2025-08-22_at_12.53.38_PM_j2h0ua.jpg",
  "https://res.cloudinary.com/da2wbtci0/image/upload/v1755964001/WhatsApp_Image_2025-08-21_at_12.26.17_PM_fjchvn.jpg",
  "https://res.cloudinary.com/da2wbtci0/image/upload/v1755964001/WhatsApp_Image_2025-08-22_at_7.52.54_AM_rgaftc.jpg"
];
function DashBord() {

  return (
    <>
    <NaviBar/>
    <div className="dash">
      <SideBar/>
      <div className="nimg">
        <NoticeBoard images={noticeImages} interval={5000}/>
        <div className="linkbox">
          <h3>Medical Availability</h3>
          <h1 style={{marginLeft:'auto',marginRight:'20px'}}>Yes</h1>
        </div>
        <div className="linkbox">
          <h3>See results</h3>
          <h1 style={{marginLeft:'auto',marginRight:'20px',color:'rgba(16, 16, 255, 1)'}}>SiS</h1>
        </div>
      </div>
    </div>
    </>
  )
}

export default DashBord