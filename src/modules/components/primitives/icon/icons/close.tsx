import React from 'react';
import {G, Path, Circle} from 'react-native-svg';

const closeOutlined = {
  width: 16,
  height: 16,
  path: (
    <G stroke="#BFCBCB" strokeWidth={2.5} fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <Path d="m2 2 10 10M12 2 2 12" />
    </G>
  ),
};

const closeOutlineRect = {
  width: 12,
  height: 12,
  path: (
    <G stroke="#E64646" strokeWidth={2} fill="none" fillRule="evenodd">
      <Path d="M11 1 1 11M1 1l10 10" />
    </G>
  ),
};

const closeSolid = {
  width: 16,
  height: 16,
  d: 'M11.279,4.736 C10.984,4.4415 10.505,4.4415 10.21,4.736 L7.9925,6.9535 L5.8635,4.8245 C5.577,4.5375 5.112,4.5375 4.825,4.8245 C4.5385,5.111 4.5385,5.576 4.825,5.863 L6.9545,7.992 L4.7365,10.21 C4.442,10.505 4.442,10.9835 4.7365,11.278 C5.032,11.5735 5.5105,11.5735 5.8055,11.278 L8.023,9.061 L10.1645,11.2015 C10.451,11.4885 10.916,11.4885 11.2025,11.2015 C11.489,10.915 11.489,10.45 11.2025,10.1635 L9.0615,8.0225 L11.279,5.805 C11.5735,5.51 11.5735,5.0315 11.279,4.736 M8,16 C3.582,16 0,12.418 0,8 C0,3.5815 3.582,0 8,0 C12.4185,0 16,3.5815 16,8 C16,12.418 12.4185,16 8,16',
};

const closeOutlineCircle = {
  width: 28,
  height: 28,
  path: (
    <G stroke="#FFF" strokeWidth={2} fill="none" fillRule="evenodd">
      <Circle cx={14} cy={14} r={13} />
      <G strokeLinecap="round">
        <Path d="m10 10 8.253 8.253M18.253 10 10 18.253" />
      </G>
    </G>
  ),
};

export {closeOutlined, closeSolid, closeOutlineCircle, closeOutlineRect};
