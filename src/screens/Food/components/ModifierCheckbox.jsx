import { Checkbox, Divider, Radio, View } from "native-base";
import React, { useEffect, useMemo, useState } from "react";
// import {View} from 'react-native'
import AppText from "../../../components/common/Text";
import ViewX from "../../../components/common/ViewX";
import colors from "../../../themes/Colors";
import { cloverPriceFormat } from "../../../utils/utils";

const ModifierCheckbox = ({
  multiple = false,
  options = [],
  onChange,
  maxAllowed,
  minRequired,
}) => {
  const sortedOptions = useMemo(() => {
    return options.sort((a, b) => a.sortOrder - b.sortOrder);
  }, [options]);
  const [value, setValue] = useState(
    (minRequired && sortedOptions?.[0]) ? [sortedOptions[0].id] : [],
  );
  const useRadio = minRequired == 1 && maxAllowed == 1;
  useEffect(() => {
    if (minRequired && sortedOptions?.length) {
      onChange([sortedOptions[0].id])
    }
  }, []);
  return (
    <View style={{flex: 1}}>
      {!useRadio && <Checkbox.Group
        defaultValue={value}
        onChange={values => {
          console.log('checking==========', values);
          if (minRequired && !values.length) {
            return;
          }
          console.log('max=====', maxAllowed, values.length);
          if (maxAllowed < values.length) {
            return;
          }
          setValue(values || []);
          onChange(values || []);
        }}>
        {sortedOptions.map(item => {
          const isDisabled = maxAllowed <= value.length && !value.includes(item.id);
          return (
            <Checkbox size="sm" my="1" value={item.id} isDisabled={isDisabled}>
              <View
                justifyContent="space-between"
                flexDir="row"
                flexGrow={1}
                width="90%">
                <AppText color={isDisabled ? colors.gray : null}>
                  {item.name}
                </AppText>
                {!!item.price && (
                  <AppText color={isDisabled ? colors.gray : null}>
                    +{cloverPriceFormat(item.price)}
                  </AppText>
                )}
              </View>
            </Checkbox>
          );
        })}
      </Checkbox.Group>}
      {useRadio > 0 && (
        <Radio.Group
          name="myRadioGroup"
          defaultValue={!!minRequired && sortedOptions?.[0]?.id}
          accessibilityLabel="favorite number"
          onChange={nextValue => {
            onChange([nextValue]);
          }}>
          {sortedOptions.map(item => (
            <>
              <Radio size="sm" my="1" value={item.id}>
                <View
                  justifyContent="space-between"
                  flexDir="row"
                  flexGrow={1}
                  width="90%">
                  <AppText>{item.name}</AppText>
                  {!!item.price && (
                    <AppText>+{cloverPriceFormat(item.price)}</AppText>
                  )}
                </View>
              </Radio>
              <Divider style={{marginVertical: 1}} />
            </>
          ))}
        </Radio.Group>
      )}
    </View>
  );
};

export default ModifierCheckbox;