// Responsible for handling observed latency for each operation.
export const observedLatencyHelper = () => {
  'use strict';

  return {
    getDaysSinceObservationTime: function (observationTimestamp) {
      var observationDate = new Date(observationTimestamp).getTime()
      var currentDate = Date.now()
      const oneDay = 1000 * 60 * 60 * 24

      return Math.floor(Math.abs(currentDate - observationDate) / oneDay)
    },
    // Creates a new object but with each key turned into lowercase string.
    convertKeysToLowercase: function(object) {
      var keys = Object.keys(object);
      var newObject = {};
      keys.forEach(function (element) {
        newObject[element.toLowerCase()] = object[element];
      });

      return newObject;
    },
    getObservedLatenciesAsync: function (callback) {
      jQuery.ajax({
        // TODO: Add observed latency service url.
        url: "",
        dataType: 'json',
        type: 'GET',
        success: function (data) {
          callback(data);
        },
        error: function (error) {
          // TODO: Log error to app insights.
        }
      });
    }
  };
}
