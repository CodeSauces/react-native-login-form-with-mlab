import React from 'react';
import {Header, Container, Text, Body, Title, Form, Item, Input, Button } from 'native-base';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }


  render() {
  
    return (
      <Container>
        <Header>
          <Body>
            <Title>Login Form</Title>
          </Body>
        </Header>
        <Container>
          <Form>
            <Item>
              <Input placeholder="User Name"></Input>
            </Item>
            <Item>
              <Input placeholder="Password"></Input>
            </Item>
          <Item>
            <Button  style={{alignSelf:"center",marginHorizontal:160}}>
              <Text>Login</Text>
            </Button>
          </Item>
          </Form>
        </Container>
      </Container>
    );
  }
}
