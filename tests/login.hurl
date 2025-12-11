# Helper that logs into the dev workspace and captures tokens.
#
# Usage (from repo root):
#   hurl \
#     --variable BASE_URL=https://xano.atlanticsoft.co/api:wosIWFpR:development \
#     --variable TEST_USER_EMAIL=$TEST_USER_EMAIL \
#     --variable TEST_USER_PASSWORD=$TEST_USER_PASSWORD \
#     tests/login.hurl
#
# When invoked via `Call ./login.hurl` inside another Hurl file, the captured
# variables below become immediately available to that file.

POST {{BASE_URL}}/auth/login?x-data-source=development
Content-Type: application/json

{
  "email": "{{TEST_USER_EMAIL}}",
  "password": "{{TEST_USER_PASSWORD}}"
}

HTTP 200
jsonpath "$.authToken" exists
capture authToken jsonpath "$.authToken"
capture refreshToken jsonpath "$.refreshToken"
capture userId jsonpath "$.user.id"
