/* eslint-disable prettier/prettier */
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../themes/Colors';

export const PersonIcon = ({
  size = 20,
  color = colors.gray,
  margin,
}) => {
  return (
    <Icon
      name="person-outline"
      size={size}
      color={color}
      style={{marginLeft: margin}}
    />
  );
};

export const EyeSeeIcon = ({
  size = 20,
  color = colors.gray,
  margin,
}) => {
  return (
    <Icon
      name="eye-outline"
      size={size}
      color={color}
      style={{marginRight: margin}}
    />
  );
};

export const EyeNoSeeIcon = ({
  size = 20,
  color = colors.gray,
  margin,
}) => {
  return (
    <Icon
      name="eye-off-outline"
      size={size}
      color={color}
      style={{marginRight: margin}}
    />
  );
};

export const LockIcon = ({
  size = 20,
  color = colors.gray,
  margin,
}) => {
  return (
    <Icon
      name="lock-closed-outline"
      size={size}
      color={color}
      style={{marginLeft: margin}}
    />
  );
};


export const CalendarIcon = ({
  size = 20,
  color = colors.gray,
  margin,
}) => {
  return (
    <Icon
      name="calendar"
      size={size}
      color={color}
      style={{marginLeft: margin}}
    />
  );
};
