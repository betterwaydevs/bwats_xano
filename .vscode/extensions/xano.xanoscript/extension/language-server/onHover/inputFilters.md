# min

Enforces a minimum value or length for the entry.

- **For `decimal` and `int` types:** Requires the value to be greater than or equal to the specified minimum.
  - Example:
    ```xs
    input {
      decimal amount filters=min:10
    }
    ```
    (value must be ≥ 10)
  - Example:
    ```xs
    input {
      int age filters=min:18
    }
    ```
    (value must be ≥ 18)
- **For `text` and `password` types:** Requires the entry to have at least the specified number of characters.
  - Example:
    ```xs
    input {
      text username filters=min:3
    }
    ```
    (length ≥ 3)
  - Example:
    ```xs
    input {
      password pwd filters=min:8
    }
    ```
    (length ≥ 8)

# max

Enforces a maximum value or length for the entry.

- **For `decimal` and `int` types:** Requires the value to be less than or equal to the specified maximum.
  - Example:
    ```xs
    input {
      decimal amount filters=max:100
    }
    ```
    (value must be ≤ 100)
  - Example:
    ```xs
    input {
      int age filters=max:65
    }
    ```
    (value must be ≤ 65)
- **For `text` and `password` types:** Requires the entry to have at most the specified number of characters.
  - Example:
    ```xs
    input {
      text username filters=max:20
    }
    ```
    (length ≤ 20)
  - Example:
    ```xs
    input {
      password pwd filters=max:32
    }
    ```
    (length ≤ 32)

# trim

Removes excess whitespace from the beginning and end of the entry.

- **For `text` and `email` types.**
  - Example:
    ```xs
    input {
      text name filters=trim
    }
    ```
  - Example:
    ```xs
    input {
      email address filters=trim
    }
    ```

# lower

Converts all characters to lowercase.

- **For `text` and `email` types.**
  - Example:
    ```xs
    input {
      text email filters=lower
    }
    ```
  - Example:
    ```xs
    input {
      email address filters=lower
    }
    ```

# upper

Converts all characters to uppercase.

- **For `text` type.**
  - Example:
    ```xs
    input {
      text shout filters=upper
    }
    ```

# startsWith

Enforces that the entry starts with a specific prefix.

- **For `text` type.**
  - Example:
    ```xs
    input {
      text code filters=startsWith:ABC
    }
    ```

# prevent

Prevents the entry from containing a specific phrase (blacklist).

- **For `text` type.**
  - Example:
    ```xs
    input {
      text comment filters=prevent:spam
    }
    ```

# alphaOk

Allows only alphabetic characters (A-Z, a-z).

- **For `text` type.**
  - Example:
    ```xs
    input {
      text initials filters=alphaOk
    }
    ```

# digitOk

Allows only numeric characters (0-9).

- **For `text` type.**
  - Example:
    ```xs
    input {
      text pin filters=digitOk
    }
    ```

# ok

Allows only the specified characters (whitelist).

- **For `text` type.**
  - Example:
    ```xs
    input {
      text code filters=ok:ABC123
    }
    ```

# pattern

Validates the entry using a regular expression pattern. Optionally, a custom error message can be provided.

- **For `text` type.**
  - Example:
    ```xs
    input {
      text phone filters=pattern:^\\d{3}-\\d{3}-\\d{4}$
    }
    ```
  - Example:
    ```xs
    input {
      text phone filters=pattern:^\\d{3}-\\d{3}-\\d{4}$:Invalid phone number
    }
    ```

# minAlpha

Enforces a minimum number of alphabetic characters (A-Z, a-z).

- **For `password` type.**
  - Example:
    ```xs
    input {
      password pwd filters=minAlpha:2
    }
    ```

# minLowerAlpha

Enforces a minimum number of lowercase alphabetic characters (a-z).

- **For `password` type.**
  - Example:
    ```xs
    input {
      password pwd filters=minLowerAlpha:1
    }
    ```

# minUpperAlpha

Enforces a minimum number of uppercase alphabetic characters (A-Z).

- **For `password` type.**
  - Example:
    ```xs
    input {
      password pwd filters=minUpperAlpha:1
    }
    ```

# minDigit

Enforces a minimum number of numeric characters (0-9).

- **For `password` type.**
  - Example:
    ```xs
    input {
      password pwd filters=minDigit:1
    }
    ```

# minSymbol

Enforces a minimum number of symbol (punctuation) characters.

- **For `password` type.**
  - Example:
    ```xs
    input {
      password pwd filters=minSymbol:1
    }
    ```

# Other Types

The following input types do not have specific filters:

- `blob`
- `blob_img`
- `blob_video`
- `blob_audio`
- `enum`
- `file`
- `json`
- `obj`
- `epochms`

These types currently do not support input filters.
