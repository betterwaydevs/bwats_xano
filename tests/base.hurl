# Base URL (always dev) – set this once and reuse everywhere:
#   export BASE_URL=https://xano.atlanticsoft.co/api:wosIWFpR:development
#
# Required env vars for auth helpers (ask a maintainer for the secrets):
#   export TEST_USER_EMAIL=...
#   export TEST_USER_PASSWORD=...
#
# Recommended invocation pattern (from repo root):
#   hurl \
#     --variable BASE_URL=$BASE_URL \
#     --variable TEST_USER_EMAIL=$TEST_USER_EMAIL \
#     --variable TEST_USER_PASSWORD=$TEST_USER_PASSWORD \
#     tests/some_test.hurl
#
# Conventions for writing tests:
# - Always call `Call ./login.hurl` at the top so {{authToken}}, {{refreshToken}},
#   and {{userId}} are populated.
# - Every request MUST:
#   * Use the :development branch in the path
#   * Include ?x-data-source=development in the URL
# - Authenticated endpoints should include
#     Authorization: Bearer {{authToken}}
# - Use jsonpath assertions to lock in the behavior being verified.
# - When a test needs data setup, prefer hitting existing helper APIs instead
#   of seeding data manually; document any prerequisites in comments.
#
# Example skeleton (see _template.hurl for a ready-to-copy file):
#   Call ./login.hurl
#   GET {{BASE_URL}}/candidate/quick_create?x-data-source=development
#   Authorization: Bearer {{authToken}}
