import React from 'react';

import {G, Path} from 'react-native-svg';

export default {
  width: 16,
  height: 16,
  path: (
    <G fill-rule="nonzero" fill="none">
      <Path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z" fill="#496CE9" />
      <Path
        d="M8 13.292a1.02 1.02 0 1 1 0-2.04 1.02 1.02 0 0 1 0 2.04zM9.02 8.965a1.02 1.02 0 0 1-2.04 0V4.613a1.02 1.02 0 0 1 2.04 0v4.352z"
        fill="#FFF"
      />
    </G>
  ),
};
