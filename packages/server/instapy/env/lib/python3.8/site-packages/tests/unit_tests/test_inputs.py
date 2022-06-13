import mock

from clarifai.rest import (BoundingBox, ClarifaiApp, Concept, Face, FaceIdentity, FeedbackType,
                           Geo, GeoPoint, Image, Region, RegionInfo)

from .mock_extensions import assert_request, assert_requests, mock_request


@mock.patch('clarifai.rest.http_client.HttpClient')
def test_bulk_create_image(mock_http_client):  # type: (mock.Mock) -> None
  mock_execute_request = mock_request(
      mock_http_client, """
{
  "status": {
    "code": 10000,
    "description": "Ok"
  },
  "inputs": [
    {
      "id": "@inputID1",
      "data": {
        "image": {
          "url": "https://some.image.url1"
        },
        "geo": {
          "geo_point": {
            "longitude": 55,
            "latitude": 66
          }
        }
      },
      "created_at": "2019-01-17T12:43:04.895006174Z",
      "modified_at": "2019-01-17T12:43:04.895006174Z",
      "status": {
        "code": 30001,
        "description": "Download pending"
      }
    },
    {
      "id": "@inputID2",
      "data": {
        "image": {
          "url": "https://some.image.url2"
        }
      },
      "created_at": "2019-01-17T12:43:04.895006174Z",
      "modified_at": "2019-01-17T12:43:04.895006174Z",
      "status": {
        "code": 30001,
        "description": "Download pending"
      }
    }
  ]
}
""")

  app = ClarifaiApp()
  images = app.inputs.bulk_create_images([
      Image(
          url='https://some.image.url1',
          image_id='@inputID1',
          allow_dup_url=True,
          geo=Geo(geo_point=GeoPoint(55, 66))),
      Image(url='https://some.image.url2', image_id='@inputID2', allow_dup_url=True),
  ])

  assert images[0].input_id == '@inputID1'
  assert images[0].url == 'https://some.image.url1'
  assert images[0].geo.geo_point.longitude == 55
  assert images[0].geo.geo_point.latitude == 66
  assert images[0].status.code == 30001

  assert images[1].input_id == '@inputID2'
  assert images[1].url == 'https://some.image.url2'
  assert not images[1].geo
  assert images[1].status.code == 30001

  assert_request(
      mock_execute_request, 'POST', '/v2/inputs', """
{
  "inputs": [
    {
      "id": "@inputID1",
      "data": {
        "image": {
          "url": "https://some.image.url1",
          "allow_duplicate_url": true
        },
        "geo": {
          "geo_point": {
            "longitude": 55,
            "latitude": 66
          }
        }
      }
    },
    {
      "id": "@inputID2",
      "data": {
        "image": {
          "url": "https://some.image.url2",
          "allow_duplicate_url": true
        }
      }
    }
  ]
}
        """)


@mock.patch('clarifai.rest.http_client.HttpClient')
def test_bulk_update(mock_http_client):  # type: (mock.Mock) -> None
  mock_execute_request = mock_request(
      mock_http_client, """
{
    "status": {
        "code": 10000,
        "description": "Ok"
    },
    "inputs": [{
        "id": "@inputID",
        "data": {
            "image": {
                "url": "@imageURL"
            },
            "concepts": [
                {
                  "id": "@positiveConcept1",
                  "name": "@positiveConceptName1",
                  "value": 1
                },
                {
                  "id": "@positiveConcept2",
                  "value": 1
                },
                {
                  "id": "@negativeConcept1",
                  "name": "@negativeConceptName1",
                  "value": 0
                },
                {
                  "id": "@negativeConcept2",
                  "value": 0
                }
            ]
        },
        "created_at": "2017-10-13T20:53:00.253139Z",
        "modified_at": "2017-10-13T20:53:00.868659782Z",
        "status": {
            "code": 30200,
            "description": "Input image modification success"
        }
    }]
}
""")

  app = ClarifaiApp()
  images = app.inputs.bulk_update([
      Image(
          image_id='@inputID',
          concepts=['@positiveConcept1', '@positiveConcept2'],
          not_concepts=['@negativeConcept1', '@negativeConcept2']),
  ])

  assert images[0].input_id == '@inputID'
  assert images[0].url == '@imageURL'
  assert images[0].status.code == 30200

  assert_request(
      mock_execute_request, 'PATCH', '/v2/inputs', """
{
  "inputs": [
    {
      "id": "@inputID",
      "data": {
        "concepts": [
          {
            "id": "@positiveConcept1",
            "value": 1
          },
          {
            "id": "@positiveConcept2",
            "value": 1
          },
          {
            "id": "@negativeConcept1",
            "value": 0
          },
          {
            "id": "@negativeConcept2",
            "value": 0
          }
        ]
      }
    }
  ],
  "action":"merge"
}
        """)


