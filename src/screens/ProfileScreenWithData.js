import {
  compose,
  withHandlers,
  withProps,
} from 'recompact';
import { setDisplayName } from 'recompose';
import {
  withAccountAddress,
  withAccountTransactions,
  withBlurTransitionProps,
  withIsWalletEmpty,
  withRequests,
  withAccountSettings,
} from '../hoc';
import ProfileScreen from './ProfileScreen';
import { deviceUtils } from '../utils';

export default compose(
  setDisplayName('ProfileScreen'),
  withAccountAddress,
  withAccountSettings,
  withAccountTransactions,
  withBlurTransitionProps,
  withIsWalletEmpty,
  withRequests,
  withHandlers({
    onPressBackButton: ({ navigation }) => () => navigation.navigate('WalletScreen'),
    onPressSettings: ({ navigation }) => () => navigation.navigate('SettingsModal'),
  }),
  withProps(({ isWalletEmpty, transactionsCount, navigation }) => {
    const topNav = navigation.dangerouslyGetParent()
    const { width } = deviceUtils.dimensions;
    const drawerOpenProgress = topNav.getParam('drawerOpenProgress');
    const blurTranslateX = drawerOpenProgress ? drawerOpenProgress.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [-width, 0, 0],
    }) : -width;

    const blurDrawerOpacity = drawerOpenProgress ? drawerOpenProgress.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [0, 0, 1],
    }) : 0;

    return ({
      blurTranslateX,
      blurDrawerOpacity,
      isEmpty: isWalletEmpty && !transactionsCount,
    });
  }),
)(ProfileScreen);
