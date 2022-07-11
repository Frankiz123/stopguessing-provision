import React, { Component } from 'react';
import { Card, CardBody, Col, Row, Table, FormGroup, Label, CardHeader, Input, Button, Modal, ModalBody, ModalHeader, CarouselItem, CarouselControl, Carousel } from 'reactstrap';
import userCtrl from '../UserManagement/controllers/userCtrl';
import ClipLoader from "react-spinners/ClipLoader";
import swal from 'sweetalert';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      large: false,
      Acne: false,
      Fine: false,
      Dry: false,
      Oily: false,
      activeIndex: 0,
      slideNum: 0,
      small: false,
      dd1: false,
      useeRecommendation: false,
      usersData: [],
      userIdImage: '',
      userDetailsarray: "",
      items: [],
      acneImageComment: '',
      fineLinesComment: '',
      drySkinComment: '',
      oilySkinComment: '',
      loading: false,
      select: '1',
      previousCommentAcne: '',
      previousCommentFine: '',
      previousCommentDry: '',
      previousCommentOily: '',
    };


    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);

    this.hideViewAcne = this.hideViewAcne.bind(this);
    this.hideViewDry = this.hideViewDry.bind(this);
    this.hideViewFine = this.hideViewFine.bind(this);
    this.hideViewOily = this.hideViewOily.bind(this);

    this.slideNext = this.slideNext.bind(this);
    this.slidePrevious = this.slidePrevious.bind(this);
    this.toggleSmall = this.toggleSmall.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.onChange = this.onChange.bind(this)
    this.select = this.select.bind(this)

  }

  componentDidMount() {
    userCtrl.userSingle((resulData) => {
      this.setState({
        usersData: resulData.data.response,

      })
    })
      ;
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })

  }


  userImageShow = async () => {

    const id = localStorage.getItem("userId")
    console.log("iddddd", id);

    this.setState({
      loading: true
    })
    // creates entity
    fetch("http://18.222.228.44:3000/userimage", {
      "method": "POST",
      "headers": {

        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": JSON.stringify({
        user_id: id
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status == "true") {
          this.setState({
            loading: false
          })
          this.setState({
            items: response.response
          })
        }
        else {
          this.setState({
            loading: false
          })
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  PreviousComment = async () => {
    const id = localStorage.getItem("userId")
    console.log("iddddd", id);

    this.setState({
      loading: true
    })
    // creates entity
    fetch("http://18.222.228.44:3000/previouscomments", {
      "method": "POST",
      "headers": {

        "content-type": "application/json",
        "accept": "application/json"
      },
      "body": JSON.stringify({
        user_id: id
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status == "true") {
          this.setState({
            previousCommentAcne: response.response[0].acneImage,
            previousCommentFine: response.response[0].fineLines,
            previousCommentDry: response.response[0].drySkin,
            previousCommentOily: response.response[0].oilySkin,
            loading:false
          })

        }

        else {
          this.setState({
            loading: false
          })
        }
      })
      .catch(err => {
        console.log(err);
      });
  }


  commentSaveAcne = async () => {
    const id = localStorage.getItem("userId")
    
    if(this.state.acneImageComment == ""){
      swal({
        title: "Error!",
        text: " Please enter comment",
        icon: "error",
      });
      return false;
    }

    this.setState({
      loading: true
    })


    let formdata =
    {
      "user_id": id,
      "acneImage": this.state.acneImageComment,
    
    }
    console.log("formdata", formdata);
    userCtrl.adminComment(formdata, (resulData) => {
      if (resulData.data.status == "true") {
        this.setState({
          loading: false,
          acneImageComment:''
        })
        this.PreviousComment();
      }

    })
  }

  commentSaveFine = async () => {
    const id = localStorage.getItem("userId")
    
    if(this.state.fineLinesComment == ""){
      swal({
        title: "Error!",
        text: " Please enter comment",
        icon: "error",
      });
      return false;
    }

    this.setState({
      loading: true
    })


    let formdata =
    {
      "user_id": id,
      "fineLines": this.state.fineLinesComment,
    
    }
    console.log("formdata", formdata);
    userCtrl.adminComment(formdata, (resulData) => {
      if (resulData.data.status == "true") {
        this.setState({
          loading: false,
          fineLinesComment:''

        })
        this.PreviousComment();

      }

    })
  }
   commentSaveDry = async () => {
    const id = localStorage.getItem("userId")
    
    if(this.state.drySkinComment == ""){
      swal({
        title: "Error!",
        text: " Please enter comment",
        icon: "error",
      });
      return false;
    }

    this.setState({
      loading: true
    })


    let formdata =
    {
      "user_id": id,
      "drySkin": this.state.drySkinComment,

    }
    console.log("formdata", formdata);
    userCtrl.adminComment(formdata, (resulData) => {
      if (resulData.data.status == "true") {
        this.setState({
          loading: false,
          drySkinComment:''

        })
        this.PreviousComment();

      }

    })
  } 
  
  commentSaveOily = async () => {
    const id = localStorage.getItem("userId")
    
    if(this.state.oilySkinComment == ""){
      swal({
        title: "Error!",
        text: " Please enter comment",
        icon: "error",
      });
      return false;
    }

    this.setState({
      loading: true
    })

    let formdata =
    {
      "user_id": id,
      "oilySkin": this.state.oilySkinComment
    }
    console.log("formdata", formdata);
    userCtrl.adminComment(formdata, (resulData) => {
      if (resulData.data.status == "true") {
        this.setState({
          loading: false,
          oilySkinComment:''
        })
        this.PreviousComment();

      }
    })
  }


  select = async (e) => {
    const id = localStorage.getItem("userId")

    let formdata =
    {
      "user_id": id,
      "userProduct": e.target.value
    }
    userCtrl.userProduct(formdata, (resulData) => {

    })
  }

  dropdownToggle() {
    this.setState({
      dd1: !this.state.dd1
    });
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === this.state.items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? this.state.items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  slideNext() {
    this.setState({
      slideNum: this.state.slideNum + 1
    })
  }

  slidePrevious() {
    this.setState({
      slideNum: this.state.slideNum - 1
    })
  }

  toggleSmall() {
    this.setState({
      small: !this.state.small,
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
    this.userImageShow();
    this.useeRecommendation();
    this.PreviousComment();
  }

  useeRecommendation() {
    this.setState({
      useeRecommendation: true

    })
  }

  hideViewAcne() {
    this.setState({
      Acne: !this.state.Acne,

    })
  }

  hideViewFine() {
    this.setState({
      Fine: !this.state.Fine,
    });
  }

  hideViewDry() {
    this.setState({
      Dry: !this.state.Dry,

    });
  }

  hideViewOily() {
    this.setState({
      Oily: !this.state.Oily

    });
  }

  render() {
    const { activeIndex } = this.state;
    const user = this.state.usersData.find(user => user.id.toString() === this.props.match.params.id)
    const userDetails = user ? Object.entries(user) : [['id', (<span><i className="text-muted icon-ban"></i></span>)]]

    localStorage.setItem("userId", userDetails[0][1]);
    const url = "http://18.222.228.44/server/uploads/"
    const slides = this.state.items.map((item) => {
      return (
        <CarouselItem onExiting={this.onExiting} onExited={this.onExited} key={item.src}>
          <div class="container portrait">

            <img className="d-block w-100" src={url + item.src} style={{ overflow: "hidden" }} alt={"Image not saved by user"} width={200} height={400} mode='fit'></img>
          </div>
        </CarouselItem>
      );
    });

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" xl="6">
            <Card>

              <CardBody>
                <Table responsive striped hover>
                  <tbody>
                    {
                      userDetails.map(([key, value]) => {
                        return (
                          <tr key={key}>
                            <td style={{ textTransform: 'capitalize' }} >{`${key}:`}</td>
                            <td><strong>{value}</strong></td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </CardBody>

              <Button onClick={this.toggleLarge} className="mr-10">Click to open image</Button>
              <Modal isOpen={this.state.large} toggle={this.toggleLarge}
                size="xl" style={{ maxWidth: '600px', maxHeight: '50px', width: '80%', height: '10%' }}>
                {activeIndex === 0 &&
                  <ModalHeader toggle={this.toggleLarge}>Acne image</ModalHeader>
                }
                {activeIndex === 1 &&
                  <ModalHeader toggle={this.toggleLarge}>Fine Lines</ModalHeader>
                }{activeIndex === 2 &&
                  <ModalHeader toggle={this.toggleLarge}>Dry Skin</ModalHeader>
                }{activeIndex === 3 &&
                  <ModalHeader toggle={this.toggleLarge}>Oily Skin</ModalHeader>
                }
                <ModalBody>

                  <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous} interval={false} ride="carousel">
                    {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                  </Carousel>
                </ModalBody>
                {activeIndex === 0 &&
                  <Row style={{ marginLeft: '25%' }}>
                   
                   {this.state.Acne == false &&
                    <Col >
                      <i onClick={this.hideViewAcne}  className="cui-thumb-down icons font-3xl d-block mt-2"></i>
                    </Col>}

                    {this.state.Acne == true &&
                      <Col style={{color:'blue'}}>
                      <i onClick={this.hideViewAcne} className="cui-thumb-down icons font-3xl d-block mt-2"></i>
                    </Col>
                    }
                    
                    <Col >
                      <i className="cui-thumb-up icons font-3xl d-block mt-2"></i>
                    </Col>
                  </Row>
                }

                {activeIndex === 1 &&
                  <Row style={{ marginLeft: '25%' }}>
                    
                    {this.state.Fine == false &&
                    <Col >
                      <i onClick={this.hideViewFine}  className="cui-thumb-down icons font-3xl d-block mt-2"></i>
                    </Col>}

                    {this.state.Fine == true &&
                      <Col style={{color:'blue'}}>
                      <i onClick={this.hideViewFine} className="cui-thumb-down icons font-3xl d-block mt-2"></i>
                    </Col>
                    }

      
                    <Col>
                      <i className="cui-thumb-up icons font-3xl d-block mt-2"></i>
                    </Col>
                  </Row>
                }   {activeIndex === 2 &&
                  <Row style={{ marginLeft: '25%' }}>
                  
                    {this.state.Dry == false &&
                    <Col >
                      <i onClick={this.hideViewDry}  className="cui-thumb-down icons font-3xl d-block mt-2"></i>
                    </Col>}

                    {this.state.Dry == true &&
                      <Col style={{color:'blue'}}>
                      <i onClick={this.hideViewDry} className="cui-thumb-down icons font-3xl d-block mt-2"></i>
                    </Col>
                    }
                    <Col>
                      <i className="cui-thumb-up icons font-3xl d-block mt-2"></i>
                    </Col>
                  </Row>
                }
                <div className="sweet-loading">
                  <ClipLoader
                    style={{}}
                    size={15}
                    color={"blue"}
                    loading={this.state.loading}
                  />
                </div>
                {activeIndex === 3 &&
                  <Row style={{ marginLeft: '25%' }}>
                    
                    {this.state.Oily == false &&
                    <Col >
                      <i onClick={this.hideViewOily}  className="cui-thumb-down icons font-3xl d-block mt-2"></i>
                    </Col>}

                    {this.state.Oily == true &&
                      <Col style={{color:'blue'}}>
                      <i onClick={this.hideViewOily} className="cui-thumb-down icons font-3xl d-block mt-2"></i>
                    </Col>
                    }
                    <Col>
                      <i className="cui-thumb-up icons font-3xl d-block mt-2"></i>
                    </Col>
                  </Row>
                }
                {this.state.Acne === true && activeIndex === 0 &&

                  <Col xs="6" lg="12" md="2" >
                    <Card style={{ marginTop: '5%', overflowY: 'scroll' }}>
                      <CardHeader>
                        Previous Comment
              </CardHeader>
                      <div >
                        <CardBody>
                          {this.state.previousCommentAcne}
                        </CardBody>
                      </div>
                    </Card>
                  </Col>
                }

{this.state.Fine === true && activeIndex === 1 &&

<Col xs="6" lg="12" md="2" >
  <Card style={{ marginTop: 10, overflowY: 'scroll' }}>
    <CardHeader>
      Previous Comment
</CardHeader>
    <div >
      <CardBody>
        {this.state.previousCommentFine}
      </CardBody>
    </div>
  </Card>
</Col>
}
{this.state.Dry === true && activeIndex === 2 &&

<Col xs="6" lg="12" md="2" >
  <Card style={{ marginTop: 10, overflowY: 'scroll' }}>
    <CardHeader>
      Previous Comment
</CardHeader>
    <div >
      <CardBody>
        {this.state.previousCommentDry}
      </CardBody>
    </div>
  </Card>
</Col>
}{this.state.Oily === true && activeIndex === 3 &&

<Col xs="6" lg="12" md="2" >
  <Card style={{ marginTop: 10, overflowY: 'scroll' }}>
    <CardHeader>
      Previous Comment
</CardHeader>
    <div >
      <CardBody>
        {this.state.previousCommentOily}
      </CardBody>
    </div>
  </Card>
</Col>
}

                {this.state.Acne === true && activeIndex === 0 &&
                  <FormGroup style={{ marginLeft: 20, marginRight: 20 }}>
                    <Label htmlFor="name"><strong>Add comment</strong></Label>
                    <Input type="text" name="acneImageComment" placeholder="Enter Comment" value={this.state.acneImageComment} onChange={this.onChange} required />
                    <Col style={{ marginTop: 10, marginLeft: '70%' }} sm="6" md="4" sm className="mb-1 mb-xl-0">
                      <Button onClick={(e) => { this.commentSaveAcne() }} block color="info">Save Comment</Button>
                    </Col>
                  </FormGroup>

                }

                {this.state.Fine === true && activeIndex === 1 &&
                  <FormGroup style={{ marginLeft: 20, marginRight: 20 }}>
                    <Label htmlFor="name"><strong>Add comment</strong></Label>
                    <Input type="text" name="fineLinesComment" placeholder="Enter Comment" value={this.state.fineLinesComment} onChange={this.onChange} required />
                    <Col style={{ marginTop: 10, marginLeft: '70%' }} sm="6" md="4" sm className="mb-1 mb-xl-0">
                      <Button onClick={(e) => { this.commentSaveFine()}}block color="info">Save Comment</Button>
                    </Col>
                  </FormGroup>
                }

                {this.state.Dry === true && activeIndex === 2 &&
                  <FormGroup style={{ marginLeft: 20, marginRight: 20 }}>
                    <Label htmlFor="name"><strong>Add comment</strong></Label>
                    <Input type="text" name="drySkinComment" placeholder="Enter Comment" value={this.state.drySkinComment} onChange={this.onChange} required />
                    <Col style={{ marginTop: 10, marginLeft: '70%' }} sm="6" md="4" sm className="mb-1 mb-xl-0">
                      <Button onClick={(e) => { this.commentSaveDry()}} block color="info">Save Comment</Button>
                    </Col>
                  </FormGroup>
                }

                {this.state.Oily === true && activeIndex === 3 &&
                  <FormGroup style={{ marginLeft: 20, marginRight: 20 }}>
                    <Label htmlFor="name"><strong>Add comment</strong></Label>
                    <Input type="text" name="oilySkinComment" placeholder="Enter Comment" value={this.state.oilySkinComment} onChange={this.onChange} required />
                    <Col style={{ marginTop: 10, marginLeft: '70%' }} sm="6" md="4" sm className="mb-1 mb-xl-0">
                      <Button onClick={(e) => { this.commentSaveOily()}} block color="info">Save Comment</Button>
                    </Col>
                  </FormGroup>
                }
              </Modal>

            </Card>
            {this.state.useeRecommendation === true &&
              <div>
                <strong>User product recommendation</strong>
                <FormGroup style={{ marginTop: 10 }}>
                  <Input type="select" name="select" placeholder="Select Product" value={this.state.select} onChange={(e) => { this.onChange(e); this.select(e) }}>
                    <option value="">Select Product</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Input>
                </FormGroup>
              </div>
            }
          </Col>

        </Row>
      </div>
    );
  }
}



export default User;
