import {ISpaceStyleProps} from '@/modules/components/hooks/use-space-props/types';

export interface IDividerProps extends ISpaceStyleProps {
  w?: number;
  h?: number;
  bgColor?: string;
  opacity?: number;
  col?: boolean;
}
