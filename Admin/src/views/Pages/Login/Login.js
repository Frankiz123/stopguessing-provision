import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import userCtrl from '../../UserManagement/controllers/userCtrl';
import swal from 'sweetalert';

class Login extends Component {
  constructor(props){
    super(props)
    
    this.state={
           name:'',
           password:'',
         
    }
    this.onChange = this.onChange.bind(this)
    this.log_in = this.log_in.bind(this)

  }

onChange(e)
{

         this.setState({
           [e.target.name]: e.target.value
         })
}

componentDidMount = async() =>
{
  var loginToken = localStorage.getItem("login");

  if(loginToken == 'true')
  {
    this.props.history.push('/dashboard')
  }
  else{
    this.props.history.push('/')
  }
}

log_in() {
  var str = this.state.name.toLowerCase();
  var strpswd = this.state.password.toLowerCase();

if(this.state.name == "" || this.state.name !== str){
  swal({
    title: "Error!",
    text: "Please enter name",
    icon: "error",
  });
  return false;
}

if(this.state.password == "" || this.state.password !== strpswd){
  swal({
    title: "Error!",
    text: " Please enter password",
    icon: "error",
  });
  return false;
}

let formdata =
  {
    "name": this.state.name,
    "password": this.state.password,

  }
userCtrl.userLogin(formdata,(resulData)=>{
  if(resulData.data.status == "true")
  {
    localStorage.setItem("login",true);

  this.props.history.push('/dashboard');

    }
else{
  swal({
    title: "Error!",
    text: "Please enter valid username and password",
    icon: "error",
  });
  return false; }

})

}



  render() {
    
    return (

      <div className="app flex-row align-items-center">
            
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Name" name="name"  value={this.state.name} onChange={this.onChange}/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.onChange}/>
                      </InputGroup>
                      <Row>
                        <Col xs="12">
                          <Button onClick={ this.log_in} color="primary" className="px-4" block>Login</Button>
                        </Col>

                      </Row>
                    </Form>
                  </CardBody>
                </Card>
               
              </CardGroup>
            </Col>
          </Row>
  
  
        </Container>
  
      </div>
      
    );
  }
}

export default Login;
