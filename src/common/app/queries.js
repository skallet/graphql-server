import Relay from 'react-relay';

export default {

  app: {
    application: () => Relay.QL`
      query {
        application
      }
    `,
  },

  home: {
    viewer: () => Relay.QL`
      query {
        me
      }
    `,

    photos: () => Relay.QL`
      query {
        recentPhotos(page: $page)
      }
    `,
  }

};
