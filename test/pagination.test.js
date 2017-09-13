import Pagination from '../dist/pagination_class.js';

const activeClass = 'is-active';

let pagination;
let paginationEl;

// Helpers
const initPagination = () => {
  // inject the HTML fixture for the tests
  const fixture = '<div id="pagination"></div>';
  document.body.insertAdjacentHTML('afterbegin', fixture);
  return document.getElementById('pagination');
};

const getElText = (text = paginationEl.textContent) => {
  return text
    .replace(/ /g, '')
    .replace(/\n\n/g, ' ')
    .replace(/\n/g, '')
    .trim();
}

// Tests
describe('Pagination class', function() {

  beforeEach(function() {
    paginationEl = initPagination();
    pagination   = new Pagination(paginationEl);
  });

  describe('on INIT', function() {
    it('should contains arrows and 1, 2 and 3 page numbers', function() {
      pagination.setButtons(3);
      expect(getElText()).to.equal('< 1 2 3 >');
    });
  });
});
