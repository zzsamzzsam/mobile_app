/* eslint-disable prettier/prettier */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Box, FormControl } from 'native-base';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useMutation, useQuery } from '@apollo/client';
import { showMessage } from 'react-native-flash-message';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import Fonts from '../../themes/Fonts';
import { CREATE_ORDER } from '../../Apollo/Mutations';
import { InputX } from '../../components/common/InputX';
import ButtonX from '../../components/common/BottonX';
import AntIcon from 'react-native-vector-icons/AntDesign';
import OrderSummaryModal from './components/OrderSummaryModal';
import LoadingModal from '../../components/common/LoadingModal';
import { GET_MY_ORDERS } from '../../Apollo/Queries';
import { checkCreditCardType } from '../../utils';
import { HeaderTextTitle } from '../../components/common/Header/TopLogo';
import { GET_SAVED_CARDS } from '../../Apollo/Queries/CloverQueries';
import { Chip, Divider } from 'react-native-paper';
import SurfaceBox from '../../components/common/SurfaceBox';
import CheckBoxA from '../../components/common/CheckBoxA';


const CheckoutScreen = ({ navigation }) => {
    const { actualUser, currentRestaurant, orderCart } = useStoreState(st => ({
        actualUser: st.login.actualUser,
        currentRestaurant: st.cart.currentRestaurant,
        orderCart: st.cart.orderCart,
    }));
    const [saveCard, setSaveCard] = useState(null);
    const [savedCardId, setSavedCardId] = useState(null);
    const { clearCart } = useStoreActions(at => ({
        clearCart: at.cart.clearCart,
    }));
    const {data: savedCards} = useQuery(GET_SAVED_CARDS, {
      variables: {
        code: currentRestaurant?.code,
      },
    });
    console.log('saved cards', savedCards);
    const [createOrderMutation, { loading, error }] = useMutation(CREATE_ORDER);
    const [cardBrand, setCardBrand] = useState('');
    const [orderCreating, setOrderCreating] = useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <HeaderTextTitle text='Checkout' />,
            headerTitleAlign: 'center',
            headerRight: null,
            headerRightContainerStyle: { marginRight: 20 },
        })
    }, [navigation]);

    const lastNameRef = useRef(null);
    const phoneNumberRef = useRef(null);
    const emailRef = useRef(null);
    const cardNumberRef = useRef(null);
    const expiryRef = useRef(null);
    const cvvRef = useRef(null);
    const zipRef = useRef(null);

    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        zip: '',
        brand: 'VISA',
    });
    const [errors, setErrors] = React.useState({
        firstNameError: '',
        lastNameError: '',
        phoneNumberError: '',
        emailError: '',
        cardNumberError: '',
        expiryError: '',
        cvvError: '',
        zipError: '',
    });
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setFormData({
            firstName: actualUser?.firstName,
            lastName: actualUser?.lastName,
            phoneNumber: actualUser?.phoneHome,
            email: actualUser?.email[0],
        });
    }, [actualUser]);

    const formatExpiry = text => {
        if (text.length <= 5) {
            const formattedExpiry = text
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d{0,2})/, '$1/$2')
                .substring(0, 5);
            // check card Type
            setFormData({ ...formData, expiry: formattedExpiry });
        }
    };
    const formatCardNumber = text => {
        setCardBrand(checkCreditCardType(text));
        if (text.length <= 19) {
            const formattedCardNumber = text
                .replace(/\D/g, '')
                .replace(/(\d{4})(\d{0,4})(\d{0,4})(\d{0,4}).*/, '$1 $2 $3 $4')
                .trim();
            setFormData({ ...formData, cardNumber: formattedCardNumber });
        }
    };
    const handleCheckout = async () => {
        setOrderCreating(true);
        if (!savedCardId && !formData?.cardNumber && !formData?.expiry && !formData?.cvv && cardBrand !== 'Unknown') {
            setOrderCreating(false);
            return showMessage({
                message: 'Error',
                description: "Please provide valid card details",
                icon: 'danger',
                type: 'danger',
            });
        }
        console.log('cart= ====', JSON.stringify(orderCart));
        // setOrderCreating(false);
        // return;
        try {
            const { data } = await createOrderMutation({
                variables: {
                    input: {
                        savedCardId: savedCardId || null,
                        saveCard: !!saveCard,
                        code: currentRestaurant?.code,
                        orderCart,
                        cardDetails: { ...formData, brand: cardBrand } 
                    },
                },
                refetchQueries: [{ query: GET_MY_ORDERS }]
            });
            console.log('turi is', JSON.stringify(data));
            if (!!data && data?.createOrder?.success) {
                setOrderCreating(false);
                showMessage({
                    message: 'Success',
                    description: data?.createOrder?.message,
                    icon: 'success',
                    type: 'success',
                });
                clearCart();
                navigation.goBack();
            } else {
                setOrderCreating(false);
                showMessage({
                    message: 'Error',
                    description: data?.createOrder?.message.split(":")[1],
                    icon: 'danger',
                    type: 'danger',
                });
            }
        } catch (err) {
            console.log("Error", err.toString().split["Error:"]);
            setOrderCreating(false);
            showMessage({
                message: 'Error',
                description: 'Unable to place order',
                icon: 'danger',
                type: 'danger',
            });
        }
    };
    return (
      <KeyboardAvoidingView
        style={{flex: 1, paddingHorizontal: 20, backgroundColor: colors.white}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets>
          {orderCreating && <LoadingModal title="Placing Order..." />}
          <FormControl isRequired>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                backgroundColor: colors.secondary,
                marginVertical: 10,
              }}>
              <Text style={[styles.subTitle, {color: colors.white}]}>
                Your Order
              </Text>
              <AntIcon
                style={{marginLeft: 5}}
                color={colors.white}
                name="eye"
                size={24}
              />
            </Pressable>
            <Text style={styles.subTitle}>Contact Info:</Text>
            <InputX
              label="First Name"
              value={formData.firstName}
              type="text"
              onFocus={() => setErrors({...errors, firstNameError: ''})}
              onChangeText={value =>
                setFormData({...formData, firstName: value})
              }
              onSubmitEditing={() => lastNameRef.current.focus()}
              error={errors.firstNameError}
            />
            <InputX
              label="Last Name"
              value={formData.lastName}
              ref={lastNameRef}
              type="text"
              onSubmitEditing={() => phoneNumberRef.current.focus()}
              onFocus={() => setErrors({...errors, lastNameError: ''})}
              onChangeText={value =>
                setFormData({...formData, lastName: value})
              }
              error={errors.lastNameError}
            />
            <InputX
              label="Phone Number"
              ref={phoneNumberRef}
              value={formData.phoneNumber}
              type="text"
              onFocus={() => setErrors({...errors, phoneNumberError: ''})}
              onSubmitEditing={() => emailRef.current.focus()}
              onChangeText={value =>
                setFormData({...formData, phoneNumber: value})
              }
              error={errors.phoneNumberError}
            />
            <InputX
              label="Email"
              ref={emailRef}
              value={formData.email}
              type="text"
              onFocus={() => setErrors({...errors, emailError: ''})}
              onChangeText={value => setFormData({...formData, email: value})}
              onSubmitEditing={() => cardNumberRef.current.focus()}
              error={errors.emailError}
            />
            <Text
              style={[styles.subTitle, {marginVertical: 10, marginBottom: 10}]}>
              Credit Card Info:
            </Text>
            {savedCards?.getSavedCards && (
              <Box>
                <Text
                  style={[
                    styles.usedCardTitle,
                    {marginVertical: 10, marginBottom: 10},
                  ]}>
                  Use Saved Cards
                </Text>
                <Box style={{flexDirection: 'column'}}>
                  {savedCards.getSavedCards.map(s => (
                    <Chip
                      mode={s._id === savedCardId ? 'flat' : 'outlined'}
                      //   icon="card"
                      selected={s._id === savedCardId}
                      //   showSelectedOverlay
                      selectedColor={s._id === savedCardId ? 'green' : 'black'}
                      showSelectedCheck
                      style={{marginHorizontal: 10}}
                      onPress={() => {
                        if (s._id === savedCardId) {
                          setSavedCardId(null);
                        } else {
                          alert('Saved card is not working right now.');
                          // setSavedCardId(s._id);
                        }
                      }}>
                      {s?.data?.card?.brand} xxxx-xxxx-xxxx-
                      {s?.data?.card?.last4}
                    </Chip>
                  ))}
                </Box>
              </Box>
            )}
            {!savedCardId && (
              <>
                <InputX
                  label="Card No"
                  ref={cardNumberRef}
                  inputMode="numeric"
                  value={formData.cardNumber}
                  onSubmitEditing={() => expiryRef.current.focus()}
                  type="text"
                  onFocus={() => setErrors({...errors, cardNumberError: ''})}
                  onChangeText={value => formatCardNumber(value)}
                  error={errors.cardNumberError}
                />
                <InputX
                  label="Expiry(MM/YY)"
                  ref={expiryRef}
                  value={formData.expiry}
                  type="text"
                  placeholder="MM/YY"
                  inputMode="numeric"
                  onFocus={() => setErrors({...errors, expiryError: ''})}
                  onSubmitEditing={() => cvvRef.current.focus()}
                  onChangeText={value => formatExpiry(value)}
                  error={errors.expiryError}
                />
                <InputX
                  label="CVV"
                  ref={cvvRef}
                  inputMode="numeric"
                  value={formData.cvv}
                  type="text"
                  onFocus={() => setErrors({...errors, cvvError: ''})}
                  onChangeText={value => setFormData({...formData, cvv: value})}
                  onSubmitEditing={() => zipRef.current.focus()}
                  error={errors.cvvError}
                />
                <InputX
                  label="Zip"
                  ref={zipRef}
                  value={formData.value}
                  type="text"
                  onFocus={() => setErrors({...errors, zipError: ''})}
                  onChangeText={value => setFormData({...formData, zip: value})}
                  onSubmitEditing={handleCheckout}
                  error={errors.zipError}
                />
                <Box style={{marginTop: 10}} />
                <CheckBoxA
                  title={"Save Card"}
                //   icon="events"
                  onIconPress={() => {}}
                  value={true}
                  size="md"
                  isChecked={saveCard}
                  onChange={value => setSaveCard(!saveCard)}
                />
              </>
            )}
          </FormControl>
          <ButtonX
            title="Place Order"
            style={styles.btnStyle}
            onPress={handleCheckout}
          />
        </ScrollView>
        <OrderSummaryModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
    },
    item: {
        flexDirection: 'row',
        padding: metrics.s20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    image: {
        height: 200,
        borderRadius: 8,
    },
    detailsContainer: {
        flex: 1,
    },
    foodName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    foodDetails: {
        fontSize: 14,
        color: colors.black,
    },
    modalContent: {
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: Fonts.book,
        color: colors.primary,
        fontWeight: '700',
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: colors.black,
        fontWeight: '700',
        marginBottom: 5,
    },
    usedCardTitle: {
        fontSize: 12,
        // fontFamily: Fonts.book,
        color: colors.gray,
        // fontWeight: '700',
        // marginBottom: 5,
    },
    modalView: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
        position: 'relative'
    },
    cardNumberStyle: {
        fontSize: 14,
        fontFamily: Fonts.book,
        backgroundColor: 'red',
        color: colors.black,
    },
    expiryStyle: {
        fontSize: 14,
        fontFamily: Fonts.book,
        color: colors.black,
    },
    cvvStyle: {
        fontSize: 14,
        fontFamily: Fonts.book,
        color: colors.black,
    },
    btnStyle: {
        paddingLeft: '10%',
        paddingRight: '10%',
        marginVertical: 20,
    },
});

export default CheckoutScreen;
