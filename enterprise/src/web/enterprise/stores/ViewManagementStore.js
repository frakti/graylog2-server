import Reflux from 'reflux';

import fetch from 'logic/rest/FetchProvider';
import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';

const ViewActions = Reflux.createActions({
  search: { asyncResult: true },
});

const viewsUrl = URLUtils.qualifyUrl('/plugins/org.graylog.plugins.enterprise/views');

const ViewStore = Reflux.createStore({
  listenables: [ViewActions],

  views: [],
  pagination: {
    total: 0,
    count: 0,
    page: 1,
    perPage: 10,
  },

  getInitialState() {
    return {
      pagination: this.pagination,
      list: this.views,
    };
  },

  search(query, page = 1, perPage = 10, sortBy = 'title', order = 'asc') {
    const promise = fetch('GET', `${viewsUrl}?query=${query}&page=${page}&per_page=${perPage}&sort=${sortBy}&order=${order}`)
      .then((response) => {
        this.views = response.views;
        this.pagination = {
          total: response.total,
          count: response.count,
          page: response.page,
          perPage: response.per_page,
        };
        this.trigger({
          list: this.views,
          pagination: this.pagination,
        });

        return response;
      })
      .catch((error) => {
        UserNotification.error(`Fetching views failed with status: ${error}`,
          'Could not retrieve views');
      });

    ViewActions.search.promise(promise);
  },
});

export { ViewStore, ViewActions };
