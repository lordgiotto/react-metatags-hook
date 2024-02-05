import { MetaTagsModel } from '../types';

export type MetaTagsInstanceId = string | number | symbol;
export type MetaTagsInstance = {
  instanceTs: number;
  metaTagsModel?: MetaTagsModel;
};
export type StoreListener = (metas: MetaTagsModel) => void;

class MetaTagsStore {
  private store: Map<MetaTagsInstanceId, MetaTagsInstance> = new Map();
  private mergedMetatags: MetaTagsModel = { tags: {} };
  private subscribers: Set<StoreListener> = new Set();

  public registerInstance(instanceId: MetaTagsInstanceId, instanceTs: number) {
    if (!this.store.has(instanceId)) {
      this.store.set(instanceId, {
        instanceTs: instanceTs,
      });
    }
    return () => {
      this.store.delete(instanceId);
      this.saveAndEmit();
    };
  }

  public setInstanceMetaTags(
    instanceId: MetaTagsInstanceId,
    metaTags: MetaTagsModel
  ) {
    const oldInstance = this.store.get(instanceId);
    if (oldInstance) {
      this.store.set(instanceId, {
        ...oldInstance,
        metaTagsModel: metaTags,
      });
      this.saveAndEmit();
    }
  }

  public clear() {
    this.store.clear();
    this.saveAndEmit();
  }

  public getState() {
    return this.mergedMetatags;
  }

  public subscribe(listener: StoreListener) {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  private saveAndEmit() {
    this.mergedMetatags = this.mergeStoreInstances();
    this.subscribers.forEach((listener) => listener(this.mergedMetatags));
  }

  private mergeStoreInstances() {
    return Array.from(this.store.values())
      .filter(
        (metaTagInstance): metaTagInstance is Required<MetaTagsInstance> =>
          !!metaTagInstance.metaTagsModel
      )
      .sort((a, b) => a.instanceTs - b.instanceTs)
      .reduce<MetaTagsModel>(
        (acc, { metaTagsModel }) => ({
          title: metaTagsModel.title ?? acc.title,
          lang: metaTagsModel.lang ?? acc.lang,
          tags: {
            ...acc.tags,
            ...metaTagsModel.tags,
          },
        }),
        { tags: {} }
      );
  }
}

export const metaTagsStore = new MetaTagsStore();
