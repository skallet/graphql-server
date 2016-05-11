import React, { PropTypes } from 'react';
import Relay, { createContainer } from 'react-relay';
import Component from 'react-pure-render/component';
import PhotoLike from './PhotoLike.react.js';

class PhotoPreview extends Component {

  static propTypes = {
    photo: PropTypes.object,
    viewer: PropTypes.object,
  };

  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  render() {
    const {
      title,
      source,
      owner,
    } = this.props.photo;

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="row">
            <div className="col-md-2">
              <img src={source} alt={title} className="img-responsive img-thumbnail" />
            </div>

            <div className="col-md-10">
              <h4>{title || 'Title not available'}</h4>

              <ul className="list-group">
                <li className="list-group-item">
                  <span className="badge">{owner.photoCount}</span>
                  User:
                  <strong>{owner.username}</strong>
                  {owner.realname && <span>({owner.realname})</span>}
                </li>

                {owner.description &&
                  <li className="list-group-item">
                    <h4 className="list-group-item-heading">User description</h4>
                    <p className="list-group-item-text">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: owner.description
                        }}
                      />
                    </p>
                  </li>
                }
              </ul>

              <PhotoLike photo={this.props.photo} viewer={this.props.viewer} />
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default createContainer(PhotoPreview, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${PhotoLike.getFragment('viewer')}
      }
    `,
    photo: () => Relay.QL`
      fragment on Photo {
        ${PhotoLike.getFragment('photo')}
        source
        title
        owner {
          username
          realname
          description
          photoCount
        }
      }
    `
  }
});
