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

const { Header, Footer, Content } = Layout;

const contentStyles = {
  padding: 35,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { loggedIn: false },
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(user) {
    const userObject = user;
    userObject.loggedIn = true;
    this.setState({ user: userObject });
  }

  logout() {
    message.info("Logged out.");
    this.setState({ user: { loggedIn: false } });
  }

  render() {
    const { user } = this.state;
    const context = {
      user,
      login: this.login,
      logout: this.logout,
    };

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
                <Route path="/login" render={() => <Login />} />
                <Route path="/property/view/:id" render={() => <Property />} />
                <Route
                  path="/property/create"
                  render={() =>
                    user.loggedIn ? (
                      <PropertyCreate user={user} />
                    ) : (
                      (props) => (
                        <Redirect
                          location={props.location}
                          to={{
                            pathname: "/login",
                            state: { unauthorisedAccess: true },
                          }}
                        />
                      )
                    )
                  }
                />
                <Route
                  path="/properties/own"
                  render={() =>
                    user.loggedIn ? (
                      <MyProperties user={user} />
                    ) : (
                      (props) => (
                        <Redirect
                          location={props.location}
                          to={{
                            pathname: "/login",
                            state: { unauthorisedAccess: true },
                          }}
                        />
                      )
                    )
                  }
                />
                <Route
                  path="/properties/edit/:id"
                  render={() =>
                    user.loggedIn ? (
                      <PropertyUpdate user={user} />
                    ) : (
                      (props) => (
                        <Redirect
                          location={props.location}
                          to={{
                            pathname: "/login",
                            state: { unauthorisedAccess: true },
                          }}
                        />
                      )
                    )
                  }
                />
                <Route
                  path="/messages/"
                  render={() =>
                    user.loggedIn ? (
                      <Messages user={user} />
                    ) : (
                      (props) => (
                        <Redirect
                          location={props.location}
                          to={{
                            pathname: "/login",
                            state: { unauthorisedAccess: true },
                          }}
                        />
                      )
                    )
                  }
                />
                <Route path="/" render={() => <Home ownProperties={false} />} />
              </Switch>
            </Content>

            <Footer style={{ textAlign: "center" }}>Created for 304CEM</Footer>
          </Router>
        </UserContext.Provider>
      </Layout>
    );
  }
}

export default App;
