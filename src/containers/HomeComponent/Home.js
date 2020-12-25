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
  Select,
  Pagination,
} from "antd";

import PropertyList from "../PropertyListComponent/PropertyList";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
import { formItemLayout } from "./SearchFormStyles";

const { Option } = Select;

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
    this.onChangePage = this.onChangePage.bind(this);
    this.loadProperties = this.loadProperties.bind(this);
  }

  componentDidMount() {
    this.loadProperties();
  }

  loadProperties() {
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
          count: response.resultCount,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ failed: true });
      });
  }

  async onChangePage(pageNumber) {
    await this.setState({ page: pageNumber });
    this.loadProperties();
  }

  onFinish = (values) => {
    const { ...data } = values;
    this.setState({ limit: data.limit, page: 1 });
    this.loadProperties();
  };

  render() {
    let features = [];
    if (this.state.features) {
      this.state.features.map((feature) => {
        return features.push(
          <Option key={feature._id} value={feature._id}>
            {feature.title}
          </Option>
        );
      });
    }

    let categories = [];
    if (this.state.categories) {
      this.state.categories.map((category) => {
        return categories.push(
          <Option value={category._id}>{category.title}</Option>
        );
      });
    }

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
            <Pagination
              defaultCurrent={1}
              pageSize={this.state.limit}
              total={this.state.count}
              onChange={this.onChangePage}
            />
            {/* <Pagination defaultCurrent={1} total={20} onChange={(pageNumber)=>this.setState({page: pageNumber})} /> */}
          </Col>
          <Col span={6}>
            <Card style={{ marginLeft: 10 }} title="Search Parameters">
              <Form
                name="search"
                onFinish={this.onFinish}
                {...formItemLayout}
                scrollToFirstError
              >
                <Form.Item name="search" label="Search Terms">
                  <Input placeholder="Search query" />
                </Form.Item>
                <Form.Item name="features" label="Features">
                  <Select mode="multiple" placeholder="Property features">
                    {features}
                  </Select>
                </Form.Item>
                <Form.Item name="categories" label="Categories">
                  <Select mode="multiple" placeholder="Property categories">
                    {categories}
                  </Select>
                </Form.Item>
                <Form.Item name="limit" label="Result Limit">
                  <InputNumber
                    min={1}
                    max={50}
                    defaultValue={10}
                    initialValues={10}
                    placeholder="Limit"
                  />
                </Form.Item>
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
