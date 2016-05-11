import React, { PropTypes } from 'react';
import Relay, { createContainer } from 'react-relay';
import Component from 'react-pure-render/component';
import LikeMutation from '../../common/mutations/LikeMutation.js';
import { setLikes } from '../../common/ui/actions.js';
import { connect } from 'react-redux';

class PhotoLike extends Component {

  static propTypes = {
    likes: PropTypes.object,
    photo: PropTypes.object,
    setLikes: PropTypes.func,
    viewer: PropTypes.object,
  };

  static contextTypes = {
    relay: Relay.PropTypes.Environment,
  };

  handleToggle() {
    const {
      photo,
      viewer,
    } = this.props;
    Relay.Store.commitUpdate(
      new LikeMutation({
        photo,
        viewer,
      }),
      {
        onSuccess: (response) => {
          this.props.setLikes(response.toggleFollow.user.likes);
        }
      }
    );
  }

  render() {
    const {
      photo,
      likes,
    } = this.props;
    const { flickerId } = photo;
    const userLikePhoto = likes.indexOf(flickerId) >= 0;

    return (
      <div>
        {!userLikePhoto
          && <button className="btn btn-primary" onClick={() => this.handleToggle()}>Like</button>
        }
        {userLikePhoto
          && <button className="btn btn-danger" onClick={() => this.handleToggle()}>Unlike</button>
        }
      </div>
    );
  }

}

PhotoLike = connect(state => ({
  likes: state.ui.likes,
}), { setLikes })(PhotoLike);

export default createContainer(PhotoLike, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        likes
      }
    `,
    photo: () => Relay.QL`
      fragment on Photo {
        flickerId
      }
    `,
  }
});
