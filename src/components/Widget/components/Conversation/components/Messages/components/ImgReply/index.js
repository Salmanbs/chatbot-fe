import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';
// import DOWNLOAD from 'assets/download-black-18dp.svg';
import Download from 'assets/download_button';
import './styles.scss';

class ImgReply extends PureComponent {
  render() {
    const { params: { images: { dims = {}, backgroundColor } = {} }, downloadOptions, download } = this.props;
    const { width, height } = dims;
    const message = this.props.message.toJS();
    const { title, image } = message;
    const customCss = this.props.message.get('customCss') && this.props.message.get('customCss').toJS();

    if (customCss && customCss.style === 'class') {
      customCss.css = customCss.css.replace(/^\./, '');
    }

    return (

      <div
        className={customCss && customCss.style === 'class' ?
          `image ${customCss.css}` :
          'image'}
        style={{ cssText: customCss && customCss.style === 'custom' ?
          customCss.css :
          undefined }}
      >
        <b className="rw-image-title">
          { title }
        </b>
        <div className="rw-image-container">
          <div className="rw-image-details" style={{ width, height, backgroundColor }}>
            <img className="rw-image-frame" src={image} />
          </div>
          {
            downloadOptions.show && 
            <div className="rw-download-image-container" style={{ 'background-color' : downloadOptions?.backgroundColor }} onClick={() => download(image)}>
              <Download fillColor={downloadOptions?.iconColor}/>
            </div>
          }
        </div>
      </div>
    );
  }
}

ImgReply.propTypes = {
  message: PROP_TYPES.IMGREPLY
};

ImgReply.defaultProps = {
  params: {},
  downloadOptions: {}
};

export default ImgReply;
