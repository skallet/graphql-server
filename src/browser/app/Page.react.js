import './Page.scss';
import React, { PropTypes } from 'react';
import Relay, { createContainer } from 'react-relay';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import Header from './Header.react.js';
import Footer from './Footer.react.js';

class Page extends Component {

  static propTypes = {
    application: PropTypes.object,
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object,
  };

  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    const {
      application,
      children,
      params,
    } = this.props;

    const {
      name,
      version,
    } = application;

    return (
      <div className="container">
        <Helmet
          titleTemplate={`%s - ${name} v${version}`}
          meta={[
            {
              name: 'description',
              content: 'Client app using GraphQL endpoint'
            }
          ]}
          link={[
            { rel: 'shortcut icon', href: require('./favicon.ico') }
          ]}
        />

        <Header />

        {children}

        <Footer params={params} />
      </div>
    );
  }

}

export default createContainer(Page, {
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        name
        version
      }
    `,
  }
});
