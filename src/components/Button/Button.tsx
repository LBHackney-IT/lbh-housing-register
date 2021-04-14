import { Link } from "react-router-dom"
import "./Button.scss"

interface ButtonProps {
  children: string
  to: string
}

const Button = ({ children, to }: ButtonProps): JSX.Element => (
  <Link to={to}>
    <button className="govuk-button lbh-button">
      {children}
    </button>
  </Link>
)

export default Button