@mock.patch('clarifai.rest.http_client.HttpClient')
def test_bulk_update_with_regions(mock_http_client):  # type: (mock.Mock) -> None
  mock_execute_request = mock_request(
      mock_http_client, """
{
  "status": {
    "code": 10000,
    "description": "Ok"
  },
  "inputs": [
    {
      "id": "@inputID",
      "data": {
        "image": {
          "url": "@imageURL"
        },
        "concepts": [
          {
            "id": "@concept1",
            "name": "@concept1",
            "value": 1,
            "app_id": "@appID"
          },
          {
            "id": "@concept2",
            "name": "@concept2",
            "value": 0,
            "app_id": "@appID"
          }
        ]
      },
      "created_at": "2019-01-29T15:23:21.188492Z",
      "modified_at": "2019-01-29T15:23:21.575667Z",
      "status": {
        "code": 30200,
        "description": "Input image modification success"
      }
    }
  ]
}
""")

  app = ClarifaiApp()
  images = app.inputs.bulk_update(
      [
          Image(
              image_id='@inputID',
              regions=[
                  Region(
                      region_info=RegionInfo(
                          bbox=BoundingBox(0.5, 0.5, 1.0, 1.0),
                          feedback_type=FeedbackType.misplaced),
                      concepts=[
                          Concept(concept_id='@concept1', value=True),
                          Concept(concept_id='@concept2', value=False)
                      ],
                      region_id='@regionID',
                      face=Face(
                          identity=FaceIdentity(concepts=[
                              Concept(concept_id='@faceConcept1', value=True),
                              Concept(concept_id='@faceConcept2', value=False),
                          ])))
              ])
      ],
      action='overwrite')

  assert images[0].input_id == '@inputID'
  assert images[0].url == '@imageURL'
  assert images[0].status.code == 30200

  assert_request(
      mock_execute_request, 'PATCH', '/v2/inputs', """
{
  "inputs": [
    {
      "id": "@inputID",
      "data": {
        "regions": [
          {
            "id": "@regionID",
            "region_info": {
              "bounding_box": {
                "top_row": 0.5,
                "left_col": 0.5,
                "bottom_row": 1,
                "right_col": 1
              },
              "feedback": "misplaced"
            },
            "data": {
              "concepts": [
                {
                  "id": "@concept1",
                  "value": 1
                },
                {
                  "id": "@concept2",
                  "value": 0
                }
              ],
              "face": {
                "identity": {
                  "concepts": [
                    {
                      "id": "@faceConcept1",
                      "value": 1
                    },
                    {
                      "id": "@faceConcept2",
                      "value": 0
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
  ],
  "action": "overwrite"
}
        """)


@mock.patch('clarifai.rest.http_client.HttpClient')
def test_bulk_update_with_metadata(mock_http_client):  # type: (mock.Mock) -> None
  mock_execute_request = mock_request(
      mock_http_client, """
{
    "status": {
        "code": 10000,
        "description": "Ok"
    },
    "inputs": [{
        "id": "@inputID",
        "data": {
            "image": {
                "url": "@imageURL"
            },
            "concepts": [{
                "id": "concept1",
                "name": "concept1",
                "value": 1,
                "app_id": "@appID"
            }],
            "metadata": {
                "@key1": "@value1",
                "@key2": "@value2"
            }
        },
        "created_at": "2017-11-02T15:08:22.005157Z",
        "modified_at": "2017-11-02T15:08:23.071624222Z",
        "status": {
            "code": 30200,
            "description": "Input image modification success"
        }
    }]
}
""")

  app = ClarifaiApp()
  images = app.inputs.bulk_update(
      [Image(image_id='@inputID', metadata={
          '@key1': '@value1',
          '@key2': '@value2',
      })],
      action='overwrite')

  assert images[0].input_id == '@inputID'
  assert images[0].url == '@imageURL'
  assert images[0].status.code == 30200
  assert images[0].metadata == {'@key1': '@value1', '@key2': '@value2'}

  assert_request(
      mock_execute_request, 'PATCH', '/v2/inputs', """
{
    "inputs": [
      {
        "id": "@inputID",
        "data": {
          "metadata": {
            "@key1": "@value1",
            "@key2": "@value2"
          }
        }
      }
    ],
    "action":"overwrite"
}
        """)


