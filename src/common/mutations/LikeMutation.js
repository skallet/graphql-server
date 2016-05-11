import Relay from 'react-relay';

export default class LikeMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation {toggleFollow}`;
  }

  getVariables() {
    return {
      user: this.props.viewer.id,
      photo: this.props.photo.flickerId,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on LikeOutputPayload {
        user {
          likes
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.viewer.id,
      }
    }, {
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL`
      fragment on LikeOutputPayload {
        user {
          likes
        }
      }
      `]
    }];
  }

}
