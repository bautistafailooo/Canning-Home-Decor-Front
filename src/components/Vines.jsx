// Enredaderas que salen de los costados de la pantalla hacia el centro.
// Son solo decoracion (aria-hidden): no reciben datos, no tienen estado
// ni efectos. El movimiento al hacer scroll es CSS puro (index.css).
function Vines() {
  return (
    <>
      <svg
        className="vine vine-left"
        viewBox="0 0 300 240"
        preserveAspectRatio="xMinYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <g className="vine-sway">
          <path className="vine-stem" d="M-6.0 60.0C1.7 62.0 24.8 65.7 40.0 72.0C55.2 78.3 70.0 91.3 85.0 98.0C100.0 104.7 115.0 109.7 130.0 112.0C145.0 114.3 160.8 110.0 175.0 112.0C189.2 114.0 202.5 118.3 215.0 124.0C227.5 129.7 240.5 138.3 250.0 146.0C259.5 153.7 268.3 166.0 272.0 170.0" pathLength="1" />
          <path className="vine-stem" d="M85.0 98.0C88.3 104.2 99.5 123.0 105.0 135.0C110.5 147.0 111.8 159.8 118.0 170.0C124.2 180.2 138.0 191.7 142.0 196.0" pathLength="1" />
          <path className="vine-tendril" d="M272.0 170.0c10 -2 18 6 14 14s-14 4 -12 -4s9 -5 9 1" pathLength="1" />
          <path className="vine-tendril" d="M85.0 98.0c6 -8 2 -16 -4 -14s-4 8 1 7" pathLength="1" />
          <path className="vine-tendril" d="M175.0 112.0c6 8 2 16 -4 14s-4 -8 1 -7" pathLength="1" />
          <g transform="translate(7.8 63.6) rotate(63) scale(0.94)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(28.5 69.0) rotate(-27) scale(1.14)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(53.5 79.8) rotate(71) scale(1.06)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(73.8 91.5) rotate(-21) scale(0.85)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(98.5 102.2) rotate(68) scale(1.15)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(118.8 108.5) rotate(-28) scale(1.06)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(143.5 112.0) rotate(54) scale(0.89)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(163.8 112.0) rotate(-41) scale(1.09)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(187.0 115.6) rotate(60) scale(0.72)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(205.0 121.0) rotate(-44) scale(0.75)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(225.5 130.6) rotate(88) scale(0.77)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(241.2 140.5) rotate(-9) scale(0.65)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(256.6 153.2) rotate(104) scale(0.73)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(266.5 164.0) rotate(-7) scale(0.74)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(91.0 109.1) rotate(121) scale(0.92)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(100.0 125.8) rotate(7) scale(0.85)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(108.9 145.5) rotate(128) scale(0.68)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(114.8 161.2) rotate(27) scale(0.72)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(125.2 177.8) rotate(91) scale(0.65)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(136.0 189.5) rotate(-9) scale(0.74)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
        </g>
      </svg>
      <svg
        className="vine vine-right"
        viewBox="0 0 300 240"
        preserveAspectRatio="xMinYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <g className="vine-sway">
          <path className="vine-stem" d="M-6.0 60.0C1.7 62.0 24.8 65.7 40.0 72.0C55.2 78.3 70.0 91.3 85.0 98.0C100.0 104.7 115.0 109.7 130.0 112.0C145.0 114.3 160.8 110.0 175.0 112.0C189.2 114.0 202.5 118.3 215.0 124.0C227.5 129.7 240.5 138.3 250.0 146.0C259.5 153.7 268.3 166.0 272.0 170.0" pathLength="1" />
          <path className="vine-stem" d="M85.0 98.0C88.3 104.2 99.5 123.0 105.0 135.0C110.5 147.0 111.8 159.8 118.0 170.0C124.2 180.2 138.0 191.7 142.0 196.0" pathLength="1" />
          <path className="vine-tendril" d="M272.0 170.0c10 -2 18 6 14 14s-14 4 -12 -4s9 -5 9 1" pathLength="1" />
          <path className="vine-tendril" d="M85.0 98.0c6 -8 2 -16 -4 -14s-4 8 1 7" pathLength="1" />
          <path className="vine-tendril" d="M175.0 112.0c6 8 2 16 -4 14s-4 -8 1 -7" pathLength="1" />
          <g transform="translate(7.8 63.6) rotate(59) scale(1.22)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(28.5 69.0) rotate(-37) scale(0.97)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(53.5 79.8) rotate(90) scale(1.07)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(73.8 91.5) rotate(-16) scale(0.82)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(98.5 102.2) rotate(72) scale(0.80)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(118.8 108.5) rotate(-29) scale(0.88)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(143.5 112.0) rotate(65) scale(1.04)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(163.8 112.0) rotate(-55) scale(0.74)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(187.0 115.6) rotate(69) scale(0.72)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(205.0 121.0) rotate(-33) scale(0.74)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(225.5 130.6) rotate(75) scale(0.98)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(241.2 140.5) rotate(-22) scale(0.76)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(256.6 153.2) rotate(92) scale(0.59)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(266.5 164.0) rotate(2) scale(0.85)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(91.0 109.1) rotate(126) scale(0.99)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(100.0 125.8) rotate(3) scale(0.87)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(108.9 145.5) rotate(113) scale(0.74)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(114.8 161.2) rotate(25) scale(0.90)"><path className="vine-leaf vine-leaf-open" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(125.2 177.8) rotate(98) scale(0.62)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
          <g transform="translate(136.0 189.5) rotate(-2) scale(0.81)"><path className="vine-leaf" d="M0 0C4 -7 13 -8 20 0C13 8 4 7 0 0Z" /></g>
        </g>
      </svg>
    </>
  )
}

export default Vines