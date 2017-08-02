export default class Pagination{
  constructor($element, options){
    this.$el = $element;
    this.$elButtons = null;
    this._setOptions(options);
    this._setClickHandler(this.$el);
    this.disablePageClick = false;
  }

  _setOptions(customOptions){
    const defaultOptions = {
      pagesGroupSize: 5,
      btnClass: 'pagination-btn',
      btnActiveClass: 'is-active',
      btnListClass: 'pagination-btn-wrap',
      btnMoreText: '...',
      showArrows: true,
      onClick: undefined
    };
    this.options = Object.assign({}, defaultOptions, customOptions);
  }

  _setClickHandler($el){
    $el.on('click', '.' + this.options.btnClass, (e) => this._clickHandler(e));
  }

  _setBaseElements(){
    const arrowPrev = (this.options.showArrows) ? this._getBtnHTML('prev') : '';
    const arrowNext = (this.options.showArrows) ? this._getBtnHTML('next') : '';
    const btnWrapper = `<span class="${this.options.btnListClass}"></span>`;
    this.$el.html(`${arrowPrev} ${btnWrapper} ${arrowNext}`);
    this.$elButtons = this.$el.find(`.${this.options.btnListClass}`);
  }

  _getBtnHTML(action, text){
    return `<span
              class="${this.options.btnClass}"
              data-action="${action}"
              data-text="${text}">
                ${text || ''}
            </span>`;
  }

  _setPagesGroupsReference(total){
    const totalGroups = Math.ceil(total / this.options.pagesGroupSize);
    // Create collection with number of groups
    this.pageGroups = [];
    // Fill each one with an new array
    for (let i = 0; i < totalGroups; i++) {
      this.pageGroups[i] = [];
    }
    // Place all page number at the correspondent group collection
    for (let i = 0; i < total; i++) {
      var groupIndex = Math.floor(i / this.options.pagesGroupSize);
      this.pageGroups[groupIndex].push(i + 1);
    }
  }

  _setButtonsGroup(groupIndex){
    const numbers = this.pageGroups[groupIndex];
    let numbersHTML = this._getNumbersHTML(numbers);
    if( this.pageGroups.length > 1 ){
      numbersHTML = this._placeMoreButton(numbersHTML, groupIndex);
    }
    this.$elButtons.html(numbersHTML);
    // Setting buttons group reference
    this._currentButtonGroup = groupIndex;
    this._activePageButton(this._currentActiveButton);
  }

  _getNumbersHTML(numbers){
    return numbers.map((n) => this._getBtnHTML('page', n)).join('');
  }

  _placeMoreButton(numbersHTML, pagesGroupIndex){
    const moreBtn = this._getBtnHTML('more', '...');
    const lessBtn = this._getBtnHTML('less', '...');
    // First group of numbers
    if ( pagesGroupIndex === 0 ){
      numbersHTML += moreBtn;
    // Last group of numbers, so add 'more' button at the start
    } else if ( pagesGroupIndex === this.pageGroups.length - 1 ){
      numbersHTML = lessBtn + numbersHTML;
    // Other groups, add 'less' and 'more' buttons
    } else {
      numbersHTML = lessBtn + numbersHTML + moreBtn;
    }
    return numbersHTML;
  }

  _clickHandler(e){
    e.preventDefault();
    const { action } = e.currentTarget.dataset;
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
    this._setButtonsGroup(this._currentButtonGroup - 1);
    console.log('Click!', e);
  }

  _moreHandler(e){
    this._setButtonsGroup(this._currentButtonGroup + 1);
    console.log('Click!', e);
  }

  _pageHandler(e){
    e.preventDefault();
    if( !e.currentTarget.classList.contains(this.options.btnActiveClass) &&
        !this.disablePageClick ){
          const pageNumber = parseInt(e.currentTarget.dataset.text);
          this._triggerNextPage(pageNumber);
        }
  }

  _prevHandler(){
    if( this._currentActiveButton > 1 && !this.disablePageClick ){
      console.log("Is first of group", this._isfirstGroupItem());
      let nextPage, nextGroupNum;
      // Check if the current page is the last of its group
      if (this._isfirstGroupItem()){
        nextGroupNum = this._currentButtonGroup - 1;
        const nextGroup = this.pageGroups[nextGroupNum];
        // Next page is the last item of next selected group
        nextPage = nextGroup[nextGroup.length - 1];
      } else {
        nextPage = this._currentActiveButton - 1;
      }
      this._triggerNextPage(nextPage, nextGroupNum);
    }
  }

  _nextHandler(){
    if( this._currentActiveButton !== this._totalPages && !this.disablePageClick ){
      console.log("Is last of group", this._isLastGroupItem());
      let nextPage, nextGroupNum;
      // Check if the current page is the last of its group
      if (this._isLastGroupItem()){
        nextGroupNum = this._currentButtonGroup + 1;
        const nextGroup = this.pageGroups[nextGroupNum];
        nextPage = nextGroup[0];
      } else {
        nextPage = this._currentActiveButton + 1;
      }
      this._triggerNextPage(nextPage, nextGroupNum);
    }
  }

  _triggerNextPage(pageNumber, nextPageGroupNumber){
    // Check if is necessary to force load pageNumber group
    // Check if page number received isn't inside the current page group
    if( !this._isPageInCurrentGroup(pageNumber) ){
      nextPageGroupNumber = this._findGroupNumberOfPage(pageNumber);
    }
    // Render next page group if necessary
    if(nextPageGroupNumber !== undefined){
      this._setButtonsGroup(nextPageGroupNumber);
    }
    // Active page number
    this._activePageButton(pageNumber);
    // Trigger configured click event
    if(this.options.onClick){
      this.options.onClick(pageNumber);
    }
  }

  _isfirstGroupItem(){
    let currGroup = this.pageGroups[this._currentButtonGroup];
    return currGroup[0] === this._currentActiveButton;
  }

  _isLastGroupItem(){
    let currGroup = this.pageGroups[this._currentButtonGroup];
    return currGroup[currGroup.length - 1] === this._currentActiveButton;
  }

  _isPageInCurrentGroup(pageNum){
    return this.pageGroups[this._currentButtonGroup].indexOf(pageNum) > -1;
  }

  _findGroupNumberOfPage(pageNum){
    let groupIndex;
    this.pageGroups.find((g, gIndex) => {
      groupIndex = gIndex;
      return g.indexOf(pageNum) > -1; // This will stop the iteration
    });
    return groupIndex;
  }

  _activePageButton(btnNumber){
    this.$elButtons
      .find('.' + this.options.btnClass)
      .filter(`[data-text=${btnNumber}]`)
      .addClass(this.options.btnActiveClass)
      .siblings()
      .removeClass(this.options.btnActiveClass);
    // Setting reference of current active page button
    this._currentActiveButton = btnNumber;
  }

  _showPagination(show = true){
    this.$el[show ? 'show' : 'hide']();
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
    this._setPagesGroupsReference(totalPages);
    this._setBaseElements();
    this._setButtonsGroup(0);
  }

  disable(disable = true){
    this.disablePageClick = disable;
  }

}
