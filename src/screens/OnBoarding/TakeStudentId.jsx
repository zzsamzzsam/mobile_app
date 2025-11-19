/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Routes from '../../navigation/Routes';
import { InputX } from '../../components/common/InputX';
import ButtonX from '../../components/common/BottonX';
import metrics from '../../themes/Metrics';
import AppText from '../../components/common/Text';
import ContainerBox from '../../components/common/CenterX';
import KeywordAvoidingViewX from '../../components/common/KeywordAvoidingViewX';
import colors from '../../themes/Colors';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BARCODES, GET_ME_USER } from '../../Apollo/Queries';
import { LINK_BARCODE, VERIFY_STUDENT } from '../../Apollo/Mutations';

const TakeStudentId = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fromHome } = route?.params || false;

  const [data, setData] = useState({ id1: '', id2: '' });
  const [errors, setErrors] = useState({
    libraryError: '',
    numberError: '',
  });

  const { data: userData } = useQuery(GET_ME_USER);
  const [linkBarcodeMutation, { loading: linking }] = useMutation(LINK_BARCODE);
  const [verifyStudentMutation, { loading }] = useMutation(VERIFY_STUDENT);

  const onLinkStudentOrStaff = async () => {
    const clientId = userData?.meAppUser?.clientId;
    if (!clientId) {
      showMessage({
        message: "Something went wrong",
        type: 'danger',
      })
    }
    let valid = true;
    if (data.id1 === '') {
      valid = false;
      setErrors(e => ({ ...e, libraryError: 'library Id is required' }));
    }
    if (data.id2 === '') {
      valid = false;
      setErrors(e => ({ ...e, numberError: 'Student number is required' }));
    }
    if (fromHome) {
      try {
        await linkBarcodeMutation({
          variables: {
            type: 'Student',
            id1: `${data.id1}`,
            id2: `${data.id2}`,
          },
          refetchQueries: [{ query: GET_BARCODES }],
        });
        showMessage({
          message: "Link Success",
          description: 'Linked Successfully',
          type: 'success',
          icon: 'success',
        });
        if (fromHome) {
          navigation.goBack();
        } else {
          navigation.navigate(Routes.MLINKCOMPSCREEN);
        }
      } catch (err) {
        console.log("Error in linking membership", err)
        showMessage({
          message: "Link Error",
          description: err?.message || "Unable to link membership",
          type: 'danger',
          icon: 'danger',
        });
      }
    } else {
      try {
        if (valid) {
          const isValidStudent = await verifyStudentMutation({
            variables: {
              clientId,
              type: 'Student',
              id1: `${data.id1}`,
              id2: `${data.id2}`,
            },
          });
          if (isValidStudent) {
            if (!fromHome) {
              navigation.navigate(Routes.LINKSTUDENTCARD, { data: { id1: data?.id1, id2: data?.id2 } });
            }
          } else {
            throw new Error("Unable to verify student")
          }
        }
      } catch (err) {
        showMessage({
          message: "Link Error",
          description: err?.message || "Unable to verify student",
          type: 'danger',
          icon: 'danger',
        });

      }
    }
  }


  return (
    <KeywordAvoidingViewX>
      <ContainerBox>
        <AppText
          text={`Please ${fromHome ? 'Enter' : "verify"}  your Library ID and your Student Number.`}
          style={styles.heading}
        />
        <InputX
          containerStyle={{ marginTop: metrics.s20 + metrics.s20 }}
          onChangeText={(value) => setData({ ...data, id1: value })}
          placeholderTextColor={colors.black}
          placeholder="Library ID"
          onFocus={() => setErrors({ ...errors, libraryError: '' })}
          error={errors.libraryError}
        />
        <InputX
          containerStyle={{ marginTop: metrics.s20 }}
          onChangeText={value => setData({ ...data, id2: value })}
          placeholder="Student Number"
          placeholderTextColor={colors.black}
          onFocus={() => setErrors({ ...errors, numberError: '' })}
          error={errors.numberError}
        />
        <ButtonX
          title={fromHome ? "Save" : "Verify"}
          isLoading={loading || linking}
          isLoadingText={fromHome ? "Saving" : 'Verifying'}
          onPress={onLinkStudentOrStaff}
          style={{ width: '100%', marginTop: metrics.s20 + metrics.s20 }}
        />
      </ContainerBox>
    </KeywordAvoidingViewX>
  );
};

export default TakeStudentId;

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: metrics.s20,
  },
});
