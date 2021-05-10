import React from 'react';
import PropTypes, { string } from 'prop-types';
import { connect } from 'react-redux';
import Style from 'style-it';
import $ from 'jquery';

import Send from 'assets/send_button';
import PaperClip from 'assets/paperclip';
import Gallery from 'assets/gallery';
import Location from 'assets/location';
import Document from 'assets/document';
import FlipMove from 'react-flip-move';
import {
  changeInputFieldHint,
  doInputDisabled,
  doAttachDisabled,
  doAttachLocationDisabled,
  doInputEnabled,
  emitUserMessage,
  addUserMessage,
  addImageSnippetUser
} from 'actions';

import './style.scss';
import LocationPickerEx from './LocationPicker';

const styles = {
  display: '-webkit-box',
  overflowY: 'hidden'
};

const progress = (e) => {

  if(e.lengthComputable){
      var max = e.total;
      var current = e.loaded;

      var Percentage = (current * 100)/max;
      console.log(Percentage);


      if(Percentage >= 100)
      {
         // process completed  
      }
  }  
}


class Sender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      pictures: [],
      isPaperClipOpen: false,
      address: '',
      position: {
        lat: 0,
        lng: 0
      },
      isLocationOpen: false,
      loader: false
    };

    this.inputElement = '';

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDropFile = this.onDropFile.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.triggerFileUpload = this.triggerFileUpload.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultImages !== this.props.defaultImages) {
      this.setState({ pictures: nextProps.defaultImages });
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.connected && (this.props.connected != prevProps.connected)) {
      this.setState({
        inputValue: ''
      });
    }
  }

  onDropFile(e) {
    const files = e.target.files;
    const allFilePromises = [];

    // Iterate over all uploaded files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      allFilePromises.push(file);
    }

    this.setState({
      pictures: allFilePromises,
      isPaperClipOpen: !this.state.isPaperClipOpen
    });
  }

  onUploadClick(e) {
    e.target.value = null;
  }

  togglePaperClip = () => {
    this.setState({
      isPaperClipOpen: !this.state.isPaperClipOpen
    });
  }

  handleChange = (e) => {
    this.setState({
      inputValue: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // assume some file is uploaded by user, lets process only attach file and ignore typed text
    if (this.state.pictures.length > 0) {    
    //if (!this.props.disabledAttach) {

      console.log('+++++++ handleSubmit Upload attachment +++++++', this.props.customData.bot_id);
      const fd = new FormData();
      const files = this.state.pictures[0];
      console.log('+++++++ handleSubmit Upload attachment +++++++', files.name);

      fd.append('files[]', files, files.name);
      // fd.append('label', 'WEBUPLOAD');
      fd.append('bot_id', this.props.customData.bot_id);
      fd.append('session_id', '3745637');
      fd.append('type', 'file');
      this.setState({
        loader: true
      });
      $.ajax({
        // url: 'https://www.workchallenger.com/tosall_client2/api/capture_attachment',
        url: 'https://www.workchallenger.com/tosall_client/api/capture_attachment_file_location',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        crossDomain: true,
        headers: {
          Authorization: 'Bearer Kailashchandra353',
          token: 'Kailashchandra353'
        },
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){
                myXhr.upload.addEventListener('progress',progress, false);
            }
            return myXhr;
      },

      }).done((result) => {
        const response = JSON.parse(result);
        console.log('+++++++ handleSubmit Upload attachment 111 +++++++', this.props.customData.bot_id);
        console.log('+++++++ handleSubmit Upload attachment 111 +++++++', response);

        if (response['status'] == 'success') {
          console.log(response['msg']);
          console.log('+++++++ handleSubmit Upload attachment Success +++++++', response['link'][0]);

          console.log('+++++++ handleSubmit Upload attachment 222 +++++++');
          const imgurl = response['link'][0]
          const resp = { attachment: {type:'image', payload: {src:imgurl,title:""}}};
          const element = resp.attachment.payload;
          console.log('+++++++ handleSubmit Upload attachment 7771 +++++++', resp);
          console.log('+++++++ handleSubmit Upload attachment 7772 +++++++', element);
          console.log('+++++++ handleSubmit Upload attachment 7773 +++++++', element.src);
          // this.props.chooseReply({ title: 'Image uploaded', payload: files });

          this.props.chooseReply2({title:'', image:imgurl});
          this.props.changeInputFieldHint('Type a message…');
          
          // this.props.doInputDisabled();
          // this.props.doAttachDisabled();
          // this.props.doAttachLocationDisabled();
          // this.props.changeInputFieldHint('');

        }
        this.setState({
          loader: false
        });
      }).fail(() => {
        console.log('Failed!');
        console.log('+++++++ handleSubmit Upload attachment Failed +++++++');
        this.setState({
          loader: false
        });
      });

      // console.log('+++++++ handleSubmit Upload attachment 222 +++++++');
      // // this.props.chooseReply({ title: 'Image uploaded', payload: files });

      // resp = { attachment: {type:'image', payload: {src:str(response['link'][0]),title:""}}};
      // const element = resp.attachment.payload;
      // this.props.dispatch(
      //     addImageSnippet({
      //         title: element.title,
      //         image: element.src,
      //     })
      // );
      
      // this.props.doInputDisabled();
      // this.props.doAttachDisabled();
      // this.props.doAttachLocationDisabled();
      // this.props.changeInputFieldHint('');
    } else if (this.state.position.lng && this.state.position.lat) {
    //else if (!this.props.disabledAttachLocation) {
      this.props.chooseReply({ title: 'Location uploaded', payload: this.state.position });
      this.props.doInputDisabled();
      this.props.doAttachDisabled();
      this.props.doAttachLocationDisabled();
      this.props.changeInputFieldHint('');
    } else {
      this.props.sendMessage(e);
    }

    this.setState({
      inputValue: '',
      pictures: [],
      isPaperClipOpen: false,
      address: 'Dummy Location',
      position: {
        lat: 0,
        lng: 0
      },
      isLocationOpen: false
    });
    
  }

  removeImage(picture) {
    const removeIndex = this.state.pictures.findIndex(e => e === picture);
    const filteredPictures = this.state.pictures.filter((e, index) => index !== removeIndex);
    // const filteredFiles = this.state.files.filter((e, index) => index !== removeIndex);

    this.setState({
      pictures: filteredPictures
    });
  }

  renderPreview() {
    return (
      <div className="rw-uploadPicturesWrapper">
        <FlipMove enterAnimation="fade" leaveAnimation="fade" style={styles}>
          {this.renderPreviewPictures()}
        </FlipMove>
      </div>
    );
  }

  renderLoader() {
    return (
      <Style>
            {`
            .rw-spinner {
              height: 30%;
              background-color: #eeeeee;
              -moz-user-select: none;
              -webkit-user-select: none;
              display: flex;
              align-items: center;
              justify-content: center;
            }
              .spinner-container {
                animation: rotate 2s linear infinite;
                -webkit-animation: rotate 2s linear infinite;
              }
              
              .spinner-container .path {
                stroke-dasharray: 1, 150;
                /* 1%, 101% circumference */
                stroke-dashoffset: 0;
                stroke: rgba(27, 154, 89, 0.7);
                stroke-linecap: round;
                animation: dash 1.5s ease-in-out infinite;
                -webkit-animation: dash 1.5s ease-in-out infinite;
              }
              
              @keyframes rotate {
                100% {
                  transform: rotate(360deg);
                }
              }
              
              @keyframes dash {
                0% {
                  stroke-dasharray: 1, 150;
                  /* 1%, 101% circumference */
                  stroke-dashoffset: 0;
                }
                50% {
                  stroke-dasharray: 90, 150;
                  /* 70%, 101% circumference */
                  stroke-dashoffset: -35;
                  /* 25% circumference */
                }
                100% {
                  stroke-dasharray: 90, 150;
                  /* 70%, 101% circumference */
                  stroke-dashoffset: -124;
                  /* -99% circumference */
                }
              }
              
              @-webkit-keyframes rotate {
                100% {
                  transform: rotate(360deg);
                }
              }
              
              @-webkit-keyframes dash {
                0% {
                  stroke-dasharray: 1, 150;
                  /* 1%, 101% circumference */
                  stroke-dashoffset: 0;
                }
                50% {
                  stroke-dasharray: 90, 150;
                  /* 70%, 101% circumference */
                  stroke-dashoffset: -35;
                  /* 25% circumference */
                }
                100% {
                  stroke-dasharray: 90, 150;
                  /* 70%, 101% circumference */
                  stroke-dashoffset: -124;
                  /* -99% circumference */
                }
              }
            `}
        <div className="rw-spinner">
            <svg class="spinner-container" width="65px" height="65px" viewBox="0 0 52 52">
              <circle class="path" cx="26px" cy="26px" r="20px" fill="none" stroke-width="4px" />
            </svg>
        </div>
      </Style>
    );
  }

  renderPreviewPictures() {
    return this.state.pictures.map((picture, index) => (
      <div key={index} className="rw-uploadPictureContainer">
        <div className="rw-deleteImage" onClick={() => this.removeImage(picture)}>X</div>
        <img src={URL.createObjectURL(picture)} className="rw-uploadPicture" alt="preview" />
      </div>
    ));
  }

  triggerFileUpload() {
    this.inputElement.click();
  }

  clearPictures() {
    this.setState({ pictures: [] });
  }

  triggerLocationUpload = () => {
    this.setState({
      isLocationOpen: true,
      isPaperClipOpen: !this.state.isPaperClipOpen
    });
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      });
    });
  }

  handleLocationChange = ({ position, address, places }) => {
    this.setState({ position });
  }

  render() {
    const {
      inputTextFieldHint,
      disabledInput,
      disabledAttach,
      disabledAttachLocation,
      userInput,
      sendButtonColor,
      userTypeWindowBgColor,
      placeholderTextColor,
      textFontFamily,
      inputCaretColor,
      chatFontSize,
      isTextAreaBoxShadowEnabled,
      customData
    } = this.props;

    const boxShadowStyle = isTextAreaBoxShadowEnabled ? 'inset 0 0px 8px 0px #b5b5b5' : 'none';

    return (
      userInput === 'hide' ? <div /> : (
        <React.Fragment>
          {this.state.isPaperClipOpen &&
          <Style>
            {`
              .attachmentBtn {
                background-color: ${this.props.sendButtonColor};
              }
            `}
            <div className="rw-attachment-box">
              <button
                type={this.props.buttonType}
                className="rw-attachmentBtn"
                onClick={this.triggerFileUpload}
                disabled={disabledAttach}
              >
                <Gallery className="rw-send-icon" sendButtonColor="white" ready="true" alt="send" />
                <input
                  style={{
                    position: 'absolute',
                    visibility: 'hidden'
                  }}
                  type="file"
                  ref={input => this.inputElement = input}
                  multiple={!this.props.singleImage}
                  onChange={this.onDropFile}
                  onClick={this.onUploadClick}
                  accept={this.props.accept}
                />
              </button>
              <button
                type="button"
                className="rw-attachmentBtn"
                onClick={this.triggerLocationUpload}
                disabled={disabledAttachLocation}
              >
                <Location className="rw-send-icon" sendButtonColor="white" ready="true" alt="send" />
              </button>
            </div>
          </Style>
          }
          { this.state.pictures.length > 0 ? this.renderPreview() : null }
          { this.state.loader ? this.renderLoader() : null }
          {!disabledAttachLocation && this.state.isLocationOpen && <LocationPickerEx
            address={this.state.address}
            position={this.state.position}
            handleLocChange={this.handleLocationChange}
          />}
          <form
            className="rw-sender"
            onSubmit={this.handleSubmit}
            style={{
              backgroundColor: userTypeWindowBgColor,
              boxShadow: boxShadowStyle
            }}
          >
            {(!disabledAttach || !disabledAttachLocation) && <button
              type="button"
              className="rw-send"
              disabled={disabledAttach && disabledAttachLocation}
              style={{
                backgroundColor: userTypeWindowBgColor
              }}
              onClick={this.togglePaperClip}
            >
              <PaperClip className="rw-send-icon" sendButtonColor={sendButtonColor} ready="true" alt="send" />
            </button>}
            <Style>
              {`
                .rw-new-message::placeholder {
                  color: ${placeholderTextColor};
                  font-size: ${chatFontSize};
                  font-family: ${textFontFamily};
                }
              `}
              <div className="rw-input-div">
                <input
                  type="text"
                  multiline
                  onChange={this.handleChange}
                  className="rw-new-message"
                  name="message"
                  placeholder={inputTextFieldHint}
                  disabled={disabledInput || userInput === 'disable'}
                  autoFocus
                  autoComplete="off"
                  value={this.state.inputValue}
                  style={{
                    backgroundColor: userTypeWindowBgColor,
                    fontFamily: textFontFamily,
                    caretColor: inputCaretColor,
                    fontSize: chatFontSize
                  }}
                />
              </div>
            </Style>
            <button
              type="submit"
              className="rw-send"
              disabled={!(this.state.inputValue && this.state.inputValue.length > 0) &&
                !(this.state.pictures.length > 0) &&
                (disabledAttachLocation && !this.state.position.lng)}
              style={{
                backgroundColor: userTypeWindowBgColor
              }}
            >
              <Send
                className="rw-send-icon"
                sendButtonColor={sendButtonColor}
                ready={!!(this.state.inputValue && this.state.inputValue.length > 0) || this.state.pictures.length > 0 || (!disabledAttachLocation && this.state.position.lng)}
                alt="send"
              />
            </button>
          </form>
        </React.Fragment>));
  }
}
const mapStateToProps = state => ({
  messages: state.messages,
  inputTextFieldHint: state.behavior.get('inputTextFieldHint'),
  userInput: state.metadata.get('userInput')
});

