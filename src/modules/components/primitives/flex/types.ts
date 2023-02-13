import {ViewProps, ViewStyle} from 'react-native';
import {ISpaceStyleProps} from '@/modules/components/hooks/use-space-props/types';

export interface IFlexProps extends ViewProps, ISpaceStyleProps {
  direction?: Pick<ViewStyle, 'flexDirection'>['flexDirection'];
  wrap?: boolean | Pick<ViewStyle, 'flexWrap'>['flexWrap'];
  align?: Pick<ViewStyle, 'alignItems'>['alignItems'];
  justify?: Pick<ViewStyle, 'justifyContent'>['justifyContent'];
  basis?: Pick<ViewStyle, 'flexBasis'>['flexBasis'];
  grow?: Pick<ViewStyle, 'flexGrow'>['flexGrow'];
  shrink?: Pick<ViewStyle, 'flexShrink'>['flexShrink'];
  flex?: number;
  row?: boolean;
}
