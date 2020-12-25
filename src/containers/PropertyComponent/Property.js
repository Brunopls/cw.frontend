import React from "react";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
import {
  Form,
  Input,
  Button,
  Result,
  List,
  Card,
  Badge,
  Space,
  Row,
  Col
} from "antd";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
import {
  HomeOutlined,
} from "@ant-design/icons";

class Property extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      property: {},
      loading: false,
    };
    this.loadProperty = this.loadProperty.bind(this);
  }

  async componentDidMount(){
    const { id } = this.props.match.params
      await this.setState({ id: id })
      this.loadProperty()
  }

  loadProperty(){
    this.setState({ loading: true })
    fetch(
      `${config.BACK_END_URL}/api/properties/${this.state.id}`,
      {
        method: "GET",
      }
    )
      .then(status)
      .then(json)
      .then((response) => {
          this.setState({
          property: response,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ failed: true });
      });
  }

  render() {
    let features = [];
    if(this.state.property.propertyFeatures){
    this.state.property.propertyFeatures.map((feature) => {
      return features.push(feature)
    })}
    if (this.state.loading) {
      return <StyledSpin />;
    }

    if(this.state.failed) {
      return <Result
      status="warning"
      title="No property found."
      subTitle="We couldn't find a property that matches your search query."
    />
    }
    
    
    if (this.props.read) {
      return <>
      <Row>
        <Col span={18}>
      <Card  title={this.state.property.title} extra={
          <Space>
            {this.state.property.highPriority ? (
              <Badge dot text="High Priority" status="success" />
            ) : null}
            {this.state.property.underOffer ? (
              <Badge dot text="Under Offer" status="processing" />
            ) : null}
          </Space>
      }>
        <Card type="inner" style={{ marginBottom: 10 }} title="Title">
          {this.state.property.title}
        </Card>
        <Card type="inner" style={{ marginBottom: 10 }} title="Description">
          {this.state.property.description}
        </Card>
        <Card type="inner" style={{ marginBottom: 10 }} title="Location">
          {this.state.property.location}
        </Card>
        <Card type="inner" style={{ marginBottom: 10 }} title="Asking Price">
          £{this.state.property.askingPrice}
        </Card>
        <Card type="inner" style={{ marginBottom: 10 }} title="Agent">
          {this.state.property.user}
        </Card>
        <Card type="inner" style={{ marginBottom: 10 }} title="Category">
          {this.state.property.propertyCategory}
        </Card>
      </Card>
      </Col>
        <Col span={4}>
          <Card style={{ marginBottom: 10, marginLeft: 10 }} title="Features">
            <List
              itemLayout="horizontal"
              dataSource={features}
              renderItem={(feature) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<HomeOutlined />}
                    title={feature}
                  />
                </List.Item>
              )}
            >
            </List>
          </Card>
          <Card style={{ marginBottom: 10, marginLeft: 10 }} title="Message Agent">
            <Form name="message" onFinish={this.sendMessage} scrollToFirstError>
                <Form.Item name="messageContent">
                  <Input.TextArea placeholder="Write your message here..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Send Message
                  </Button>
                </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      </>;
    }

    if(this.props.update){
      return (<Card></Card>)
    }

    if(this.props.create){
      return (<Card></Card>)
    }
  }
}

export default Property;
