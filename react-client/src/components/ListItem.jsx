import React from 'react';

const ListItem = (props) => (
  <li className="collection-item avatar">
    <img src={props.friend.facebook.photo} className="circle" />
    <span className="title">{ props.friend.name }</span>
  </li>
);

export default ListItem;