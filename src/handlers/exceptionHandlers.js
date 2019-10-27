class UserException extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserException';
    this.message = message;
  }
}
class ValidationException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationException';
    this.message = message;
  }
}
class PermissionException extends Error {
  constructor(message) {
    super(message);
    this.name = 'PermissionException';
    this.message = message;
  }
}
class DatabaseException extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseException';
    this.message = message;
  }
}
module.exports = {
  UserException,
  ValidationException,
  PermissionException,
  DatabaseException,
};
