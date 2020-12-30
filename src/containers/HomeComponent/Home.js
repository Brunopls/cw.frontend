import React from "react";
import PropTypes from "prop-types";
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
  message,
} from "antd";
import { Link } from "react-router-dom";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";

import PropertyList from "../PropertyListComponent/PropertyList";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
import UserContext from "../../core/contexts/user";

const { Option } = Select;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 3,
      page: 1,
      selectedFeatures: [],
      selectedCategories: [],
      query: "",

      properties: [],
      features: [],
      categories: [],

      loading: false,
    };
    this.onFinish = this.onFinish.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.loadProperties = this.loadProperties.bind(this);
    this.reloadProperties = this.reloadProperties.bind(this);
  }

  componentDidMount() {
    this.loadProperties();
  }

  async onChangePage(pageNumber) {
    await this.setState({ page: pageNumber });
    this.loadProperties();
  }

  onFinish(values) {
    const { ...data } = values;
    this.setState((prevState) => ({
      limit: data.limit === undefined ? prevState.limit : data.limit,
      query: data.query === undefined ? "" : data.query,
      selectedFeatures: data.features === undefined ? "" : data.features,
      selectedCategories: data.categories === undefined ? "" : data.categories,
      page: 1,
    }));
    this.loadProperties();
  }

  // If a user is logged in, return own properties where visible can be both true or null
  // Doing this so this code can be reused for both the Home and MyProperties pages.
  loadProperties() {
    const {
      limit,
      page,
      query,
      selectedFeatures,
      selectedCategories,
    } = this.state;
    const {
      user: { id: userID },
    } = this.props;
    this.setState({ loading: true });
    fetch(
      `${
        config.BACK_END_URL
      }/api/properties/?limit=${limit}&page=${page}&query=${query}&features=${selectedFeatures}&categories=${selectedCategories}&user=${
        userID === undefined ? "" : `${userID}&onlyVisible=false`
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
      });
  }

  reloadProperties() {
    this.loadProperties();
    message.success("Property removed successfully!");
  }

  render() {
    const { loading, properties, limit, count } = this.state;
    const { ownProperties } = this.props;

    const featureOptions = [];
    const { features } = this.state;
    if (features) {
      features.map(({ _id, title }) =>
        featureOptions.push(
          <Option key={_id} value={_id}>
            {title}
          </Option>
        )
      );
    }

    const categoryOptions = [];
    const { categories } = this.state;
    if (categories) {
      categories.map(({ _id, title }) =>
        categoryOptions.push(
          <Option key={_id} value={_id}>
            {title}
          </Option>
        )
      );
    }

    return (
      <>
        <Row>
          <Divider>Properties</Divider>
          <Col span={24} xl={{ span: 18 }}>
            {loading ? (
              <StyledSpin />
            ) : (
              <PropertyList
                reloadProperties={this.reloadProperties}
                ownProperties={ownProperties}
                properties={properties}
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
                labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
                wrapperCol={{ xs: { span: 24 }, sm: { span: 12 } }}
                scrollToFirstError
              >
                <Form.Item name="query" label="Search Terms">
                  <Input placeholder="Search query" />
                </Form.Item>
                <Form.Item name="features" label="Features">
                  <Select mode="multiple" placeholder="Property features">
                    {featureOptions}
                  </Select>
                </Form.Item>
                <Form.Item name="categories" label="Categories">
                  <Select mode="multiple" placeholder="Property categories">
                    {categoryOptions}
                  </Select>
                </Form.Item>
                <Form.Item name="limit" label="Result Limit">
                  <InputNumber
                    min={1}
                    max={50}
                    initialValues={3}
                    defaultValue={3}
                    placeholder="Limit"
                  />
                </Form.Item>
                <Form.Item
                  wrapperCol={{ offset: 8, span: 16 }}
                  style={{ float: "left", marginLeft: 0 }}
                >
                  <Space style={{ marginLeft: 0 }}>
                    <Button type="primary" htmlType="submit">
                      Search
                    </Button>
                    <UserContext.Consumer>
                      {({ user }) => {
                        if (user.loggedIn) {
                          return (
                            <Button>
                              <Link to="/property/create">
                                Add New Property
                              </Link>
                            </Button>
                          );
                        }
                        return null;
                      }}
                    </UserContext.Consumer>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Pagination
            defaultCurrent={1}
            pageSize={limit}
            total={count}
            onChange={this.onChangePage}
          />
        </Row>
      </>
    );
  }
}

Home.contextType = UserContext;

Home.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    loggedIn: PropTypes.bool,
  }),
  ownProperties: PropTypes.bool.isRequired,
};

Home.defaultProps = {
  user: {
    id: undefined,
    loggedIn: undefined,
  },
};

export default Home;