@mock.patch('clarifai.rest.http_client.HttpClient')
def test_get_all(mock_http_client):  # type: (mock.Mock) -> None
  mock_execute_request = mock_request(
      mock_http_client,
      json_responses=[
          """
{
  "status": {
    "code": 10000,
    "description": "Ok"
  },
  "inputs": [
    {
      "id": "@inputID1",
      "data": {
        "image": {
          "url": "https://some.image.url1"
        },
        "geo": {
          "geo_point": {
            "longitude": 55,
            "latitude": 66
          }
        }
      },
      "created_at": "2019-01-17T14:02:21.216473Z",
      "modified_at": "2019-01-17T14:02:21.800792Z",
      "status": {
        "code": 30000,
        "description": "Download complete"
      }
    },
    {
      "id": "@inputID2",
      "data": {
        "image": {
          "url": "https://some.image.url2"
        }
      },
      "created_at": "2019-01-17T14:02:21.216473Z",
      "modified_at": "2019-01-17T14:02:21.800792Z",
      "status": {
        "code": 30000,
        "description": "Download complete"
      }
    }
  ]
}
""", """
{
  "status": {
    "code": 10000,
      "description": "Ok"
    },
  "inputs": []
}
"""
      ])

  app = ClarifaiApp()
  images = list(app.inputs.get_all())

  assert images[0].input_id == '@inputID1'
  assert images[0].url == 'https://some.image.url1'
  assert images[0].geo.geo_point.longitude == 55
  assert images[0].geo.geo_point.latitude == 66

  assert images[1].input_id == '@inputID2'
  assert images[1].url == 'https://some.image.url2'

  assert_requests(
      mock_execute_request,
      requests=[('GET', '/v2/inputs', """
{"page": 1, "per_page": 20}
    """), ('GET', '/v2/inputs', """
{"page": 2, "per_page": 20}
    """)])


@mock.patch('clarifai.rest.http_client.HttpClient')
def test_get(mock_http_client):  # type: (mock.Mock) -> None
  mock_execute_request = mock_request(
      mock_http_client,
      json_responses=[
          """
{
  "status": {
    "code": 10000,
    "description": "Ok"
  },
  "input": {
    "id": "@inputID",
    "data": {
      "image": {
        "url": "https://some.image.url"
      },
      "geo": {
        "geo_point": {
          "longitude": 55,
          "latitude": 66
        }
      }
    },
    "created_at": "2019-01-17T14:02:21.216473Z",
    "modified_at": "2019-01-17T14:02:21.800792Z",
    "status": {
      "code": 30000,
      "description": "Download complete"
    }
  }
}
""", """ 
{
  "status": {
    "code": 10000,
      "description": "Ok"
    },
  "inputs": []
}
"""
      ])

  app = ClarifaiApp()
  image = app.inputs.get('@inputID')

  assert image.input_id == '@inputID'
  assert image.url == 'https://some.image.url'
  assert image.geo.geo_point.longitude == 55
  assert image.geo.geo_point.latitude == 66

  assert_request(mock_execute_request, 'GET', '/v2/inputs/@inputID')


@mock.patch('clarifai.rest.http_client.HttpClient')
def test_check_status(mock_http_client):  # type: (mock.Mock) -> None
  mock_execute_request = mock_request(
      mock_http_client, """
{
  "status": {
    "code": 10000,
    "description": "Ok"
  },
  "counts": {
    "processed": 1,
    "to_process": 2,
    "errors": 3,
    "processing": 4,
    "reindexed": 5,
    "to_reindex": 6,
    "reindex_errors": 7,
    "reindexing": 8
  }
}
""")

  app = ClarifaiApp()
  input_counts = app.inputs.check_status()

  assert input_counts.processed == 1
  assert input_counts.to_process == 2
  assert input_counts.errors == 3
  # TODO(Rok) HIGH: Expose all fields.

  assert_request(mock_execute_request, 'GET', '/v2/inputs/status')


@mock.patch('clarifai.rest.http_client.HttpClient')
def test_add_concepts(mock_http_client):  # type: (mock.Mock) -> None
  mock_execute_request = mock_request(
      mock_http_client, """
{
    "status": {
        "code": 10000,
        "description": "Ok"
    },
    "inputs": [{
        "id": "@inputID",
        "data": {
            "image": {
                "url": "@imageURL"
            },
            "concepts": [
                {
                  "id": "@positiveConcept1",
                  "value": 1
                },
                {
                  "id": "@positiveConcept2",
                  "value": 1
                },
                {
                  "id": "@negativeConcept1",
                  "name": "@negativeConceptName1",
                  "value": 0
                },
                {
                  "id": "@negativeConcept2",
                  "value": 0
                }
            ]
        },
        "created_at": "2017-10-13T20:53:00.253139Z",
        "modified_at": "2017-10-13T20:53:00.868659782Z",
        "status": {
            "code": 30200,
            "description": "Input image modification success"
        }
    }]
}
""")

  app = ClarifaiApp()
  image = app.inputs.add_concepts('@inputID', ['@positiveConcept1'], ['@negativeConcept1'])

  assert image.input_id == '@inputID'
  assert image.url == '@imageURL'

  assert_request(
      mock_execute_request, 'PATCH', '/v2/inputs', """
  {
    "inputs": [
      {
        "id": "@inputID",
        "data": {
          "concepts": [
            {
              "id": "@positiveConcept1",
              "value": 1
            },
            {
              "id": "@negativeConcept1",
              "value": 0
            }
          ]
        }
      }
    ],
    "action":"merge"
  }
          """)
