import React, { PropTypes } from 'react';
import Relay, { createContainer } from 'react-relay';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import PhotoPreview from './PhotoPreview.react.js';
import { setLikes } from '../../common/ui/actions.js';
import { connect } from 'react-redux';

class Page extends Component {

  static propTypes = {
    photos: PropTypes.object,
    setLikes: PropTypes.func,
    viewer: PropTypes.object,
  };

  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  componentDidMount() {
    const {
      viewer,
    } = this.props;

    this.props.setLikes(viewer.likes);
  }

  render() {
    const {
      photos: { photos },
      viewer,
    } = this.props;

    const title = 'Homepage';

    return (
      <div>
        <Helmet title={title} />

        <div className="container-fluid">
          <div className="row">
            {photos.map((photo, key) => <PhotoPreview key={key} photo={photo} viewer={viewer} />)}
          </div>
        </div>
      </div>
    );
  }

}

Page = connect(() => ({}), { setLikes })(Page);
export default createContainer(Page, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        likes
        ${PhotoPreview.getFragment('viewer')}
      }
    `,
    photos: () => Relay.QL`
      fragment on RecentPhotoConnection {
        photos {
          ${PhotoPreview.getFragment('photo')}
        }
      }
    `
  }
});
