import requests
from flask import make_response, jsonify
from typing import Dict, Optional


class StatusCodes(object):
    OK = requests.codes.OK
    Canceled = requests.codes.REQUEST_TIMEOUT
    Unknown = requests.codes.INTERNAL_SERVER_ERROR
    InvalidArgument = requests.codes.BAD_REQUEST
    DeadlineExceeded = requests.codes.REQUEST_TIMEOUT
    NotFound = requests.codes.NOT_FOUND
    AlreadyExists = requests.codes.CONFLICT
    PermissionDenied = requests.codes.FORBIDDEN
    Unauthenticated = requests.codes.UNAUTHORIZED
    ResourceExhausted = requests.codes.FORBIDDEN
    FailedPrecondition = requests.codes.PRECONDITION_FAILED
    Aborted = requests.codes.CONFLICT
    OutOfRange = requests.codes.BAD_REQUEST
    Unimplemented = requests.codes.NOT_IMPLEMENTED
    Internal = requests.codes.INTERNAL_SERVER_ERROR
    Unavailable = requests.codes.SERVICE_UNAVAILABLE
    DataLoss = requests.codes.INTERNAL_SERVER_ERROR


class SlaystationExceptionMeta(type):
    """Shortcut for creating new exceptions
    """

    def __new__(mcs, name, bases, attrs, *,
                details=None, response_code=None):
        return type.__new__(mcs, name, bases, attrs)

    def __init__(cls, name, bases, attrs, *,
                 details=None, response_code=None):
        super(SlaystationExceptionMeta, cls).__init__(name, bases, attrs)


class SlaystationException(Exception,
                           metaclass=SlaystationExceptionMeta,
                           response_code=StatusCodes.Internal,
                           details=''):

    CODES = StatusCodes

    def __init__(self,
                 response_code=None,
                 details=None,
                 ):
        self._details = details or 'no description'
        self._code = response_code or SlaystationException.CODES.Internal
        self._json = dict(description=self._details) if self._details else dict()
        super(SlaystationException, self).__init__(self.__str__())

    def __str__(self):
        """:return: String representation of this exception, for logging
        """

        return "{0}: {1}".format(
            self.__class__.__name__,
            self.json.get('description', "<NO-DESCRIPTION>")
        )

    @property
    def details(self) -> Optional[str]:
        """Detailed information about exception"""
        return self._details

    @property
    def json(self) -> Dict[str, str]:
        """Json form of this exception"""
        return self._json

    @property
    def code(self) -> int:
        return self._code

    @property
    def response(self):
        return make_response(jsonify(self.json), self.code)


class ValidationError(
    SlaystationException,
    response_code=SlaystationException.CODES.InvalidArgument
):
    ...
