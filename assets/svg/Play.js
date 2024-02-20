import * as React from "react"
import Svg, { Defs, G, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function Play(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={68.51}
      height={68.51}
      {...props}
    >
      <Defs></Defs>
      <G filter="url(#prefix__a)">
        <Path
          data-name="Path 7"
          d="M52.113 13.4A25.255 25.255 0 0016.4 49.113 25.255 25.255 0 0052.113 13.4zM34.255 53.385a22.131 22.131 0 1122.13-22.13 22.156 22.156 0 01-22.13 22.13z"
          fill="#fff"
        />
      </G>
      <G filter="url(#prefix__b)">
        <Path
          data-name="Path 8"
          d="M27.852 41.05l16.963-9.8-16.963-9.8z"
          fill="#fff"
        />
      </G>
    </Svg>
  )
}

export default Play