import React from 'react';

const ListItem = (props) => (
  <li className="collection-item avatar">
    <img src={props.item.facebook.photo} className="circle" />
    <span className="title">{ props.item.name }</span>
  </li>
);

export default ListItem;