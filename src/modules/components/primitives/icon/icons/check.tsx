import React from 'react';
import {G, Polygon, Circle} from 'react-native-svg';

const checkedSolid = {
  width: 20,
  height: 20,
  path: (
    <G>
      <Circle fill="#496CE9" cx="10" cy="10" r="10" />
      <Polygon
        fill="#FFFFFF"
        points="15.3946403 7.50481487 8.96413731 14.0129634 8.77584197 14.1903368 8.58754664 14.0129634 4.60535969 9.98263006 5.90375627 8.66834825 8.77553352 11.5751908 14.0962437 6.19033677"
      />
    </G>
  ),
};

export {checkedSolid};