const mapDispatchToProps = dispatch => ({
  doInputDisabled: () => dispatch(doInputDisabled()),
  doAttachDisabled: () => dispatch(doAttachDisabled()),
  doAttachLocationDisabled: () => dispatch(doAttachLocationDisabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
  chooseReply: ({ title, payload }) => {
    dispatch(addUserMessage(title));
    dispatch(emitUserMessage(title));
  },

  chooseReply2: ({title,image}) => {
    // console.log('+++++++ chooseReply2 Upload attachment 7771 +++++++', resp);
    // const element = resp;
    // console.log('+++++++ chooseReply2 Upload attachment 7771 +++++++', element);
    dispatch(
        addImageSnippetUser({
            title: title,
            image: image,
        })
    );

    //const resp = { attachment: {type:'image', payload: {src:image,title:""}}};
    
    const attachreply = '$$attachreply$$'+image
    console.log('+++++++ chooseReply2 Upload attachment 7771 +++++++', attachreply);
    dispatch(emitUserMessage(attachreply));
    // dispatch(addUserMessage(title));
    // dispatch(emitUserMessage(title));
  }

});

Sender.propTypes = {
  sendMessage: PropTypes.func,
  inputTextFieldHint: PropTypes.string,
  disabledInput: PropTypes.bool,
  disabledAttach: PropTypes.bool,
  disabledAttachLocation: PropTypes.bool,
  userInput: PropTypes.string,
  customData: PropTypes.shape({}),
  chooseReply: PropTypes.func.isRequired,
  chooseReply2: PropTypes.func.isRequired
};

Sender.defaultProps = {
  className: '',
  fileContainerStyle: {},
  buttonClassName: '',
  buttonStyles: {},
  withPreview: false,
  accept: 'image/*',
  name: '',
  withIcon: true,
  buttonText: 'Choose images',
  buttonType: 'button',
  withLabel: true,
  label: 'Max file size: 5mb',
  labelStyles: {},
  labelClass: '',
  imgExtension: ['.jpg', '.jpeg', '.gif', '.png'],
  maxFileSize: 5242880,
  fileSizeError: ' file size is too big',
  fileTypeError: ' is not a supported file extension',
  errorClass: '',
  style: {},
  errorStyle: {},
  singleImage: false,
  onChange: () => {},
  defaultImages: [],
  customData: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Sender);
