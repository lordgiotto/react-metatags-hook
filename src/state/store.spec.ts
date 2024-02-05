import { metaTagsStore } from './store';
import { MetaTagsModel } from '../types';

const metaTagsModelA: MetaTagsModel = {
  title: 'title',
  lang: 'en',
  tags: {
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
  },
};
const metaTagsModelB: MetaTagsModel = {
  title: 'title2',
  lang: 'it',
  tags: {
    'meta~name=viewport': {
      tag: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=2',
      },
      query: [{ key: 'name', value: 'viewport' }],
    },
    'link~rel=icon': {
      tag: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      query: [{ key: 'rel', value: 'icon' }],
    },
  },
};
const metaTagsModelC: MetaTagsModel = {
  title: 'title3',
  tags: {},
};

describe('State > Store', () => {
  let unsubscribeListener: () => void;
  let metas: MetaTagsModel;
  beforeAll(() => {
    unsubscribeListener = metaTagsStore.subscribe(
      (metasModel) => (metas = metasModel)
    );
  });
  afterAll(() => {
    unsubscribeListener();
  });
  afterEach(() => {
    metaTagsStore.clear();
  });
  describe('subscribeToStore()', () => {
    it('should return an unsubscribe function', () => {
      const unsubsribe = metaTagsStore.subscribe(() => {});
      expect(typeof unsubsribe).toBe('function');
    });
  });
  describe('getState()', () => {
    it('should return an empty store if nothing added', () => {
      expect(metaTagsStore.getState()).toEqual({ tags: {} });
    });
  });
  describe('when manipulated with', () => {
    describe('addMetasToStore()', () => {
      it('should add a model to the store and provide the resulting model to subscribers and via getState()', (done) => {
        const instanceIdA = Symbol('A');
        metaTagsStore.registerInstance(instanceIdA, 1700000000001);
        metaTagsStore.setInstanceMetaTags(instanceIdA, metaTagsModelA);
        expect(metaTagsStore.getState()).toEqual(metaTagsModelA);
        expect(metas).toEqual(metaTagsModelA);
        done();
      });
      it('should merge models (last take precedence) if more the one them is added to the store', (done) => {
        const instanceIdA = Symbol('A');
        const instanceIdB = Symbol('B');
        const instanceIdC = Symbol('C');
        const expected = {
          title: 'title2',
          lang: 'it',
          tags: {
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
                content: 'width=device-width, initial-scale=2',
              },
              query: [{ key: 'name', value: 'viewport' }],
            },
            'link~rel=icon': {
              tag: 'link',
              attributes: {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico',
              },
              query: [{ key: 'rel', value: 'icon' }],
            },
          },
        };
        metaTagsStore.registerInstance(instanceIdA, 1700000000001); // this is the first
        metaTagsStore.registerInstance(instanceIdB, 1700000000003); // this is the last
        metaTagsStore.registerInstance(instanceIdC, 1700000000002); // this is the second
        metaTagsStore.setInstanceMetaTags(instanceIdA, metaTagsModelA);
        metaTagsStore.setInstanceMetaTags(instanceIdB, metaTagsModelB);
        metaTagsStore.setInstanceMetaTags(instanceIdC, metaTagsModelC);
        expect(metaTagsStore.getState()).toEqual(expected);
        expect(metas).toEqual(expected);
        done();
      });
    });
    describe('removeMetasFromStore()', () => {
      it('should remove a model from the store and provide the resulting model to subscribers and via getState()', (done) => {
        const instanceIdA = Symbol('A');
        const emptyMetaTags = { tags: {} };
        const deregister = metaTagsStore.registerInstance(
          instanceIdA,
          1700000000001
        );
        metaTagsStore.setInstanceMetaTags(instanceIdA, metaTagsModelA);
        expect(metaTagsStore.getState()).toEqual(metaTagsModelA);
        expect(metas).toEqual(metaTagsModelA);
        deregister();
        expect(metaTagsStore.getState()).toEqual(emptyMetaTags);
        expect(metas).toEqual(emptyMetaTags);
        done();
      });
      it('should merge all the not removed models (last take precedence)', (done) => {
        const instanceIdA = Symbol('A');
        const instanceIdB = Symbol('B');
        const instanceIdC = Symbol('C');
        const expected = {
          title: 'title3',
          lang: 'en',
          tags: {
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
          },
        };
        metaTagsStore.registerInstance(instanceIdA, 1700000000001); // this is the first
        const deregisterMetaTagsB = metaTagsStore.registerInstance(
          instanceIdB,
          1700000000002
        ); // this is the second
        metaTagsStore.registerInstance(instanceIdC, 1700000000003); // this is the last
        metaTagsStore.setInstanceMetaTags(instanceIdA, metaTagsModelA);
        metaTagsStore.setInstanceMetaTags(instanceIdB, metaTagsModelB);
        metaTagsStore.setInstanceMetaTags(instanceIdC, metaTagsModelC);
        deregisterMetaTagsB();
        expect(metaTagsStore.getState()).toEqual(expected);
        expect(metas).toEqual(expected);
        done();
      });
    });
    describe('clearStore()', () => {
      it('should clear all the saved models in the store and provide an empty model to subscribers and via getState()', (done) => {
        const instanceIdA = Symbol('A');
        const instanceIdB = Symbol('B');
        const emptyMetaTags = { tags: {} };
        metaTagsStore.registerInstance(instanceIdA, 1700000000001); // this is the first
        metaTagsStore.registerInstance(instanceIdB, 1700000000002);
        metaTagsStore.setInstanceMetaTags(instanceIdA, metaTagsModelA);
        metaTagsStore.setInstanceMetaTags(instanceIdB, metaTagsModelB);
        metaTagsStore.clear();
        expect(metaTagsStore.getState()).toEqual(emptyMetaTags);
        expect(metas).toEqual(emptyMetaTags);
        done();
      });
    });
  });
});
