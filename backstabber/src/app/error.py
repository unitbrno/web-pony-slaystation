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


class SlaystationException(Exception):

    CODES = StatusCodes

    def __init__(self, message, errors):
        super(SlaystationException, self).__init__(message)
        self.errors = errors
        self.status_code = SlaystationException.CODES.Internal
        self.message = message + ' ({})'.format(self.status_code)

    def __str__(self):
        return "{0}: {1}".format(
            self.__class__.__name__,
            self.message or 'no message'
        )

    @property
    def code(self) -> int:
        return self.status_code

    @property
    def response(self):
        return make_response(jsonify(
            dict(
                message=self.message,
                status_code=self.code,
                errors=self.errors
            )
        ), self.code)


class ValidationError(SlaystationException):
    def __init__(self, errors):
        super(ValidationError, self).__init__('Validation Error', errors)
        self.status_code = SlaystationException.CODES.InvalidArgument
