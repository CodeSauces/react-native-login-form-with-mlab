import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-react-native-sdk';
import { Container, Body, Header, Title, Form, Item, Input } from 'native-base';

export default class App extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      currentUserId: undefined,
      client: undefined
    };
    this._loadClient = this._loadClient.bind(this);
    this._onPressLogin = this._onPressLogin.bind(this);
    this._onPressLogout = this._onPressLogout.bind(this);
  }


  componentDidMount() {
    this._loadClient();
  }

  render() {
    let loginStatus = "Currently logged out."

    if (this.state.currentUserId) {
      loginStatus = `Currently logged in as ${this.state.currentUserId}!`
    }

    loginButton = <Button
      onPress={this._onPressLogin}
      title="Login" />

    logoutButton = <Button
      onPress={this._onPressLogout}
      title="Logout" />

    return (
      <Container>
        <Header>
          <Body>
            <Title>Login Form</Title>
          </Body>
        </Header>
        <Form>
          <Item>
            <Input placeholder="User Name">
            </Input>
          </Item>
          <Item>
            <Input placeholder="Password">
            </Input>
          </Item>
          <Item>
            <View style={styles.container}>
              <Text> {loginStatus} </Text>
              {this.state.currentUserId !== undefined ? logoutButton : loginButton}
            </View>
          </Item>
        </Form>

      </Container>

    );
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient('form-login-mkocl').then(client => {
      this.setState({ client });
      if (client.auth.isLoggedIn) {
        this.setState({ currentUserId: client.auth.user.id })
      }
    });

  }

  _onPressLogin() {

    this.state.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`Successfully logged in as user ${user.id}`);
      this.setState({ currentUserId: user.id })


      //start
      const db = this.state.client.getServiceClient(RemoteMongoClient.factory, 'test-cluster').db('db-react-app');
      this.state.client.auth.loginWithCredential(new AnonymousCredential()).then(user =>
        db.collection('users').insertOne({ owner_id: this.state.client.auth.user.id, password: "papia" })
      ).then(() =>
        db.collection('users').find({ password: "papia" }).asArray()
      ).then(docs => {
        console.log("Found docs", docs)
        if (docs.filter(OBJ => OBJ.password === "papia")) {
          console.log("Matached Result", docs.filter(OBJ => OBJ.password === "papia"))
        }
        console.log("[MongoDB Stitch] Connected to Stitch")
      }).catch(err => {
        console.error(err)
      });
      //end


    }).catch(err => {
      console.log(`Failed to log in anonymously: ${err}`);
      this.setState({ currentUserId: undefined })
    });
  }

  _onPressLogout() {
    this.state.client.auth.logout().then(user => {
      console.log(`Successfully logged out`);
      this.setState({ currentUserId: undefined })
    }).catch(err => {
      console.log(`Failed to log out: ${err}`);
      this.setState({ currentUserId: undefined })
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});