export default class Pagination{
  constructor(element, options){
    this.el = element;
    this.elPagesList = null;
    this._setOptions(options);
    this._setClassNames();
    this._setClickHandler(this.el);
    this.disablePageClick = false;
  }

  _setOptions(customOptions){
    const defaultOptions = {
      pageRangeDisplayed: 5,
      baseClass: 'pagination',
      pagesListClassSufix: 'pages-list',
      btnClassSufix: 'btn',
      btnActiveClass: 'is-active',
      btnMoreText: '...',
      showArrows: true,
      onClick: undefined
    };
    this.options = Object.assign({}, defaultOptions, customOptions);
  }

  _setClassNames(){
    // Define class names by options
    const { baseClass, btnClassSufix, btnActiveClass, pagesListClassSufix } = this.options;
    this._classNames = {
      base: baseClass,
      btn: `${baseClass}--${btnClassSufix}`,
      btnActive: btnActiveClass,
      pagesList: `${baseClass}--${pagesListClassSufix}`
    }
  }

  _setClickHandler(el){
    el.addEventListener('click', (e) => {
      if ( e.target.classList.contains(this._classNames.btn) ){
        this._clickHandler(e);
      }
    });
  }

  _setBaseElements(){
    const arrowPrev = (this.options.showArrows) ? this._getBtnHTML('prev') : '';
    const arrowNext = (this.options.showArrows) ? this._getBtnHTML('next') : '';
    const pagesList = `<span class="${this._classNames.pagesList}"></span>`;
    this.el.innerHTML = `<div class="${this._classNames.base}">
                          ${arrowPrev}
                          ${pagesList}
                          ${arrowNext}
                        </div>`;
    this.elPagesList = this.el.querySelector(`.${this._classNames.pagesList}`);
  }

  _getBtnHTML(action, text){
    return `<span
              class="${this._classNames.btn}"
              data-action="${action}"
              data-text="${text}">
                ${text || ''}
            </span>`;
  }

  _setPagesRangesReference(total){
    const totalRanges = Math.ceil(total / this.options.pageRangeDisplayed);
    // Create collection with number of ranges
    this.pageRanges = [];
    // Fill each one with an new array
    for (let i = 0; i < totalRanges; i++) {
      this.pageRanges[i] = [];
    }
    // Place all page number at the correspondent range collection
    for (let i = 0; i < total; i++) {
      var rangeIndex = Math.floor(i / this.options.pageRangeDisplayed);
      this.pageRanges[rangeIndex].push(i + 1);
    }
  }

  _setButtonsRange(rangeIndex){
    const numbers = this.pageRanges[rangeIndex];
    let numbersHTML = this._getNumbersHTML(numbers);
    if( this.pageRanges.length > 1 ){
      numbersHTML = this._placeMoreButton(numbersHTML, rangeIndex);
    }
    this.elPagesList.innerHTML = numbersHTML;
    // Setting buttons range reference
    this._currentButtonsRangeIndex = rangeIndex;
    this._activePageButton(this._currentActiveButton);
  }

  _getNumbersHTML(numbers){
    return numbers.map((n) => this._getBtnHTML('page', n)).join('');
  }

  _placeMoreButton(numbersHTML, pagesRangeIndex){
    const moreBtn = this._getBtnHTML('more', '...');
    const lessBtn = this._getBtnHTML('less', '...');
    // First range of numbers
    if ( pagesRangeIndex === 0 ){
      numbersHTML += moreBtn;
    // Last range of numbers, so add 'more' button at the start
    } else if ( pagesRangeIndex === this.pageRanges.length - 1 ){
      numbersHTML = lessBtn + numbersHTML;
    // Other ranges, add 'less' and 'more' buttons
    } else {
      numbersHTML = lessBtn + numbersHTML + moreBtn;
    }
    return numbersHTML;
  }

  _clickHandler(e){
    e.preventDefault();
    const { action } = e.target.dataset;
    switch (action) {
      case 'less' :
        return this._lessHandler(e);
      case 'more' :
        return this._moreHandler(e);
      case 'page' :
        return this._pageHandler(e);
      case 'prev' :
        return this._prevHandler(e);
      case 'next' :
        return this._nextHandler(e);
    }
  }

