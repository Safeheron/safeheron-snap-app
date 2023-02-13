// add new svg desc here
import navBack from './nav-back';
import copy from './copy';
import {success} from './result/result';
import {closeOutlineCircle} from './close';
import tip from './tip';
import {checkedSolid} from './check';

const svgs = {
  navBack,
  copy,
  success,
  closeOutlineCircle,
  tip,
  checkedSolid,
};
export default svgs;

export interface IIconDescProps {
  width: number;
  height: number;
  d?: string;
  path?: JSX.Element;
}

type IconMap = Record<keyof typeof svgs, IIconDescProps>;
export type {IconMap};
