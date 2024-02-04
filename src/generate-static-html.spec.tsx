/**
 * @jest-environment node
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import useMetaTags from './use-meta-tags';

import { generateStaticHtml, resetMetaTags } from './generate-static-html';

describe('generateStaticHtml', () => {
  const App1 = () => {
    useMetaTags(
      {
        title: 'A Title',
      },
      []
    );
    return <div>App1</div>;
  };
  const App2 = () => {
    useMetaTags(
      {
        description: 'A Description',
      },
      []
    );
    return <div>App2</div>;
  };
  describe('when the component is rendered as a string', () => {
    it('should return the html markup of the defined meta tags', () => {
      ReactDOMServer.renderToString(<App1 />);
      expect(generateStaticHtml()).toBe('<title>A Title</title>');
    });
  });
  describe('when multiple components are rendered as string', () => {
    beforeEach(() => {
      resetMetaTags();
    });
    it('should accumulate the tags of all the render apps, if state is not resetted', () => {
      ReactDOMServer.renderToString(<App1 />);
      expect(generateStaticHtml()).toBe('<title>A Title</title>');
      ReactDOMServer.renderToString(<App2 />);
      expect(generateStaticHtml()).toBe(
        '<title>A Title</title><meta name="description" content="A Description" />'
      );
    });
    it('should not accumulate the tags of all the render apps, if state is resetted', () => {
      ReactDOMServer.renderToString(<App1 />);
      expect(generateStaticHtml()).toBe('<title>A Title</title>');
      resetMetaTags();
      ReactDOMServer.renderToString(<App2 />);
      expect(generateStaticHtml()).toBe(
        '<meta name="description" content="A Description" />'
      );
    });
  });
});
