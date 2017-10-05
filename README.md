# API

Get traces information by trace id prefix.

`GET /tracesByIdPrefix?prefix=9ff2d5`

```
[
    {
        "TraceId": "9ff2d5548b7e4f7b8f245e9d30ad78ba",
        "Spans": [
            {
                "TraceId": "9ff2d5548b7e4f7b8f245e9d30ad78ba",
                "SpanId": "00a5e964000000000000000000000000",
                "ParentSpanId": "00a5e964000000000000000000000000",
                "BeginTimestamp": "2017-10-05T09:06:00.1520000+03:00",
                "EndTimestamp": "2017-10-05T09:06:34.5031881+03:00",
                "Annotations": {
                    "OperationName": "HTTP",
                    ...
                }
            },
            ...
        ]
    },
    ...
]
```
