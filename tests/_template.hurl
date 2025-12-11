# TEMPLATE: copy this file and replace values as needed.
# Always start by calling the shared login helper so {{authToken}} is available.

Call ./login.hurl

GET {{BASE_URL}}/SOME_ENDPOINT?x-data-source=development
Authorization: Bearer {{authToken}}

HTTP 200
# Add a real payload/body if the endpoint requires it.
# Replace the assertions below with something meaningful for your API.
# jsonpath "$.something" == "value"
