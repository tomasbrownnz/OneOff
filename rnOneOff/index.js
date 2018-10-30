import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
YellowBox.ignoreWarnings(['Warning: Failed child context type']);
YellowBox.ignoreWarnings(['Remote debugger is in a background tab which may cause apps to perform slowly.']);
YellowBox.ignoreWarnings(["Warning: Can't call setState"]);
YellowBox.ignoreWarnings(["Warning: Failed prop type:"]);
YellowBox.ignoreWarnings(["VirtualizedList:"]);
YellowBox.ignoreWarnings(["Warning:"]);

AppRegistry.registerComponent('rnOneOff', () => App);
