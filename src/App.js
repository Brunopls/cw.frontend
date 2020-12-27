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
    console.log("User is now being set on the context");
    user.loggedIn = true;
    this.setState({ user: user });
  }

  logout() {
    message.info("Logged out.");
    console.log("Removing user from the app context");
    this.setState({ user: { loggedIn: false } });
  }

  render() {
    const context = {
      user: this.state.user,
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
                <Route
                  path="/register"
                  render={(props) => <Register {...props} />}
                />
                <Route path="/login" render={(props) => <Login {...props} />} />
                <Route
                  path="/property/view/:id"
                  render={(props) => <Property {...props} />}
                />
                <Route
                  path="/property/create"
                  render={
                    context.user.loggedIn
                      ? (props) => (
                          <PropertyCreate user={this.state.user} {...props} />
                        )
                      : (props) => (
                          <Redirect
                            location={props.location}
                            to={{
                              pathname: "/login",
                              state: { unauthorisedAccess: true },
                            }}
                          />
                        )
                  }
                />
                <Route
                  path="/properties/own"
                  render={
                    context.user.loggedIn
                      ? (props) => (
                          <MyProperties user={this.state.user} {...props} />
                        )
                      : (props) => (
                          <Redirect
                            location={props.location}
                            to={{
                              pathname: "/login",
                              state: { unauthorisedAccess: true },
                            }}
                          />
                        )
                  }
                />
                <Route
                  path="/properties/edit/:id"
                  render={
                    context.user.loggedIn
                      ? (props) => (
                          <PropertyUpdate user={this.state.user} {...props} />
                        )
                      : (props) => (
                          <Redirect
                            location={props.location}
                            to={{
                              pathname: "/login",
                              state: { unauthorisedAccess: true },
                            }}
                          />
                        )
                  }
                />
                <Route path="/" render={(props) => <Home />} />
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
