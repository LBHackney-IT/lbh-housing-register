import HousingRegisterApp from "./HousingRegisterApp"
import React from "react"
import ReactDOM from "react-dom"

import "./index.scss"

ReactDOM.render(
  <React.StrictMode>
    <HousingRegisterApp />
  </React.StrictMode>,
  document.getElementById("housing-register")
)

document.body.classList.add('js-enabled')