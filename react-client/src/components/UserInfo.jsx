import React from 'react';

const UserInfo = (props) => {
  var status = '';
  if (props.googledInfo.title) {
    status = props.googledInfo.title + ', ' + props.googledInfo.company;
  }
  return(
    <div>
      <div className="row">
        <div className="col padding15">
          <img src={props.photo} className="circle" />
        </div>
        <div className="col">
          <h4 className="title small-height marginBottom5">
            { props.name }
          </h4>
          <span className="small grey small-height">
            { status }
          </span>
          <br></br>
          <span className="small small-height">
            { props.googledInfo.location }
          </span>
        </div>
      </div>
      {/*
        <div className="row">
          {props.googledInfo.linkedin &&
          <p className="small-height"><a href={ props.googledInfo.linkedin }>LinkedIn</a></p>}
          {props.googledInfo.facebook &&
          <p className="small-height"><a href={ props.googledInfo.facebook } target="_blank">Facebook</a>
          </p>}
          {props.googledInfo.twitter &&
          <p className="small-height"><a href={ props.googledInfo.twitter }
                                         target="_blank">Twitter</a></p>}
          {props.googledInfo.instagram &&
          <p className="small-height"><a href={ props.googledInfo.instagram } target="_blank">Instagram</a>
          </p>}
          {props.googledInfo.behance &&
          <p className="small-height"><a href={ props.googledInfo.behance }
                                         target="_blank">Behance</a></p>}
          {props.googledInfo.crunchbase &&
          <p className="small-height"><a href={ props.googledInfo.linkedin } target="_blank">Crunchbase</a>
          </p>}
        </div>
      */}
    </div>
  )
};

export default UserInfo;