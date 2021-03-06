import React from 'react';

const Close = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    enableBackground="new 0 0 512 512"
    version="1.1"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
    className="rw-open-launcher"
  >
    <g transform="matrix(0.732304 0 0 0.732304 68.5303 124.254)">
      <path d="M448,0H64C28.704,0,0,28.704,0,64v288c0,35.296,28.704,64,64,64h32v80  c0,6.208,3.584,11.872,9.216,14.496c2.144,0.992,4.48,1.504,6.784,1.504c3.68,0,7.328-1.28,10.24-3.712L232.992,416H448  c35.296,0,64-28.704,64-64V64C512,28.704,483.296,0,448,0z" data-original="#2196F3" className="active-path" data-old_color="#2196F3" fill={props.fillColor} />
    </g>
  </svg>
);

export default Close;
