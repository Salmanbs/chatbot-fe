import React from "react";
import './style.scss';

const Footer = () => {
  return (
    <div className="rw-footer">
    {
      <span className="rw-signature">
        {
          <a className="rw-signature1" target="_blank" href="https://www.tosall.com/"> 
            {"Powered by"}
          <img src={"https://www.tosall.com/demo3/images/home-logo-top.png"}
          className="rw-avatarfooter"
          />
          </a>
        }
      </span>
    }

    </div>
  );
}

export default Footer;