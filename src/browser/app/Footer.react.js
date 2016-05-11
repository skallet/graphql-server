import React, { PropTypes } from 'react';
import Component from 'react-pure-render/component';
import { Link } from 'react-router';

export default class Footer extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
  }

  render() {
    const {
      params,
    } = this.props;

    const nextPage = params.page ? +params.page + 1 : 2;
    const prevPage = params.page ? +params.page - 1 : 0;

    return (
      <div>
        {prevPage > 0 && <Link to={`/${prevPage}`} className="btn btn-default">prev page</Link>}
        <Link to={`/${nextPage}`} className="btn btn-default">next page</Link>
        <footer>
          By <a href="http://milanblazek.cz">Milan Blazek</a>.
        </footer>
      </div>
    );
  }

}
