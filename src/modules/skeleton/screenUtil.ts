import {Screen} from '@/modules/skeleton/SkeletonScreen';
import {merge} from 'lodash';

const defaultOptions = {
  headerTitleAlign: 'center',
};

export const getScreenOptions = (screen: Screen) => {
  let options = merge({}, defaultOptions, screen.component.options ?? {});

  if (screen.component.title) {
    if (typeof screen.component.title === 'string') {
      options.title = screen.component.title;
    } else {
      options.title = screen.component.title();
    }
  }

  return options;
};
