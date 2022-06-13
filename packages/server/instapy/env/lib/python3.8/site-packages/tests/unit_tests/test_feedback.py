import mock

from clarifai.rest import ClarifaiApp, FeedbackInfo, Model

from .mock_extensions import assert_request, mock_request


@mock.patch('clarifai.rest.http_client.HttpClient')
def test_send_concept_feedback(mock_http_client):  # type: (mock.Mock) -> None
  mock_execute_request = mock_request(
      mock_http_client, """
{
  "status": {
    "code": 10000,
    "description": "Ok"
  }
}
""")

  app = ClarifaiApp()
  model = Model(app.api, model_id='@modelID')
  response = model.send_concept_feedback(
      '@inputID',
      '@url',
      concepts=['dog'],
      not_concepts=['cat'],
      feedback_info=FeedbackInfo('@endUserID', '@sessionID', 'annotation', '@outputID'))

  assert response['status']['code'] == 10000

  assert_request(
      mock_execute_request, 'POST', '/v2/models/@modelID/feedback', """
{
  "input": {
    "id": "@inputID",
    "data": {
      "image": {
        "url": "@url"
      },
      "concepts": [
        {
          "id": "dog",
          "value": 1.0
        },
        {
          "id": "cat",
          "value": 0.0
        }
      ]
    },
    "feedback_info": {
      "end_user_id": "@endUserID",
      "session_id": "@sessionID",
      "event_type": "annotation",
      "output_id": "@outputID"
    }
  }
}
        """)


@mock.patch('clarifai.rest.http_client.HttpClient')
def test_send_searches_feedback(mock_http_client):  # type: (mock.Mock) -> None
  mock_execute_request = mock_request(
      mock_http_client, """
{
  "status": {
    "code": 10000,
    "description": "Ok"
  }
}
""")

  app = ClarifaiApp()
  response = app.inputs.send_search_feedback(
      '@inputID', FeedbackInfo('@endUserID', '@sessionID', 'search_click', search_id='@searchID'))

  assert response['status']['code'] == 10000

  assert_request(
      mock_execute_request, 'POST', '/v2/searches/feedback', """
{
  "input": {
    "id": "@inputID",
    "feedback_info": {
      "event_type":   "search_click",
      "search_id":    "@searchID",
      "end_user_id":  "@endUserID",
      "session_id":   "@sessionID"
    }
  }
}
        """)
