import React from 'react';
import './style.scss';

const Footer = ({
  poweredByImage
}) => (
  <div className="rw-footer">
    {
      <span className="rw-signature">
        {
          <a className="rw-signature1" target="_blank" href="https://www.tosall.com/">
            {'Powered by'}
            <img
              src={poweredByImage}
              className="rw-avatarfooter"
              alt=""
            />
          </a>
        }
      </span>
    }

  </div>
);

export default Footer;
