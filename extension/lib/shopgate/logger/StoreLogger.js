class StoreLogger {
  /**
   * @param {ContextLog} contextLog
   */
  constructor (contextLog) {
    this._contextLog = contextLog
    this._startTime = new Date()
  }

  /**
   * @param {Object} metaData
   * @param {string} message
   */
  logInfo (metaData, message) {
    this._contextLog.info(metaData, message)
  }

  /**
   * @param {string} message
   */
  logDebug (message) {
    this._contextLog.debug(message)
  }

  /**
   * @param {string} message
   * @param {Error} error
   */
  logError (message, error) {
    this._contextLog.error(message, error)
  }

  /**
   * @param {Date} startTime
   * @param {Date} endTime
   * @param {string} description
   * @return {TimeLogMetaData}
   */
  static _createTimeLongMetaObject (startTime, endTime, description) {
    let duration = endTime - startTime
    return {duration: duration, description: description}
  }

  startTimmer () {
    this._startTime = new Date()
  }

  logTime (description) {
    this._contextLog.info(this._createTimeLongMetaObject(this._startTime, new Date(), description), 'BigCommerce API Call Time Measurement')
  }
}

module.exports = StoreLogger
