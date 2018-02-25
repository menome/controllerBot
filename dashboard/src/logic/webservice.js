/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * We make all our web requests through here.
 * Currently using the new Fetch API.
 */
// Singleton class.
export default (() => {
  // Handles the result of an API call.
  // Gives a promise returning {response: <data>, body: <data>}
  function handleResult(response, opts){
    var retVal = {response, body: {}};

    return response.json()
      .then((val) => {
        retVal.body = val;
        return retVal;
      }).catch((err) => {
        return retVal;
      });
  }

  // Fetch doesn't throw errors on non-200/300 status codes. This fixes that.
  function handleHttpError(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  function getParamStr(obj) {
    if(!obj) return "";
    var qs = new URLSearchParams();
    Object.keys(obj).forEach(key => qs.set(key, obj[key]));
    return "?"+qs.toString();
  }

  return {
    get: function(url, params) {
      var paramStr = getParamStr(params);
      
      return fetch(url + paramStr, {
        method: "GET",
      }).then(handleHttpError).then(handleResult);
    },
    post: function(url, body, params) {
      var paramStr = getParamStr(params);

      return fetch(url + paramStr, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {"Content-Type": "application/json"},
      }).then(handleHttpError).then(handleResult);
    },
    delete: function(url, params) {
      var paramStr = getParamStr(params);

      return fetch(url+paramStr, {
        method: "DELETE",
      }).then(handleHttpError).then(handleResult);
    },
    put: function(url, body, params) {
      var paramStr = getParamStr(params);

      return fetch(url+paramStr, {
        method: "PUT",
        body: body,
      }).then(handleHttpError).then(handleResult);
    },
    navPost: function(url, params, method) {
      post(url, params)
    }
  }

  // Creates a hidden form element. Allows us to post to redirect the browser.
  // Stolen from http://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit
  function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
  }
})();