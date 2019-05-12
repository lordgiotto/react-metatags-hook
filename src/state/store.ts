import { MutableRefObject } from 'react'
import { MetaTagModel } from '../types'

type InstanceConfig = MutableRefObject<MetaTagModel>
type StoreListener = (metas: MetaTagModel) => void

const metaStore = new Set<InstanceConfig>()
const subscribers = new Set<StoreListener>()

// Given a set of hook's configs (the metaStore), merge them in the resulting metas model
const mergeInstanceConfigs = (configs: Set<InstanceConfig>): MetaTagModel =>
  Array.from(configs)
    .map(({ current }) => current)
    .reduce((acc, instanceConfig) => ({
      ...acc,
      ...instanceConfig,
      tags: {
        ...acc.tags,
        ...instanceConfig.tags,
      },
    }), {} as MetaTagModel)
const emitChanges = (config: MetaTagModel) => {
  subscribers.forEach(listener => listener(config))
}

// Public
export const addMetasToStore = (instanceConfig: InstanceConfig) => {
  !metaStore.has(instanceConfig) && metaStore.add(instanceConfig)
  emitChanges(mergeInstanceConfigs(metaStore))
}
export const removeMetasFromStore = (instanceConfig: InstanceConfig) => {
  metaStore.delete(instanceConfig)
  emitChanges(mergeInstanceConfigs(metaStore))
}
export const subscribeToStore = (listener: StoreListener) => {
  subscribers.add(listener)
  return () => {
    subscribers.delete(listener)
  }
}
export const getState = () =>
  mergeInstanceConfigs(metaStore)
