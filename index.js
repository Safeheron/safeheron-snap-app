/**
 * Do not delete any references unless you
 * clearly know the consequences of this action !!!
 */
import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import {AppRegistry, LogBox} from 'react-native';
import {name as appName} from './app.json';
import * as Sentry from '@sentry/react-native';

// ----------------------------------
//  shims
global.Buffer = global.Buffer || require('buffer').Buffer;

// Fix the problem of error reporting in the process module.
global.process = global.process || {};
global.process.browser = true;

global.TextEncoder = require('text-encoding').TextEncoder;

LogBox.ignoreLogs([
  /^Require cycle/,
  /^\[react-native-gesture-handler] Seems like you're using an old API/,
  /ViewPropTypes will be removed from React Native/,
]);
LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => {
  const App = require('./App').default;
  return Sentry.wrap(App);
});
