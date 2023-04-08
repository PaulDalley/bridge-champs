import React, { Component, PropTypes } from "react";
import _ from "lodash";

// const propTypes = {
//     items: PropTypes.array.isRequired,
//     onChangePage: PropTypes.func.isRequired,
//     initialPage: PropTypes.number
// }

const defaultProps = {
  initialPage: 1,
};

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = { pager: {}, reloading: true, currentPage: 1 };
  }

  componentWillMount() {
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      // this.setPage(this.props.initialPage);
      this.setPage(this.props.page);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== 1 && this.state.reloading) {
      // if (nextProps.page <= )
      this.setState({ reloading: false });
      this.setPage(nextProps.page);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset page if items array has changed
    if (this.props.items !== prevProps.items) {
      this.setPage(this.props.initialPage);
    }
    // if (this.props.items.length === 0) {
    //     this.setState({ pager: {}}, () => this.props.onChangePage([]));
    //     this.props.onChangePage([]);
    // }
  }

  setPage(page) {
    var items = this.props.items;
    var pager = this.state.pager;

    if (page < 1 || page > pager.totalPages) {
      return;
    }

    // get new pager object for specified page
    pager = this.getPager(items.length, page);

    // get new page of items from items array
    var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // update state
    this.setState({ pager: pager, currentPage: page });

    // call change page function in parent component
    this.props.onChangePage(pageOfItems, page);
  }

  getPager(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    pageSize = pageSize || 10;

    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);

    var startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    var pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }

  render() {
    var pager = this.state.pager;

    if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null;
    }

    return (
      <ul className="pagination">
        <li className={pager.currentPage === 1 ? "disabled" : ""}>
          <a onClick={() => this.setPage(1)}>First</a>
        </li>
        <li className={pager.currentPage === 1 ? "disabled" : ""}>
          <a onClick={() => this.setPage(pager.currentPage - 1)}>Previous</a>
        </li>
        {pager.pages.length > 5 && this.state.currentPage - 3 > 0 && (
          <li
            style={{
              position: "relative",
              top: ".45rem",
              fontSize: "1.7rem",
            }}
          >
            ...
          </li>
        )}

        {pager.pages.map((page, index) => {
          if (
            pager.pages.length > 5 &&
            this.state.currentPage !== 1 &&
            (page > this.state.currentPage + 2 ||
              page < this.state.currentPage - 2)
          ) {
            // if (page !== 0) return;
            return;
          }

          if (pager.pages.length > 5 && this.state.currentPage === 1) {
            if (page >= 6) return;
          }

          return (
            <li
              key={index}
              className={pager.currentPage === page ? "active" : ""}
            >
              <a onClick={() => this.setPage(page)}>{page}</a>
            </li>
          );
        })}
        {pager.pages.length > 5 &&
          this.state.currentPage + 2 < pager.pages.length && (
            <li
              style={{
                position: "relative",
                top: ".45rem",
                fontSize: "1.7rem",
              }}
            >
              ...
            </li>
          )}

        <li
          className={pager.currentPage === pager.totalPages ? "disabled" : ""}
        >
          <a onClick={() => this.setPage(pager.currentPage + 1)}>Next</a>
        </li>
        <li
          className={pager.currentPage === pager.totalPages ? "disabled" : ""}
        >
          <a onClick={() => this.setPage(pager.totalPages)}>Last</a>
        </li>
      </ul>
    );
  }
}

// Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default Pagination;
