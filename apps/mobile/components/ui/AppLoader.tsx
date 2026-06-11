import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { palette } from "@/theme";

const DOT_SIZE = 6;
const STAGGER_MS = 160;
const DURATION_MS = 560;

function Dot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: DURATION_MS,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [delay, opacity]);

  return <Animated.View style={[styles.dot, { opacity }]} />;
}

export function AppLoader() {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, { transform: [{ scale }] }]}>
        <View style={styles.logoMark}>
          <MaterialCommunityIcons
            name="chat-outline"
            size={28}
            color={palette.background}
          />
        </View>
        {/* Glow ring */}
        <View style={styles.glowRing} />
      </Animated.View>

      <View style={styles.dots}>
        <Dot delay={0} />
        <Dot delay={STAGGER_MS} />
        <Dot delay={STAGGER_MS * 2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },

  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  glowRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: palette.accent,
    opacity: 0.25,
  },

  dots: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: palette.accent,
  },
});
