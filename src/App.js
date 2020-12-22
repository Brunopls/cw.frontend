import React from "react";
import logo from "./logo.svg";
import "antd/dist/antd.css";
import { Layout } from "antd";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "./components/NavBarComponent/NavBar";
import Register from "./containers/RegisterComponent/Register";

import UserContext from "./core/contexts/user";
const { Header, Footer, Sider, Content } = Layout;

const contentStyles = {
  paddingTop: 15,
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
              <NavBar />
            </Header>

            <Content style={contentStyles}>
              <Switch>
                <Route path="/register" children={<Register />} />
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
