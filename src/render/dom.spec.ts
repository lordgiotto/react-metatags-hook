import { updateDom } from './dom';
import { wait } from '../helpers/patience';

const tags = {
  'meta~name=description': {
    tag: 'meta',
    attributes: {
      name: 'description',
      content: 'a description',
    },
    query: [{ key: 'name', value: 'description' }],
  },
  'meta~charset=utf8': {
    tag: 'meta',
    attributes: {
      charset: 'utf8',
    },
    query: [{ key: 'charset', value: 'utf8' }],
  },
  'meta~name=viewport': {
    tag: 'meta',
    attributes: {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    query: [{ key: 'name', value: 'viewport' }],
  },
  'link~rel=apple-touch-icon~sizes=152x152': {
    tag: 'link',
    attributes: {
      rel: 'apple-touch-icon',
      sizes: '152x152',
      href: './icon152.png',
    },
    query: [
      { key: 'rel', value: 'apple-touch-icon' },
      { key: 'sizes', value: '152x152' },
    ],
  },
};

describe('Render > DOM', () => {
  describe('updateDom()', () => {
    const resetDom = () => {
      document.title = '';
      document.documentElement.lang = '';
      document.head.innerHTML = '';
    };
    beforeAll(resetDom);
    afterEach(resetDom);
    it('should add the title tag', async () => {
      updateDom({ title: 'ABC', tags: {} });
      await wait(0);
      expect(document.title).toBe('ABC');
    });
    it('should set document language', async () => {
      updateDom({ lang: 'en-gb', tags: {} });
      await wait(0);
      expect(document.documentElement.lang).toBe('en-gb');
    });
    it('should set meta tags', async () => {
      updateDom({ tags });
      await wait(0);
      const metas = document.head.querySelectorAll('meta');
      const links = document.head.querySelectorAll('link');
      const descriptionTag = document.head.querySelector(
        'meta[name="description"]'
      )!;
      const charsetTag = document.head.querySelector('meta[charset="utf8"]')!;
      const viewPortTag = document.head.querySelector('meta[name="viewport"]')!;
      const appleIconTag = document.head.querySelector(
        'link[rel="apple-touch-icon"]'
      )!;
      expect(metas).toHaveLength(3);
      expect(links).toHaveLength(1);
      expect(charsetTag).toBeTruthy();
      expect(descriptionTag.getAttribute('content')).toBe('a description');
      expect(viewPortTag.getAttribute('content')).toBe(
        'width=device-width, initial-scale=1'
      );
      expect(appleIconTag.getAttribute('sizes')).toBe('152x152');
      expect(appleIconTag.getAttribute('href')).toBe('./icon152.png');
    });
    it('should remove tags if not present in a subsequent update', async () => {
      updateDom({ tags });
      await wait(0);
      const charsetTag = document.head.querySelector('meta[charset="utf8"]')!;
      const viewPortTag = document.head.querySelector('meta[name="viewport"]')!;
      const appleIconTag = document.head.querySelector(
        'link[rel="apple-touch-icon"]'
      )!;
      expect(charsetTag).toBeTruthy();
      expect(viewPortTag).toBeTruthy();
      expect(appleIconTag).toBeTruthy();
      updateDom({
        tags: {
          'meta~charset=utf8': {
            tag: 'meta',
            attributes: {
              charset: 'utf8',
            },
            query: [{ key: 'charset', value: 'utf8' }],
          },
        },
      });
      await wait(0);
      const charsetTagNew = document.head.querySelector(
        'meta[charset="utf8"]'
      )!;
      const viewPortTagNew = document.head.querySelector(
        'meta[name="viewport"]'
      )!;
      const appleIconTagNew = document.head.querySelector(
        'link[rel="apple-touch-icon"]'
      )!;
      expect(charsetTagNew).toBeTruthy();
      expect(viewPortTagNew).toBeFalsy();
      expect(appleIconTagNew).toBeFalsy();
    });
    it('should update dom elements instead of recreate them if same tags are provided', async () => {
      updateDom({
        tags: {
          'meta~name=viewport': {
            tag: 'meta',
            attributes: {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
            },
            query: [{ key: 'name', value: 'viewport' }],
          },
        },
      });
      await wait(0);
      const viewPortTag1 = document.head.querySelector(
        'meta[name="viewport"]'
      )!;
      updateDom({
        tags: {
          'meta~name=viewport': {
            tag: 'meta',
            attributes: {
              name: 'viewport',
              content: 'width=device-width, initial-scale=2',
            },
            query: [{ key: 'name', value: 'viewport' }],
          },
        },
      });
      await wait(0);
      const viewPortTag2 = document.head.querySelector(
        'meta[name="viewport"]'
      )!;
      expect(viewPortTag1).toBe(viewPortTag2);
      expect(viewPortTag2.getAttribute('content')).toBe(
        'width=device-width, initial-scale=2'
      );
    });
    it('should debounce the dom update for the specified time', async () => {
      updateDom({
        title: 'Eager Title',
        tags: {},
      });
      await wait(0);
      updateDom(
        {
          title: 'Nonexistent Title',
          tags: {},
        },
        20
      );
      updateDom(
        {
          title: 'Lazy Title',
          tags: {},
        },
        20
      );
      await wait(0);
      expect(document.title).toBe('Eager Title');
      await wait(25);
      expect(document.title).toBe('Lazy Title');
    });
  });
});
