import React from 'react';
import { StyleSheet, View, Animated, TextInput } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

const DonutChart = ({
  percentage = 0,
  radius = 40,
  strokeWidth = 10,
  duration = 500,
  color = 'tomato',
  delay = 250,
  textColor = 'black',
  max = 100,
  animate = false,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef();
  const inputRef = React.useRef();
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;

  const runAnimation = () => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration,
      delay,
      useNativeDriver: false,
    }).start();
  };

  React.useEffect(() => {
    if (animate) {
      runAnimation();
    }
  }, [animate, percentage]);

  React.useEffect(() => {
    const listenerId = animatedValue.addListener((v) => {
      if (circleRef.current) {
        const maxPerc = (100 * v.value) / max;
        const strokeDashoffset =
          circleCircumference - (circleCircumference * maxPerc) / 100;
        circleRef.current.setNativeProps({ strokeDashoffset });
      }
      if (inputRef.current) {
        inputRef.current.setNativeProps({ text: `${Math.round(v.value)}` });
      }
    });

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [max, circleCircumference]);

  React.useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setNativeProps({
        r: radius,
        strokeWidth,
        strokeDasharray: circleCircumference,
        strokeDashoffset: circleCircumference,
      });
    }
  }, [radius, strokeWidth, circleCircumference]);

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeOpacity={0.2}
          />
          <AnimatedCircle
            ref={circleRef}
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <AnimatedInput
        ref={inputRef}
        underlineColorAndroid="transparent"
        editable={false}
        defaultValue="0"
        style={[
          StyleSheet.absoluteFillObject,
          { fontSize: radius / 2, color: textColor, textAlign: 'center' },
        ]}
      />
    </View>
  );
};

export default DonutChart;
