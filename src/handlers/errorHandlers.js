/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = fn =>
  function(req, res, next) {
    return fn(req, res, next).catch(next);
  };

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

/*
  Development Error Hanlder

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    ),
  };
  res.status(err.status || 500);
  res.format({
    // Based on the `Accept` http header
    'text/html': () => {
      res.render('error', errorDetails);
    }, // Form Submit, Reload the page
    'application/json': () => res.json(errorDetails), // Ajax call, send JSON back
  });
};

/*
  Production Error Hanlder

  No stacktraces are leaked to user
*/
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
};

exports.joiErrors = errors => {
  errors.forEach(err => {
    switch (err.code) {
      // case 'any.empty':
      //   err.message = `Erro em ${err.local.label}. O valor não pode ser vazio`;
      //   break;
      // case 'any.required':
      //   err.message = `${err.local.label} é obrigatório`;
      //   break;
      // case 'string.min':
      //   err.message = `Erro em ${err.local.label}. O valor deve ter no mínimo ${err.local.limit} caracteres.`;
      //   break;
      // case 'string.max':
      //   err.message = `Erro em ${err.local.label}. O valor não deve exceder ${err.local.limit} caracteres.`;
      //   break;
      // case 'string.email':
      //   err.message = `Erro em ${err.local.label}. Valor inválido.`;
      //   break;
      default:
        break;
    }
  });
  return errors;
};
