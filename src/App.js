import React from 'react';
import logo from './logo.svg';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import NavBar from './components/NavBarComponent/NavBar'
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import UserContext from './core/contexts/user'
const { Header, Footer, Sider, Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {loggedIn: false}
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    
  }

  login(user) {
    console.log("User is now being set on the context");
    user.loggedIn = true;
    this.setState({user:user});
  }

  logout() {
    console.log("Removing user from the app context");
    this.setState({user: {loggedIn:false}});
  }

  render () {
    const context = {
      user: this.state.user,
      login: this.login,
      logout: this.logout
    };

    return (
      <Layout>
      <UserContext.Provider value={context}>
        <Router>
          <Header>
            <NavBar />
          </Header>

          <Content>
          </Content>

          <Footer style={{ textAlign: 'center' }}>Created for 304CEM</Footer>

        </Router>
      </UserContext.Provider>  
      </Layout>
    );
  }
}

export default App;