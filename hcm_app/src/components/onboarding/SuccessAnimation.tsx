import { keyframes } from '@emotion/react';
import { Box, Typography, styled } from '@mui/material';

const SuccessAnimation: React.FC<{ color?: string; text?: string }> = ({
  color = '#52c41a',
  text,
}) => {
  return (
    <Container>
      <Circle color={color}>
        <Pop color={color}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="22">
            <path d="M11.637 20.286a2.41 2.41 0 0 1-3.411 0L2.11 14.17a2.42 2.42 0 0 1 0-3.413c.943-.94 2.47-.94 3.41 0l4.412 4.412L22.87 2.23a2.41 2.41 0 1 1 3.411 3.411L11.637 20.286z" />
          </svg>
        </Pop>
      </Circle>
      {text && (
        <Typography
          sx={{
            color: color,
            fontSize: '28px',
            position: 'absolute',
            opacity: 0,
            bottom: 0,
            animation: `${messageIn} 1.4s cubic-bezier(0, 0.7, 0.31, 1) 900ms forwards`,
          }}
        >
          {text}
        </Typography>
      )}
    </Container>
  );
};

const appear = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const rippleOut = keyframes`
  20% { opacity: 0.5; }
  100% { top: -15px; right: -15px; bottom: -15px; left: -15px; opacity: 0; }
`;

const pop = keyframes`
  0% { opacity: 0; transform: scale(0) perspective(1px) translateZ(0); }
  100% { opacity: 1; transform: scale(1); }
`;

const messageIn = keyframes`
  0% { opacity: 0; transform: translate3d(0, 40%, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
`;

const Container = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  paddingBottom: '48px',
  margin: '1.5rem 0 20px 0',
});

const Circle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})(({ color }) => ({
  boxShadow: '0 0 1px rgba(0, 0, 0, 0)',
  border: `3px solid ${color}`,
  borderRadius: '50%',
  display: 'block',
  width: '60px',
  height: '60px',
  position: 'relative',
  opacity: 0,
  animation: `${appear} 300ms cubic-bezier(0.65, 0.05, 0.08, 0.99) 500ms forwards`,
  transform: 'perspective(1px) translateZ(0)',
  '&:before': {
    content: '""',
    position: 'absolute',
    border: `${color} solid 7px`,
    borderRadius: '50%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0,
    animation: `${rippleOut} 1s 700ms forwards`,
  },
}));

const Tick = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})(({ color }) => ({
  position: 'absolute',
  top: '18px',
  left: '16px',
  '& svg': {
    fill: color,
    animation: `${pop} 600ms cubic-bezier(0.65, 0.05, 0.08, 0.99) 500ms forwards`,
  },
}));

const Pop = styled(Tick)({
  opacity: 0,
  display: 'block',
  transformOrigin: '(50%, 50%)',
  transform: 'scale(0) perspective(1px) translateZ(0)',
  transition: 'opacity 200ms ease',
  boxShadow: '0 0 1px rgba(0, 0, 0, 0)',
  animationName: `${pop}`,
  animationDuration: '600ms',
  animationTimingFunction: 'cubic-bezier(0.65, 0.05, 0.08, 0.99)',
  animationIterationCount: 1,
  animationDelay: '0s',
  animationFillMode: 'forwards',
  left: '12px',
});

export default SuccessAnimation;
