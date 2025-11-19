import React, {useEffect, useRef} from 'react';
import {Animated} from 'react-native';
const AnimatedView = ({
  children,
  horizontal,
  duration = 1000,
  delayLevel = 1,
  useNativeDriver = true,
  skipOpacity = false,
  skipTranslate = false,
  translateTo = 0,
  translateFrom = 50,
  opacityTo = 1,
  opacityFrom = 0,
  style,
}) => {
  const translateXorY = useRef(
    new Animated.Value(skipTranslate ? 0 : translateFrom),
  );
  const opacity = useRef(new Animated.Value(skipOpacity ? 1 : opacityFrom));
  useEffect(() => {
    Animated.parallel([
      ...[
        !skipTranslate &&
          Animated.timing(translateXorY.current, {
            toValue: translateTo,
            duration,
            delay: delayLevel * (1000 / 3),
            useNativeDriver,
          }),
      ],
      ...[
        !skipOpacity &&
          Animated.timing(opacity.current, {
            toValue: opacityTo,
            duration,
            delay: 1 * (1000 / 3),
            useNativeDriver,
          }),
      ],
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: opacity.current,
        transform: [
          {
            ...(horizontal && {translateX: translateXorY.current}),
            ...(!horizontal && {translateY: translateXorY.current}),
          },
        ],
        ...style,
      }}>
     {children}
    </Animated.View>
  );
};

export default AnimatedView;
