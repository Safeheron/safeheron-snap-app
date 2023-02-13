import React from 'react';

function isJSX(e: JSX.Element | any): e is JSX.Element {
  return React.isValidElement(e);
}

export {isJSX};
