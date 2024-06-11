import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/auth/loging';
import Register from './components/auth/register';
import Home from './components/home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (authStatus) => {
    setIsAuthenticated(authStatus);
  };


  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login setAuth={setAuth} />
        </Route>
        <Route path="/register" component={Register} />
        <Route path="/home">
          {isAuthenticated ? <Home /> : <Redirect to="/home" />}
        </Route>
      <Redirect to="/home" />
      </Switch>
    </Router>
  );
}

export default App;
