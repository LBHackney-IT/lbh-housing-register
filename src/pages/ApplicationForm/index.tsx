import { Route, Switch, useRouteMatch } from "react-router-dom"

const ApplicationForm = (): JSX.Element => {
  let match = useRouteMatch();

  return (
    <p>Todo</p>
  );
}

export default ApplicationForm