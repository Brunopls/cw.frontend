import React from "react";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
import {
  Divider,
  Input,
  InputNumber,
  Row,
  Col,
  Card,
  Form,
  Button,
} from "antd";

import PropertyList from "../PropertyListComponent/PropertyList";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 3,
      page: 1,
      loading: false,
      failed: false,
      properties: [],
      features: [],
      categories: [],
    };
    this.onFinish = this.onFinish.bind(this);
    this.searchProperties = this.searchProperties.bind(this);
  }

  componentDidMount() {
    this.searchProperties();
  }

  // componentDidUpdate() {
  //   this.setState({ loading: true });
  //   this.searchProperties();
  // }

  searchProperties() {
    this.setState({ loading: true });
    fetch(
      `${config.BACK_END_URL}/api/properties/?limit=${this.state.limit}&page=${this.state.page}`,
      {
        method: "GET",
      }
    )
      .then(status)
      .then(json)
      .then((response) => {
        this.setState({
          properties: response.result,
          categories: response.resultCategories,
          features: response.resultFeatures,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ failed: true });
      });
  }

  onFinish = (values) => {
    const { ...data } = values;
    this.setState({ limit: data.limit });
    this.searchProperties();
  };

  render() {
    return (
      <>
        <Row>
          <Divider>Properties</Divider>
          <Col span={18}>
            {this.state.loading ? (
              <StyledSpin />
            ) : (
              <PropertyList properties={this.state.properties} />
            )}
          </Col>
          <Col span={6}>
            <Card title="Search Parameters">
              <Form name="search" onFinish={this.onFinish} scrollToFirstError>
                <Input.Group>
                  <Form.Item name="search" label="Search Terms">
                    <Input />
                  </Form.Item>
                  <Form.Item name="limit" label="Result Limit">
                    <InputNumber min={1} max={50} initialValues={10} />
                  </Form.Item>
                </Input.Group>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Search
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
export default Home;
