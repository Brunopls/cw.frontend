import React from "react";
import "antd/dist/antd.css";
import { Layout, message } from "antd";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Nav from "./components/NavBarComponent/NavBar";
import Register from "./containers/RegisterComponent/Register";
import Login from "./containers/LoginComponent/Login";
import Home from "./containers/HomeComponent/Home";
import Property from "./containers/PropertyComponent/Property";
import PropertyCreate from "./containers/PropertyCreateComponent/PropertyCreate";
import PropertyUpdate from "./containers/PropertyUpdateComponent/PropertyUpdate";
import MyProperties from "./containers/MyPropertiesComponent/MyProperties";
import Messages from "./containers/MessagesComponent/Messages";

import UserContext from "./core/contexts/user";

import StyledSpin from "./components/StyledSpinComponent/StyledSpin";

const { Header, Footer, Content } = Layout;

const contentStyles = {
  padding: 35,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { loggedIn: false },
      doneLoading: false,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const authenticatedUser = JSON.parse(
      localStorage.getItem("authenticatedUser")
    );
    let userObject;
    if (authenticatedUser) userObject = authenticatedUser;
    else userObject = { loggedIn: false };
    this.setState({ user: userObject, doneLoading: true });
  }

  login(user) {
    const userObject = user;
    userObject.loggedIn = true;
    localStorage.setItem("authenticatedUser", JSON.stringify(userObject));
    this.setState({ user: userObject });
  }

  logout() {
    this.setState({ user: { loggedIn: false } });
    localStorage.removeItem("authenticatedUser");
    message.warning("Successfully logged out!");
  }

  render() {
    const { user } = this.state;
    const context = {
      user,
      login: this.login,
      logout: this.logout,
    };

    const { doneLoading } = this.state;

    if (doneLoading)
      return (
        <Layout>
          <UserContext.Provider value={context}>
            <Router>
              <Header>
                <Nav />
              </Header>

              <Content style={contentStyles}>
                <Switch>
                  <Route path="/register" render={() => <Register />} />
                  <Route
                    path="/login"
                    render={({ location }) => <Login location={location} />}
                  />
                  <Route
                    path="/property/view/:id"
                    render={(props) => {
                      const { match } = props;
                      return <Property match={match} />;
                    }}
                  />
                  <Route
                    path="/property/create"
                    render={(props) => {
                      if (user.loggedIn) return <PropertyCreate user={user} />;
                      return (
                        <Redirect
                          location={props.location}
                          to={{
                            pathname: "/login",
                            state: { unauthorisedAccess: true },
                          }}
                        />
                      );
                    }}
                  />
                  <Route
                    path="/properties/own"
                    render={(props) => {
                      if (user.loggedIn) return <MyProperties user={user} />;
                      return (
                        <Redirect
                          location={props.location}
                          to={{
                            pathname: "/login",
                            state: { unauthorisedAccess: true },
                          }}
                        />
                      );
                    }}
                  />
                  <Route
                    path="/properties/edit/:id"
                    render={(props) => {
                      if (user.loggedIn) {
                        const { match } = props;
                        return <PropertyUpdate match={match} user={user} />;
                      }
                      return (
                        <Redirect
                          location={props.location}
                          to={{
                            pathname: "/login",
                            state: { unauthorisedAccess: true },
                          }}
                        />
                      );
                    }}
                  />
                  <Route
                    path="/messages/"
                    render={(props) => {
                      if (user.loggedIn) return <Messages user={user} />;
                      return (
                        <Redirect
                          location={props.location}
                          to={{
                            pathname: "/login",
                            state: { unauthorisedAccess: true },
                          }}
                        />
                      );
                    }}
                  />
                  <Route
                    path="/"
                    render={() => <Home ownProperties={false} />}
                  />
                </Switch>
              </Content>

              <Footer style={{ textAlign: "center" }}>
                Created for 304CEM
              </Footer>
            </Router>
          </UserContext.Provider>
        </Layout>
      );

    return <StyledSpin />;
  }
}

export default App;
