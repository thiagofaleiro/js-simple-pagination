'use strict'

import jQuery from 'jquery';
import Pagination from '../dist/pagination_class';


(function demo($){

  const pagination = new Pagination( $('#pagination') );
  pagination.setButtons(12);
  console.log('Pagination 2', $('#pagination'), pagination);

}(jQuery));
