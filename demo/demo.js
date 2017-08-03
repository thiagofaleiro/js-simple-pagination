'use strict'

import Pagination from '../dist/pagination_class';

(function demo(){
  const paginationEl = document.getElementById('pagination');
  const pagination = new Pagination( paginationEl );
  pagination.setButtons(12);

  console.dir('Pagination element >>', paginationEl);
  console.log('Pagination class >>', pagination);
}());
