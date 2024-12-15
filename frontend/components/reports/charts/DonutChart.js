import React from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

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
  const [animatedPercentage, setAnimatedPercentage] = React.useState(0);
  const circleCircumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  React.useEffect(() => {
    if (animate) {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration,
        delay,
        useNativeDriver: false, // `false` since we are animating SVG properties
      }).start();
    }
  }, [animate, percentage]);

  React.useEffect(() => {
    const listenerId = animatedValue.addListener((v) => {
      const maxPerc = (100 * v.value) / max;
      setAnimatedPercentage(Math.round(v.value));
    });

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [max]);

  const strokeDashoffset = React.useMemo(() => {
    const maxPerc = (100 * animatedPercentage) / max;
    return circleCircumference - (circleCircumference * maxPerc) / 100;
  }, [animatedPercentage, circleCircumference, max]);

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
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text
          style={{
            fontSize: radius / 3,
            color: textColor,
            textAlign: 'center',
          }}
        >
          {animatedPercentage}
        </Text>
      </View>
    </View>
  );
};

export default DonutChart;
