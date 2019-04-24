import React from 'react';
import PropTypes from 'prop-types';
import {
  TextInput, KeyboardAvoidingView, Keyboard, View,
} from 'react-native';
import {
  compose,
  withHandlers,
  withProps,
  withState,
} from 'recompact';
import styled from 'styled-components/primitives/dist/styled-components-primitives.esm';
import { withAccountAssets } from '@rainbow-me/rainbow-common';
import {
  Centered, Column, FlexItem, Row, RowWithMargins,
} from '../components/layout';
import { ModalHeader } from '../components/modal';
import withBlockedHorizontalSwipe from '../hoc/withBlockedHorizontalSwipe';
import { colors, padding, shadow } from '../styles';
import { Icon } from '../components/icons';
import FloatingPanels from '../components/expanded-state/FloatingPanels';
import FloatingPanel from '../components/expanded-state/FloatingPanel';
import CoinRow, { CoinRowPaddingVertical } from '../components/coin-row/CoinRow';
import CoinName from '../components/coin-row/CoinName';
import Button from '../components/buttons/Button';
import { Text } from '../components/text';
import GestureBlocker from '../components/GestureBlocker';
import BottomRowText from '../components/coin-row/BottomRowText';
import { ButtonPressAnimation } from '../components/animations';

const Container = styled(Centered).attrs({ direction: 'column' })`
  background-color: transparent;
  height: 100%;
`;

const DollarRow = styled(Row)`
  ${padding(CoinRowPaddingVertical, 19, CoinRowPaddingVertical, 15)}
  background-color: ${colors.white};
  width: 100%;
  align-content: center;
  width: 100%;
  justify-content: space-between;
`;

const ConfirmExchangeButton = styled(Button)`
  ${shadow.build(0, 6, 10, colors.purple, 0.14)}
  width:  100%;
  height: 64;
  padding-horizontal: 5;
  align-self: center
`;


const FeeHolder = styled(View)`
  ${shadow.build(0, 6, 10, colors.dark, 0.14)}
  align-self: center;
  border-radius: 16;
  height: 32;
  ${padding(4, 10)}
  margin-top: 32;
  border-width: 1;
  border-color: ${colors.alpha(colors.white, 0.45)};
`;

const ActionContainer = styled(RowWithMargins).attrs({
  align: 'center',
  margin: 6,
})`
  background-color: ${colors.white};
`;

const MaxAction = ({ onPress }) => (
  <ButtonPressAnimation onPress={onPress}>
    <Text
      color="appleBlue"
      size="lmedium"
      weight="semibold"
    >
      💰Max
    </Text>
  </ButtonPressAnimation>
);

MaxAction.propTypes = {
  onPress: PropTypes.func,
}

const TopRow = ({
  navigateToCurrencySelection, amount, changeAmount, symbol,
}) => (
  <Row align="center" justify="space-between">
    <FlexItem flex={1}>
      <CoinName
        component={symbol ? TextInput : Text}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={changeAmount}
      >
        {symbol ? null : '–'}
      </CoinName>
    </FlexItem>
    <FlexItem flex={0}>
      <Button
        onPress={navigateToCurrencySelection}
        padding={0}
        backgroundColor={symbol ? colors.dark : colors.appleBlue}
      >
        <Text
          color="white"
          weight="semibold"
        >
          {symbol || 'Choose a Coin'}
        </Text>
        <Icon
          marginLeft={4}
          size={8}
          color="white"
          direction="right"
          name="caret"
        />
      </Button>
    </FlexItem>
  </Row>
);

TopRow.propTypes = {
  amount: PropTypes.number,
  changeAmount: PropTypes.func,
  navigateToCurrencySelection: PropTypes.func,
  symbol: PropTypes.func,
};


