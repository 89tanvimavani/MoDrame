import * as React from "react"
import Svg, { Defs, G, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function Close(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={36.412}
      height={39.007}
      {...props}
    >
      <Defs></Defs>
      <G
        transform="translate(-.001 -.004)"
        filter="url(#prefix__a)"
        data-name="Layer 2"
      >
        <Path
          data-name="Path 6"
          d="M20.371 17.8l6.591-6.576a1.54 1.54 0 10-2.177-2.177l-6.575 6.591-6.576-6.591a1.539 1.539 0 10-2.176 2.176l6.591 6.577-6.591 6.575a1.54 1.54 0 102.177 2.177l6.575-6.592 6.576 6.591a1.54 1.54 0 102.177-2.177z"
          fill="#fff"
        />
      </G>
    </Svg>
  )
}

export default Close