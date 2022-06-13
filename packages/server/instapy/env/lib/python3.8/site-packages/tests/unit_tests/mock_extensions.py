import json
import typing  # noqa

import mock


class MockValidator(object):

  def __init__(self, validator):
    # validator is a function that takes a single argument and returns a bool.
    self.validator = validator

  def __eq__(self, other):
    return bool(self.validator(other))


def mock_string_should_end_with(val):  # type: (str) -> MockValidator
  return MockValidator(lambda x: x.endswith(val))


def mock_request(mock_http_client, json_response=None, json_responses=None):
  # type: (mock.Mock, str, typing.List[str]) -> mock.Mock
  if json_response and json_responses:
    raise Exception('Either json_response or json_responses is allowed')
  elif json_response:
    json_responses = [json_response]

  # The client does the "get all models" request on initialization. This is the response returned.
  initial_get_models_response = """
{
  "app_id": "",
  "models": []
}
"""
  json_responses = [initial_get_models_response] + json_responses

  mock_execute_request = mock_http_client.return_value.execute_request
  mock_execute_request.side_effect = [json.loads(r) for r in json_responses]
  return mock_execute_request


def assert_request(mock_execute_request, method, url, json_body='{}'):
  # type: (mock.Mock, str, str, str) -> None
  assert_requests(mock_execute_request, [(method, url, json_body)])


def assert_requests(mock_execute_request, requests):
  # type: (mock.Mock, typing.List[typing.Tuple[str, str, str]]) -> None
  assert mock_execute_request.mock_calls == [
      mock.call('GET', json.loads('{"page": 1, "per_page": 20}'),
                mock_string_should_end_with('/v2/models'))
  ] + [
      mock.call(method, json.loads(json_body), mock_string_should_end_with(url))
      for method, url, json_body in requests
  ]
