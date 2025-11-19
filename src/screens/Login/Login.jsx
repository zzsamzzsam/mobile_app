import { Box } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import LoginForm from '../../components/LoginForm';
import colors from '../../themes/Colors';

const Login = () => {
  return (
    <Box style={styles.container}>
      <LoginForm />
    </Box>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
