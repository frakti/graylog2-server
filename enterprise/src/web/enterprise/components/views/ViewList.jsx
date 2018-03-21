import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Immutable from 'immutable';

import { Button, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';

import { PaginatedList, SearchForm, Spinner, TableList } from 'components/common';

const ViewList = createReactClass({
  propTypes: {
    views: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.shape({
      total: PropTypes.number.isRequired,
      page: PropTypes.number.isRequired,
      perPage: PropTypes.number.isRequired,
    }).isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleViewExecution: PropTypes.func.isRequired,
    handleViewDelete: PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      views: [],
    };
  },

  getInitialState() {
    return {
      query: '',
      page: 1,
      perPage: 10,
    };
  },

  componentDidMount() {
    this.execSearch();
  },

  execSearch(resetLoadingState = () => {}) {
    const { query, page, perPage } = this.state;
    this.props.handleSearch(query, page, perPage, resetLoadingState);
  },

  handleSearch(query, resetLoadingState) {
    this.setState({ query: query, page: 1 }, () => {
      this.execSearch(resetLoadingState);
    });
  },

  handleSearchReset() {
    this.setState({ query: '', page: 1 }, () => {
      this.execSearch();
    });
  },

  handlePageChange(page, perPage) {
    this.setState({ page: page, perPage: perPage }, () => {
      this.execSearch();
    });
  },

  itemActionsFactory(view) {
    return (
      <ButtonToolbar>
        <Button bsStyle="primary" bsSize="xsmall" onClick={this.props.handleViewExecution(view)}>
          Execute
        </Button>
        <DropdownButton title="More Actions" id={`view-actions-dropdown-${view.id}`} bsSize="xsmall">
          <MenuItem disabled>Edit</MenuItem>
          <MenuItem divider />
          <MenuItem onSelect={this.props.handleViewDelete(view)}>Delete</MenuItem>
        </DropdownButton>
      </ButtonToolbar>
    );
  },

  render() {
    const list = this.props.views;

    if (list.length === 0) {
      return <Spinner text="Loading views..." />;
    }

    const items = list.map((view) => {
      return {
        id: view.id,
        title: view.title,
        description: view.summary,
      };
    });

    const { total, page, perPage } = this.props.pagination;
    return (
      <PaginatedList onChange={this.handlePageChange}
                     activePage={page}
                     totalItems={total}
                     pageSize={perPage}
                     pageSizes={[2, 10, 50, 100]}>
        <div style={{ marginBottom: 15 }}>
          <SearchForm onSearch={this.handleSearch}
                      onReset={this.handleSearchReset}
                      topMargin={0} />
        </div>
        <TableList items={Immutable.List(items)}
                   itemActionsFactory={this.itemActionsFactory}
                   enableFilter={false}
                   filterKeys={[]} />
      </PaginatedList>
    );
  },
});

export default ViewList;
