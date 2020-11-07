import { default as createAdapter } from './adapter'
import redis from 'redis'
/**
 * @param {object} config
 * @returns {object}
 */
export function RedisCacheAdapter (config) {
  /**
   * @param {object} env
   */
  function load() {
    return { url: config.REDIS }
  }

  /**
   * @param {object} env
   * @returns {function}
   */
  function link(env) {
    /**
     * @param {object} adapter
     * @returns {object}
     */
    return function () {
      // create client
      const client = redis.createClient(env)
      return createAdapter(client)
    }
  }

  return Object.freeze({
    id: 'redis-cache-adapter',
    port: 'cache',
    load,
    link
  })
}