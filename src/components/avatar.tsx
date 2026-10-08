import {
  Blur,
  Canvas,
  Group,
  Paint,
  RadialGradient,
  Rect,
  Image as SkiaImage,
  Skia,
  Skottie,
  useImage,
  vec,
  type DataSourceParam,
} from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";

import { AVATAR_RADIUS } from "@/constants/header-metrics";
import {
  MASK_FRAMES,
  MASK_SCALE,
  MASK_SIZE,
  type AvatarMotion,
} from "@/hooks/use-avatar-motion";
import type { AvatarMode } from "@/hooks/use-header-layout";

const ISLAND_MASK = Skia.Skottie.Make(
  JSON.stringify(require("../../assets/lottie/avatar-mask-island.json")),
);
// Same, but the line only appears at frame 75, once it's lifted off screen.
const TOP_EDGE_MASK = Skia.Skottie.Make(
  JSON.stringify(require("../../assets/lottie/avatar-mask-top-edge.json")),
);
const MASK_WIDTH = MASK_SIZE * MASK_SCALE;

const PHOTO_MAX_BLUR = 10;
// Bigger than the disc so the blur doesn't fade its edge.
const PHOTO_SIZE = 2 * (AVATAR_RADIUS + PHOTO_MAX_BLUR);
const DISC_CLIP = Skia.RRectXY(
  Skia.XYWHRect(
    -AVATAR_RADIUS,
    -AVATAR_RADIUS,
    2 * AVATAR_RADIUS,
    2 * AVATAR_RADIUS,
  ),
  AVATAR_RADIUS,
  AVATAR_RADIUS,
);

// Darkens where the avatar meets the island.
const VIGNETTE_SIZE = 100;
const VIGNETTE_CENTER = 88;
const VIGNETTE_RADIUS = 90;
const VIGNETTE_CLEAR = 0.87;

type Props = {
  source: DataSourceParam;
  motion: AvatarMotion;
  width: number;
  mode: AvatarMode;
};

export function Avatar({
  source,
  motion: { restY, maskTop, frame, blur, lift, discY, discScale },
  width,
  mode,
}: Props) {
  const image = useImage(source);
  const height = restY + AVATAR_RADIUS;
  const centerX = MASK_WIDTH / 2;

  const maskTransform = useDerivedValue(() => [
    { translateY: maskTop - lift.value },
    { scale: MASK_SCALE },
  ]);
  const liftTransform = useDerivedValue(() => [{ translateY: -lift.value }]);

  const discTransform = useDerivedValue(() => [
    { translateX: centerX },
    { translateY: discY.value },
    { scale: discScale.value },
  ]);

  const cover = useDerivedValue(() => frame.value / MASK_FRAMES);
  const photoBlur = useDerivedValue(
    () => PHOTO_MAX_BLUR * clamp(-0.1 + 1.1 * blur.value),
  );
  const fade = useDerivedValue(() =>
    clamp(-0.25 + (1.55 * frame.value) / MASK_FRAMES),
  );

  const photo = image && (
    <Group transform={discTransform} clip={DISC_CLIP}>
      <Group
        layer={
          <Paint>
            <Blur blur={photoBlur} />
          </Paint>
        }
      >
        <SkiaImage
          image={image}
          x={-PHOTO_SIZE / 2}
          y={-PHOTO_SIZE / 2}
          width={PHOTO_SIZE}
          height={PHOTO_SIZE}
          fit="cover"
        />
      </Group>
    </Group>
  );

  return (
    <Canvas
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: (width - MASK_WIDTH) / 2,
        width: MASK_WIDTH,
        height,
      }}
    >
      {mode === "plain" ? (
        photo
      ) : (
        <Group layer>
          <Group transform={maskTransform}>
            <Skottie
              animation={mode === "island" ? ISLAND_MASK : TOP_EDGE_MASK}
              frame={frame}
            />
          </Group>

          <Group layer={<Paint blendMode="srcIn" />}>
            {/* Makes the drip black. */}
            <Rect
              x={0}
              y={0}
              width={MASK_WIDTH}
              height={height}
              color="black"
              opacity={cover}
            />
            {photo}
            <Rect
              x={0}
              y={0}
              width={MASK_WIDTH}
              height={height}
              color="black"
              opacity={fade}
            />
            <Group transform={liftTransform}>
              <Rect
                x={centerX - VIGNETTE_SIZE / 2}
                y={maskTop}
                width={VIGNETTE_SIZE}
                height={VIGNETTE_SIZE}
              >
                <RadialGradient
                  c={vec(centerX, maskTop + VIGNETTE_CENTER)}
                  r={VIGNETTE_RADIUS}
                  colors={["transparent", "transparent", "black"]}
                  positions={[0, VIGNETTE_CLEAR, 1]}
                />
              </Rect>
            </Group>
          </Group>
        </Group>
      )}
    </Canvas>
  );
}

function clamp(value: number) {
  "worklet";
  return Math.min(Math.max(value, 0), 1);
}
