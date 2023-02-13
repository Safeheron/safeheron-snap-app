import React from 'react';
import {G, Path} from 'react-native-svg';
const success = {
  width: 120,
  height: 120,
  path: (
    <G fill="none" fillRule="evenodd">
      <Path
        d="M60 120C26.865 120 0 93.135 0 60 0 26.865 26.865 0 60 0c33.135 0 60 26.865 60 60 0 33.135-26.865 60-60 60z"
        fill="#496CE9"
        mask="url(#b)"
      />
      <Path
        d="M49.665 78.278a4.837 4.837 0 0 0 6.842 0L85.83 48.954a4.837 4.837 0 0 0-6.841-6.842L52.877 67.807 41.191 56.12a4.838 4.838 0 0 0-6.842 6.842l15.316 15.316z"
        fill="#FFF"
      />
    </G>
  ),
};

export {success};
