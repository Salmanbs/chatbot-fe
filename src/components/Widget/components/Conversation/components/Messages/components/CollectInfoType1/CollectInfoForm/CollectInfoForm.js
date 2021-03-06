import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import Style from 'style-it';
import SendSlant from 'assets/send_slant';

import 'react-phone-input-2/lib/style.scss';
import './styles.scss';

const CollectInfoForm = ({ contactInfoStyle, submitInfo }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phNumber, setPhNumber] = useState('');

  const submitInfoForm = (e) => {
    e.preventDefault();
    submitInfo({
      userName: name,
      userEmail: email,
      phoneNumber: phNumber
    });
  };

  const handleOnChange = (value) => {
    setPhNumber(value);
  };

  return (
    <Style>
      {`
        .rw-contactInfo-inner-box {
          border: 1px solid ${contactInfoStyle.contactInfoInputBorderColor};
        }

        .rw-contactInfo-inner-box:focus {
          border: 1.5px solid ${contactInfoStyle.contactInfoInputBorderColor};
        }

        .rw-contactInfo-name {
          background-color: ${contactInfoStyle.contactInfoInputBgColor};
          font-size: ${contactInfoStyle.contactInfoInputFontSize};
          font-style: ${contactInfoStyle.contactInfoInputFontStyle};
          color: ${contactInfoStyle.contactInfoInputFontColor};
        }

        .rw-contactInfo-name::placeholder {
          color: ${contactInfoStyle.contactInfoInputPlaceholderColor};
        }

        .rw-contactInfo-email {
          background-color: ${contactInfoStyle.contactInfoInputBgColor};
          font-size: ${contactInfoStyle.contactInfoInputFontSize};
          font-style: ${contactInfoStyle.contactInfoInputFontStyle};
          color: ${contactInfoStyle.contactInfoInputFontColor};
        }

        .rw-contactInfo-email::placeholder {
          color: ${contactInfoStyle.contactInfoInputPlaceholderColor};
        }

        .rw-collectInfo-button {
          background-color: ${contactInfoStyle.contactInfoButtonBgColor};
          border: 1px solid ${contactInfoStyle.contactInfoButtonBorderColor};
          color: ${contactInfoStyle.contactInfoButtonTextColor};
          font-size: ${contactInfoStyle.contactInfoInputFontSize};
          font-style: ${contactInfoStyle.contactInfoInputFontStyle};
        }

        .rw-collectInfo-button:hover {
          background-color: ${contactInfoStyle.contactInfoButtonBgColorHover};
          border: 1px solid ${contactInfoStyle.contactInfoButtonBorderColorHover};
          color: ${contactInfoStyle.contactInfoButtonTextColorHover};
          font-size: ${contactInfoStyle.contactInfoInputFontSize};
          font-style: ${contactInfoStyle.contactInfoInputFontStyle};
        }

        .react-tel-input {
          background-color: ${contactInfoStyle.contactInfoInputBgColor};
          font-size: ${contactInfoStyle.contactInfoInputFontSize};
          font-style: ${contactInfoStyle.contactInfoInputFontStyle};
          border: 1px solid ${contactInfoStyle.contactInfoInputBorderColor};
          color: ${contactInfoStyle.contactInfoInputFontColor};
        }

        .react-tel-input .form-control {
          background-color: ${contactInfoStyle.contactInfoInputBgColor};
          font-size: ${contactInfoStyle.contactInfoInputFontSize};
          font-style: ${contactInfoStyle.contactInfoInputFontStyle};
          color: ${contactInfoStyle.contactInfoInputFontColor};
          border: 0px solid ${contactInfoStyle.contactInfoInputBorderColor};
        }
      `}
      <form className="rw-contactInfo-form" onSubmit={e => submitInfoForm(e)}>
        <div className="rw-contactInfo-name-box">
          <div className="rw-contactInfo-inner-box">
            <input
              className="rw-contactInfo-name"
              type="text"
              value={name}
              placeholder="Name"
              required
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="rw-contactInfo-email-box">
          <div className="rw-contactInfo-inner-box">
            <input
              className="rw-contactInfo-email"
              type="email"
              value={email}
              placeholder="Email"
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="rw-contactInfo-phNumber-box">
          <PhoneInput
            inputProps={{
              required: true
            }}
            country={'in'}
            placeholder="Mobile"
            value={phNumber}
            onChange={handleOnChange}
          />
        </div>
        <div className="rw-contactInfo-button-box">
          <button className="rw-collectInfo-button">
            <p>Submit</p>
            <SendSlant />
          </button>
        </div>
      </form>
    </Style>
  );
};

export default CollectInfoForm;
