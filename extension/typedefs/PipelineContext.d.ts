import * as Logger from 'bunyan'

interface PipelineContext {
  config: PipelineConfiguration
  log: Logger
  meta: PipelineContextMeta
  device: PipelineContextDevice
  storage: PipelineStorageContainer
}

interface PipelineStorageGetCallback {
  (err: Error | null, value: string | number | Object): void
}

interface PipelineStorageDelCallback {
  (err: Error | null, value: string | number | Object): void
}

interface PipelineStorageSetCallback {
  (err: Error | null, value: string | number | Object): void
}

interface PipelineStorage {
  get(key: string, callback: PipelineStorageGetCallback) : void
  get(key: string) : Promise<string | number | Object>

  set(key: string, value: string | number | Object, callback: PipelineStorageSetCallback) : void
  set(key: string, value: string | number | Object) : Promise<void>

  del(key: string, callback: PipelineStorageDelCallback) : void | Promise<void>
  del(key: string) : Promise<void>
}

interface PipelineStorageContainer {
  user: PipelineStorage
  device: PipelineStorage
  extension: PipelineStorage
}

interface PipelineConfiguration {
  clientId: string
  accessToken: string
  storeHash: string
  clientSecret: string
}

interface PipelineContextMeta {
  userId?: string
  appId: string
}

interface PipelineContextDevice {
  getInfo() : PipelineContextDeviceInfo
}

/**
 * @see https://developer.shopgate.com/references/connect/extensions/steps/device-info
 */
interface PipelineContextDeviceInfo {
  clientType: string
  web : PipelineContextDeviceInfoWeb
}

interface PipelineContextDeviceInfoWeb {
  userAgent: string
  cookies: Object
}