const SettingsModal = ({
  amountToExchange,
  onPressConfirmExchange,
  onPressSelectCurrency,
  onPressSelectTargetCurrency,
  selectedCurrency,
  selectedTargetCurrency,
  setAmountToExchange,
}) => {
  return (
    <KeyboardAvoidingView behavior="padding">
      <Container paddingHorizontal={4}>
        <FloatingPanels>
          <GestureBlocker type='top'/>
          <FloatingPanel>
            <Column align="center">
              <Icon
                color={colors.sendScreen.grey}
                name="handle"
                style={{ height: 11, marginTop: 13 }}
              />
              <ModalHeader
                showDoneButton={false}
                title="Swap"
              />
              <CoinRow
                amount={amountToExchange}
                changeAmount={setAmountToExchange}
                navigateToCurrencySelection={onPressSelectCurrency}
                bottomRowRender={() => null}
                topRowRender={TopRow}
                symbol={selectedCurrency}
              />
              <DollarRow>
                <BottomRowText>$0.00</BottomRowText>
                <MaxAction/>
              </DollarRow>
              <CoinRow
                amount={amountToExchange}
                changeAmount={setAmountToExchange}
                navigateToCurrencySelection={onPressSelectTargetCurrency}
                bottomRowRender={() => null}
                topRowRender={TopRow}
                symbol={selectedTargetCurrency}
              />
            </Column>
          </FloatingPanel>
          <GestureBlocker type='bottom'/>
          {selectedTargetCurrency
          && <React.Fragment>
            <ConfirmExchangeButton
              disabled={!Number(amountToExchange)}
              backgroundColor={Number(amountToExchange) ? colors.appleBlue : colors.blueGreyLighter}
              onPress={onPressConfirmExchange}
            >
              {Number(amountToExchange) ? <React.Fragment>
                <Icon
                  height={32}
                  width={32}
                  style={{ position: 'absolute', left: 16 }}
                  color="white"
                  name='faceid'
                />
                <Text
                  color="white"
                  weight="semibold"
                  size='h5'
                >
                  Hold to swap
                </Text>
              </React.Fragment> : 'Enter an amount' }
            </ConfirmExchangeButton>
            {!!Number(amountToExchange) && <FeeHolder>
              <Text
                color={colors.alpha(colors.white, 0.45)}
                lineHeight="loose"
                size="smedium"
              >
                👾 Fee: $0.06
              </Text>
            </FeeHolder>}
          </React.Fragment>
          }
        </FloatingPanels>
      </Container>
    </KeyboardAvoidingView>
  );
};


SettingsModal.propTypes = {
  amountToExchange: PropTypes.number,
  onPressConfirmExchange: PropTypes.func,
  onPressSelectCurrency: PropTypes.func,
  onPressSelectTargetCurrency: PropTypes.func,
  selectedCurrency: PropTypes.number,
  selectedTargetCurrency: PropTypes.number,
  setAmountToExchange: PropTypes.func,
  setSelectedCurrency: PropTypes.func,
  setSelectedTargetCurrency: PropTypes.func,
};

const withMockedPrices = withProps({
  currencyToDollar: 3,
  targetCurrencyToDollar: 2,
});

export default compose(
  withAccountAssets,
  withState('amountToExchange', 'setAmountToExchange', '0'),
  withState('selectedCurrency', 'setSelectedCurrency', null),
  withState('selectedTargetCurrency', 'setSelectedTargetCurrency', null),
  withProps(({
    selectedCurrency,
    allAssets: [{ symbol }],
  }) => ({ selectedCurrency: selectedCurrency || symbol })),
  withHandlers({
    onPressConfirmExchange:
      ({ navigation }) => () => {
        Keyboard.dismiss();
        navigation.navigate('WalletScreen');
      },
    onPressSelectCurrency: ({ navigation, setSelectedCurrency }) => () => {
      Keyboard.dismiss();
      navigation.navigate('CurrencySelectScreen', { setSelectedCurrency });
    },
    onPressSelectTargetCurrency:
      ({ navigation, setSelectedTargetCurrency }) => () => {
        Keyboard.dismiss();
        navigation.navigate('CurrencySelectScreen', { setSelectedCurrency: setSelectedTargetCurrency });
      },
  }),
  withBlockedHorizontalSwipe,
  withMockedPrices,
)(SettingsModal);