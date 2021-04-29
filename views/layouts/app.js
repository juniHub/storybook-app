/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'juni-storybook',
  searchClient: algoliasearch('2UZGCMHPPF', 'a73c22e0362c988865be6b1306fe7b69'),
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'tags',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <div>
          <img src="{{image}}" align="left" alt="{{title}}" />
          <div class="hit-title">
            {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
          </div>
          <div class="hit-body">
            {{#helpers.highlight}}{ "attribute": "body" }{{/helpers.highlight}}
          </div>
          <div class="hit-tags">\${{tags}}</div>
        </div>
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
