import styled from 'styled-components'

function Loading () {
  return (
    <Wrapper>
      <div class='gradient-loader' />
    </Wrapper>
  )
}

const Wrapper = styled.div`

  --gr-bg: color-mix(in srgb, var(--bg-1), black 5%);
  --gr-bar: rgba(0, 0, 0, 0.02);
  .gradient-loader {
  width: 100%; /* Or a specific width like 300px */
  height: 180px; /* Adjust the height as needed */
  background-color: var(--gr-bg); /* A base dark grey color */
  border-radius: 8px; /* For rounded corners */
  position: relative;
  overflow: hidden; /* This is key to contain the animation */
}

.gradient-loader::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 90%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 5%,
    var(--gr-bar),
    var(--gr-bar),
    var(--gr-bar),
    transparent 95%
  );
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`

export default Loading