  _lessHandler(e){
    this._setButtonsRange(this._currentButtonsRangeIndex - 1);
  }

  _moreHandler(e){
    this._setButtonsRange(this._currentButtonsRangeIndex + 1);
  }

  _pageHandler(e){
    e.preventDefault();
    if( !e.target.classList.contains(this._classNames.btnActive) &&
        !this.disablePageClick ){
          const pageNumber = parseInt(e.target.dataset.text);
          this._triggerNextPage(pageNumber);
        }
  }

  _prevHandler(){
    if( this._currentActiveButton > 1 && !this.disablePageClick ){
      let nextPage, nextRangeNum;
      // Check if the current active page is the last of its range
      if (this._isFirstRangeItem()){
        nextRangeNum = this._currentButtonsRangeIndex - 1;
        const nextRange = this.pageRanges[nextRangeNum];
        // Next page is the last item of next selected range
        nextPage = nextRange[nextRange.length - 1];
      } else {
        nextPage = this._currentActiveButton - 1;
      }
      this._triggerNextPage(nextPage, nextRangeNum);
    }
  }

  _nextHandler(){
    if( this._currentActiveButton !== this._totalPages && !this.disablePageClick ){
      let nextPage, nextRangeNum;
      // Check if the current active page is the last of its range
      if (this._isLastRangeItem()){
        nextRangeNum = this._currentButtonsRangeIndex + 1;
        const nextRange = this.pageRanges[nextRangeNum];
        nextPage = nextRange[0];
      } else {
        nextPage = this._currentActiveButton + 1;
      }
      this._triggerNextPage(nextPage, nextRangeNum);
    }
  }

  _triggerNextPage(pageNumber, nextPageRangeNumber){
    // Check if is necessary to force load pageNumber range
    // Check if page number received isn't inside the current page range
    if( !this._isPageInCurrentRange(pageNumber) ){
      nextPageRangeNumber = this._findRangeNumberOfPage(pageNumber);
    }
    // Render next page range if necessary
    if(nextPageRangeNumber !== undefined){
      this._setButtonsRange(nextPageRangeNumber);
    }
    // Active page number
    this._activePageButton(pageNumber);
    // Trigger configured click event
    if(this.options.onClick){
      this.options.onClick(pageNumber);
    }
  }

  _getCurrentRange(){
    return this.pageRanges[this._currentButtonsRangeIndex];
  }

  _isFirstRangeItem(){
    return this._getCurrentRange()[0] === this._currentActiveButton;
  }

  _isLastRangeItem(){
    const currRange = this._getCurrentRange();
    return currRange[currRange.length - 1] === this._currentActiveButton;
  }

  _isPageInCurrentRange(pageNum){
    return this.pageRanges[this._currentButtonsRangeIndex].indexOf(pageNum) > -1;
  }

  _findRangeNumberOfPage(pageNum){
    let rangeIndex;
    this.pageRanges.find((g, gIndex) => {
      rangeIndex = gIndex;
      return g.indexOf(pageNum) > -1; // This will stop the iteration
    });
    return rangeIndex;
  }

  _activePageButton(btnNumber){
    const activeButton = this.elPagesList.querySelector(`.${this._classNames.btnActive}`);
    const newActiveButton = this.elPagesList.querySelector(`[data-text='${btnNumber}']`);
    // Remove active class from the current active button
    if (activeButton) activeButton.classList.remove(this._classNames.btnActive);
    // Highlight the new active button
    if (newActiveButton) newActiveButton.classList.add(this._classNames.btnActive);
    // Setting reference of current active page button
    this._currentActiveButton = btnNumber;
  }

  _showPagination(show = true){
    this.el.style.display = show ? 'block' : 'none';
  }

  setButtons(totalPages, activeFirst = true){
    if(totalPages === 0){
      return this._showPagination(false);
    }
    this._showPagination();
    if(activeFirst){
      this._currentActiveButton = 1;
    }
    this._totalPages = totalPages;
    this._setPagesRangesReference(totalPages);
    this._setBaseElements();
    this._setButtonsRange(0);
  }

  disable(disable = true){
    this.disablePageClick = disable;
  }

}
