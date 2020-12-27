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
  Space,
  message
} from "antd";
import { Link } from "react-router-dom";

import PropertyList from "../PropertyListComponent/PropertyList";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
import { formItemLayout } from "./SearchFormStyles";

import UserContext from "../../core/contexts/user";

const { Option } = Select;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class Home extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      user: "",
      limit: 3,
      page: 1,
      selectedFeatures: [],
      selectedCategories: [],
      query: "",

      properties: [],
      features: [],
      categories: [],

      loading: false,
      failed: false,
    };
    this.onFinish = this.onFinish.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.loadProperties = this.loadProperties.bind(this);
    this.reloadProperties = this.reloadProperties.bind(this);
  }

  componentDidMount() {
    this.loadProperties();
  }

  //If a user is logged in, return own properties where visible can be both true or null
  //Doing this so this code can be reused for both the Home and MyProperties pages.
  loadProperties() {
    this.setState({ loading: true });
    fetch(
      `${config.BACK_END_URL}/api/properties/?limit=${this.state.limit}&page=${
        this.state.page
      }&query=${this.state.query}&features=${
        this.state.selectedFeatures
      }&categories=${this.state.selectedCategories}&user=${
        this.props.user === undefined ? "" : this.props.user.id + "&onlyVisible=false"
      }`,
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

  reloadProperties() {
    this.loadProperties();
    message.success("Property removed successfully!")
  }

  onFinish = (values) => {
    const { ...data } = values;
    this.setState({
      limit: data.limit === undefined ? this.state.limit : data.limit,
      query: data.query === undefined ? "" : data.query,
      selectedFeatures: data.features === undefined ? "" : data.features,
      selectedCategories: data.categories === undefined ? "" : data.categories,
      page: 1,
    });
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
          <Option key={category._id} value={category._id}>
            {category.title}
          </Option>
        );
      });
    }

    return (
      <>
        <Row>
          <Divider>Properties</Divider>
          <Col span={24} xl={{ span: 18 }}>
            {this.state.loading ? (
              <StyledSpin />
            ) : (
              <PropertyList
                reloadProperties={this.reloadProperties}
                ownProperties={this.props.ownProperties}
                properties={this.state.properties}
              />
            )}
          </Col>
          <Col
            xl={{ span: 6 }}
            lg={{ span: 24 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <Card style={{ marginLeft: 10 }} title="Search Parameters">
              <Form
                name="search"
                onFinish={this.onFinish}
                {...formItemLayout}
                scrollToFirstError
              >
                <Form.Item name="query" label="Search Terms">
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
                    max={50 }
                    initialValues={3}
                    defaultValue={3}
                    placeholder="Limit"
                  />
                </Form.Item>
                <Form.Item
                  {...tailLayout}
                  style={{ float: "left", marginLeft: 0 }}
                >
                  <Space style={{ marginLeft: 0 }}>
                    <Button type="primary" htmlType="submit">
                      Search
                    </Button>
                    <UserContext.Consumer>
                      {(user) => {
                        if (user.user.loggedIn) {
                          return (
                            <Button>
                              <Link to="/property/create">
                                Add New Property
                              </Link>
                            </Button>
                          );
                        }
                      }}
                    </UserContext.Consumer>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Pagination
            defaultCurrent={1}
            pageSize={this.state.limit}
            total={this.state.count}
            onChange={this.onChangePage}
          />
        </Row>
      </>
    );
  }
}
export default Home;
