simple js pagination
=============================================

This is vanilla javascript very simple pagination widget. Basically it's a ES6 class which you can import to your project and use many times you need, even on the same page. Also it doesn't have depencies.

Installing
----------
`
npm install simple-js-pagination --save
`

Using
-----

#### Markup

Just add a HTML element, like:

```html
<div id="pagination"></div>
```

#### Javascript

Just import the module and instantiate it.

```javascript
import Pagination from '../dist/pagination_class';

const paginationEl = document.getElementById('pagination');
const pagination = new Pagination(paginationEl);

// Showing pages by setting the max number
pagination.setButtons(12);
```

Options
-------

Name | Type | Default | Description
--- | --- | --- | --- |
**pageRangeDisplayed** | Number | 5 | Max count of page numbers to display per group (range)
**baseClass** | String | 'pagination' | Default class name for the wrapper element, a `div` tag.
**pagesListClassSufix** | String | 'pages-list' | Default class sufix for the list of page numbers. This will be composed with the base class producing the default class name: `pagination--pages-list`.
**btnClassSufix** | String | 'btn' | Default class sufix for each pagination button, of any type: number, arrow, dots. This will be composed with the base class producing the default class name: `pagination--btn`.
**btnActiveClass** | String | 'is-active' | Class added to active page number.
**btnMoreText** | String | '...' | Text of buttons do jump to previous and next range of pages.
**showArrows** | Boolean | true | Show arrows to jump to previous or next page.
**onClick** | Function | null | Function to be executed when the user clicks on page number. Arguments: `pageNumber`
