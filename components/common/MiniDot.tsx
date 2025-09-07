export const MiniDot = ({
  size = 8,
  color,
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <div
      className={`rounded-full animate-pulse bg-green-400`}
      style={
        color
          ? {
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
            }
          : {
              width: `${size}px`,
              height: `${size}px`,
            }
      }
    />
  );
};
