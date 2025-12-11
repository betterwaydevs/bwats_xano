# deg2rad

Convert degrees to radians

```xs
180|deg2rad
```

Result: `3.141592...`

# rad2deg

Convert radians to degrees

```xs
3.141592|rad2deg
```

Result: `180`

# number_format

Format a number with flexible support over decimal places, thousands separator, and decimal separator.

```xs
31253212.141592|number_format:2:.:,
```

Result: `"31,253,212.14"`

# sin

Calculates the sine of the supplied value in radians

```xs
3.14159|sin
```

Result: `0`

# asin

Calculates the arc sine of the supplied value in radians

```xs
1|asin
```

Result: `1.57079...`

# asinh

Calculates the inverse hyperbolic sine of the supplied value in radians

```xs
1|asinh
```

Result: `0.88137...`

# cos

Calculates the cosine of the supplied value in radians

```xs
1|cos
```

Result: `0.54030...`

# acos

Calculates the arc cosine of the supplied value in radians

```xs
1|acos
```

Result: `0`

# acosh

Calculates the inverse hyperbolic cosine of the supplied value in radians

```xs
11.592|acosh
```

Result: `3.14159...`

# tan

Calculates the tangent of the supplied value in radians

```xs
0.785398|tan
```

Result: `1`

# atan

Calculates the arc tangent of the supplied value in radians

```xs
1|atan
```

Result: `0.78539...`

# atanh

Calculates the inverse hyperbolic tangent of the supplied value in radians

```xs
0.6666|atanh
```

Result: `0.80470...`

# floor

Round a decimal down to its integer equivalent

```xs
2.5|floor
```

Result: `2`

# ceil

Round a decimal up to its integer equivalent

```xs
2.5|ceil
```

Result: `3`

# round

Round a decimal with optional precision

```xs
2.5432|round:1
```

Result: `3`

# first

Get the first entry of an array

```xs
["five","six","seven"]|first
```

Result: `"five"`

# last

Get the last entry of an array

```xs
["five","six","seven"]|last
```

Result: `"seven"`

# count

Return the number of items in an object/array

```xs
["five","six","seven"]|count
```

Result: `3`

# range

Returns array of values between the specified start/stop.

```xs
|range:10:15
```

Result: `[10,11,12,13,14,15]`

# reverse

Returns values of an array in reverse order

```xs
[12,13,14,15]|reverse
```

Result: `[15,14,13,12]`

# unique

Returns unique values of an array

```xs
[12,13,13,12,11]|unique
```

Result: `[12,13,11]`

# safe_array

Always returns an array. Uses the existing value if it is an array or creates an array of one element.

```xs
12|safe_array
```

Result: `[12]`

# flatten

Flattens a multidimensional array into a single level array of values.

```xs
[1,[2,3],[[4,5]]]|flatten
```

Result: `[1,2,3,4,5]`

# filter_empty

Returns a new array with only entries that are not empty ("", null, 0, "0", false, [], {})

```xs
[{a:1, b:null}, {a:0, b:4}]|filter_empty:a
```

Result: `[{a:1, b:null}]`

# filter_empty_text

Returns a new array with only entries that are not empty ("", null, 0, "0", false, [], {})

```xs
[{a:"x", b:null}, {a:"", b:4}]|filter_empty_text:a
```

Result:

```json
[
  {
    "a": "x",
    "b": null
  }
]
```

# filter_empty_array

Returns a new array with only entries that are not an empty array `[]`

```xs
[{a:[1,2], b:null}, {a:[], b:4}]|filter_empty_array:a
```

Result:

```json
[
  {
    "a": [1, 2],
    "b": null
  }
]
```

# filter_null

Returns a new array with only entries that are not null

```xs
[{a:1, b:null}, {a:null, b:4}]|filter_null:a
```

Result:

```json
[
  {
    "a": 1,
    "b": null
  }
]
```

# filter_empty_object

Returns a new array with only entries that are not an empty object `{}`

```xs
[{a:{x:1}, b:null}, {a:{}, b:4}]|filter_empty_object:a
```

Result:

```json
[
  {
    "a": { "x": 1 },
    "b": null
  }
]
```

# filter_zero

Returns a new array with only entries that are not zero

```xs
[{a:1, b:null}, {a:0, b:4}]|filter_zero:"a"
```

Result:

```json
[
  {
    "a": 1,
    "b": null
  }
]
```

# filter_false

Returns a new array with only entries that are not false

```xs
[{a:true, b:null}, {a:false, b:4}]|filter_false:"a"
```

Result:

```json
[
  {
    "a": true,
    "b": null
  }
]
```

# sort

Sort an array of elements with an optional path inside the element

```xs
[{v:"a", e:20}, {v:"z", e:10}]|sort:v:text:true
```

Result: `[{v:"z", e:10}, {v:"a", e:20}]`

# !fsort:sort

Sort an array of elements with an optional path inside the element

```xs
[{v:"a", e:20}, {v:"z", e:10}]|fsort:v:text:true
```

Result: `[{v:"z", e:10}, {v:"a", e:20}]`

# shuffle

Shuffles the order of the entries in the array.

```xs
[1,2,3,4]|shuffle
```

Result: `[3,2,4,1]`

# !array_shuffle:shuffle

Shuffles the order of the entries in the array.

```xs
[1,2,3,4]|array_shuffle
```

Result: `[3,2,4,1]`

# diff

Return the entries from the first array that are not in the second array. Only values are used for matching.

```xs
[1,2,3,4]|diff:[3,2]
```

Result: `[1,4]`

# !array_diff:diff

Return the entries from the first array that are not in the second array. Only values are used for matching.

```xs
[1,2,3,4]|array_diff:[3,2]
```

Result: `[1,4]`

# diff_assoc

Return the entries from the first array that are not in the second array. Values and keys are used for matching.

```xs
[{"a": "green"},{"b": "brown"},{"c":"blue"},"red"]|diff_assoc:[{"a":"green"}, "yellow", "red"]
```

Result: `[{a: "green",b: "brown", "red"]`

# !array_diff_assoc:diff_assoc

Return the entries from the first array that are not in the second array. Values and keys are used for matching.

```xs
[{"a": "green"},{"b": "brown"},{"c":"blue"},"red"]|array_diff_assoc:[{"a":"green"}, "yellow", "red"]
```

Result: `[{a: "green",b: "brown", "red"]`

# intersect

Return the entries from the first array that are also present in the second array. Only values are used for matching.

```xs
[1,2,3,4]|intersect:[3,2]
```

Result: `[2,3]`

# !array_intersect:intersect

Return the entries from the first array that are also present in the second array. Only values are used for matching.

```xs
[1,2,3,4]|array_intersect:[3,2]
```

Result: `[2,3]`

# intersect_assoc

Return the entries from the first array that are also present in the second array. Values and keys are used for matching.

```xs
[{"a": "green"},{"b": "brown"},{"c":"blue"},"red"]|intersect_assoc:[{"a":"green"},{"b":"yellow"},"blue","red"]
```

Result: `[{a: "green",b: "brown", "red"]`

# !array_intersect_assoc:intersect_assoc

Return the entries from the first array that are also present in the second array. Values and keys are used for matching.

```xs
[{"a": "green"},{"b": "brown"},{"c":"blue"},"red"]|array_intersect_assoc:[{"a":"green"},{"b":"yellow"},"blue","red"]
```

Result: `[{a: "green",b: "brown", "red"]`

# merge

Merge the first level of elements of both arrays together and return the new array

```xs
[1,2,3]|merge:["a","b","c"]
```

Result: `[1,2,3,"a","b","c"]`

# !array_merge:merge

Merge the first level of elements of both arrays together and return the new array

```xs
[1,2,3]|array_merge:["a","b","c"]
```

Result: `[1,2,3,"a","b","c"]`

# merge_recursive

Merge the elements from all levels of both arrays together and return the new array

```xs
{color:{favorite: ["red"]}}|merge_recursive:{color: {favorite: ["green","blue"]}}
```

Result: `{"color":{"favorite": ["red","green","blue"]}}`

# !array_merge_recursive:merge_recursive

Merge the elements from all levels of both arrays together and return the new array

```xs
{color:{favorite: ["red"]}}|array_merge_recursive:{color: {favorite: ["green","blue"]}}
```

Result: `{"color":{"favorite": ["red","green","blue"]}}`

# index_by

Create a new array indexed off of the value of each item's path

```xs
[{id:1,g:"x"},{id:2,g:"y"},{id:3,g:"x"}]|index_by:g
```

Result: `{"x": [{"id":1,"g":"x"},{"id":3,"g":"x"}], "y": [{"id":2,"g":"y"}]}`

# push

Push an element on to the end of an array and return the new array

```xs
[1,2,3]|push:"a"
```

Result: `[1,2,3,"a"]`

# !array_push:push

Push an element on to the end of an array and return the new array

```xs
[1,2,3]|array_push:"a"
```

Result: `[1,2,3,"a"]`

# pop

Pops the last element of the array off and returns it

```xs
[1,2,3]|pop
```

Result: `3`

# !array_pop:pop

Pops the last element of the array off and returns it

```xs
[1,2,3]|array_pop
```

Result: `3`

# unshift

Push an element to the beginning of an array and return the new array

```xs
[1,2,3]|unshift:0
```

Result: `[0,1,2,3]`

# !array_unshift:unshift

Push an element to the beginning of an array and return the new array

```xs
[1,2,3]|array_unshift:0
```

Result: `[0,1,2,3]`

# shift

Shifts the first element of the array off and returns it

```xs
[1,2,3]|shift
```

Result: `1`

# !array_shift:shift

Shifts the first element of the array off and returns it

```xs
[1,2,3]|array_shift
```

Result: `1`

# remove

Remove any elements from the array that match the supplied value and then return the new array

```xs
[{v:1},{v:2},{v:3}]|remove:{v:2}
```

Result: `[{v:1},{v:3}]`

# !array_remove:remove

Remove any elements from the array that match the supplied value and then return the new array

```xs
[{v:1},{v:2},{v:3}]|array_remove:{v:2}
```

Result: `[{v:1},{v:3}]`

# append

Push an element on to the end of an array within an object and return the updated object

```xs
[1,2,3]|append:4
```

Result: `[1,2,3,4]`

# prepend

Push an element on to the beginning of an array within an object and return the updated object

```xs
[1,2,3]|prepend:0
```

Result: `[0,1,2,3]`

# abs

Returns the absolute value

```xs
-10|abs
```

Result: `10`

# sqrt

Returns the square root of the value

```xs
9|sqrt
```

Result: `3`

# exp

Returns the exponent of mathematical expression "e"

```xs
0|exp
```

Result: `1`

# log

Returns the logarithm with a custom base

```xs
2|log:2
```

Result: `1`

# log10

Returns the Base-10 logarithm

```xs
100|log10
```

Result: `2`

# ln

Returns the natural logarithm

```xs
10|ln
```

Result: `2.30258...`

# pow

Returns the value raised to the power of exp.

```xs
10|pow:2
```

Result: `100`

# array_min

Returns the min of the values of the array

```xs
[1,2,3]|array_min
```

Result: `1`

# array_max

Returns the max of the values of the array

```xs
[1,2,3]|array_max
```

Result: `3`

# !num_min:min

Returns the min both values

```xs
1|num_min:0
```

Result: `0`

# !num_max:max

Returns the max both values

```xs
5|num_max:20
```

Result: `20`

# sum

Returns the sum of the values of the array

```xs
[1,2,3,4]|sum
```

Result: `10`

# avg

Returns the average of the values of the array

```xs
[1,2,3,4]|avg
```

Result: `2.5`

# product

Returns the product of the values of the array

```xs
[1,2,3,4]|product
```

Result: `24`

# !eq:equals

Returns a boolean if both values are equal

```xs
4|equals:4
```

Result: `true`

# eq

Returns a boolean if both values are equal

```xs
4|eq:4
```

Result: `true`

# not_equals

Returns a boolean if both values are not equal

```xs
4|not_equals:4
```

Result: `false`

# !ne:not_equals

Returns a boolean if both values are not equal

```xs
4|ne:4
```

Result: `false`

# greater_than

Returns a boolean if the left value is greater than the right value

```xs
4|greater_than:2
```

Result: `true`

# !gt:greater_than

Returns a boolean if the left value is greater than the right value

```xs
4|gt:2
```

Result: `true`

# greater_than_or_equal

Returns a boolean if the left value is greater than or equal to the right value

```xs
4|greater_than_or_equal:2
```

Result: `true`

# !gte:greater_than_or_equal

Returns a boolean if the left value is greater than or equal to the right value

```xs
4|gte:2
```

Result: `true`

# less_than

Returns a boolean if the left value is less than the right value

```xs
4|less_than:2
```

Result: `false`

# !lt:less_than

Returns a boolean if the left value is less than the right value

```xs
4|lt:2
```

Result: `false`

# less_than_or_equal

Returns a boolean if the left value is less than or equal to the right value

```xs
4|less_than_or_equal:2
```

Result: `false`

# !lte:less_than_or_equal

Returns a boolean if the left value is less than or equal to the right value

```xs
4|lte:2
```

Result: `false`

# odd

Returns whether or not the value is odd

```xs
4|odd
```

Result: `false`

# even

Returns whether or not the value is even

```xs
4|even
```

Result: `true`

# in

Returns whether or not the value is in the array

```xs
[1,2,3]|in:3
```

Result: `true`

# add

Add 2 values together and return the answer

```xs
2|add:3
```

Result: `5`

# subtract

Subtract 2 values together and return the answer

```xs
2|subtract:3
```

Result: `-1`

# !sub:subtract

Subtract 2 values together and return the answer

```xs
2|sub:3
```

Result: `-1`

# multiply

Multiply 2 values together and return the answer

```xs
2|multiply:3
```

Result: `6`

# !mul:multiply

Multiply 2 values together and return the answer

```xs
2|mul:3
```

Result: `6`

# modulus

Modulus 2 values together and return the answer

```xs
20|modulus:3
```

Result: `2`

# !mod:modulus

Modulus 2 values together and return the answer

```xs
20|mod:3
```

Result: `2`

# divide

Divide 2 values together and return the answer

```xs
20|divide:4
```

Result: `5`

# !div:divide

Divide 2 values together and return the answer

```xs
20|div:4
```

Result: `5`

# bitwise_and

Bitwise AND 2 values together and return the answer

```xs
7|bitwise_and:3
```

Result: `3`

# bitwise_or

Bitwise OR 2 values together and return the answer

```xs
7|bitwise_or:9
```

Result: `15`

# bitwise_xor

Bitwise XOR 2 values together and return the answer

```xs
7|bitwise_xor:9
```

Result: `14`

# not

Returns the opposite of the existing value evaluated as a boolean

```xs
true|not
```

Result: `false`

# bitwise_not

Returns the existing value with its bits flipped

```xs
8|bitwise_not
```

Result: `-9`

# is_null

Returns whether or not the value is null

```xs
8|is_null
```

Result: `false`

# !null:is_null

Returns whether or not the value is null

```xs
8|null
```

Result: `false`

# is_empty

Returns whether or not the value is empty ("", null, 0, "0", false, [], {})

```xs
[]|is_empty
```

Result: `true`

# !empty:is_empty

Returns whether or not the value is empty ("", null, 0, "0", false, [], {})

```xs
[]|empty
```

Result: `true`

# is_object

Returns whether or not the value is an object.

```xs
{id:2, value:3, size:4}|is_object
```

Result: `true`

# is_array

Returns whether or not the value is a numerical indexed array.

```xs
[1,2,3]|is_array
```

Result: `true`

# is_int

Returns whether or not the value is an integer.

```xs
123|is_int
```

Result: `true`

# is_decimal

Returns whether or not the value is a decimal value.

```xs
123.45|is_decimal
```

Result: `true`

# is_bool

Returns whether or not the value is a boolean.

```xs
false|is_bool
```

Result: `true`

# is_text

Returns whether or not the value is text.

```xs
"213"|is_text
```

Result: `true`

# addslashes

Adds a backslash to the following characters: single quote, double quote, backslash, and null character.

```xs
'he said "Hi!"'|addslashes
```

Result: `"he said \\"Hi!\\""`

# escape

Converts special characters into their escaped variants. Ex: for tabs and
for newlines.

````xs
'he sai
``d

- "Hi!"'|escape`

Result: `"he said \\n-\\\"Hi!\\\""`

# list_encodings

List support character encodings

```xs
|list_encodings
````

Result: `["UTF-8", "ISO-8859-1", ...]`

# detect_encoding

Detect the character encoding of the supplied text

```xs
"étude"|detect_encoding
```

Result: `UTF-8`

# text_unescape

Convert escaped sequences into their raw form. Ex: \n becomes a newline, \t becomes a tab.

```xs
'he said \\n-\\\"Hi!\\\"'|text_unescape
```

Result: `"he said \n-\"Hi!\""`

# text_escape

Converts control characters into their escaped sequences. Ex: newlines as \n, tabs as \t

```xs
'he said \n-\\"Hi!\\"'|text_escape
```

Result: `"he said \\n-\\\"Hi!\\\""`

# sql_esc

Wraps text in single quotes and escapes any single quotes within the text to prevent SQL injection attacks. This is useful for safely inserting user input into values within SQL queries.

# sql_alias

Wraps text in double quotes and escapes any double quotes within the text to prevent SQL injection attacks. This is useful for safely inserting user input into table names or aliases within SQL queries.

# is_uuid

Returns whether or not the value is a valid UUID.

```xs
"550e8400-e29b-41d4-a716-446655440000"|is_uuid
```

Result: `true`

# to_utf8

Convert the supplied text from its binary form (ISO-8859-1) to UTF-8.

```xs
"�tudes"|to_utf8
```

Result: `"études"`

# from_utf8

Convert the supplied text from UTF-8 to its binary form (ISO-8859-1).

```xs
"études"|from_utf8
```

Result: `"�tudes"`

# convert_encoding

Convert the character encoding of the supplied text

```xs
"études"|convert_encoding:"ISO-8859-1":"UTF-8"
```

Result: `"�tudes"`

# to_lower

Converts all characters to lower case and returns the result

```xs
"Epic Battle"|to_lower
```

Result: `"epic battle"`

# !lower:to_lower

Converts all characters to lower case and returns the result

```xs
"Epic Battle"|lower
```

Result: `"epic battle"`

# to_upper

Converts all characters to upper case and returns the result

```xs
"Epic Battle"|to_upper
```

Result: `"EPIC BATTLE"`

# !upper:to_upper

Converts all characters to upper case and returns the result

```xs
"Epic Battle"|upper
```

Result: `"EPIC BATTLE"`

# trim

Trim whitespace or other characters from both sides and return the result

```xs
"  Epic Battle  "|trim
```

Result: `"Epic Battle"`

# ltrim

Trim whitespace or other characters from the left side and return the result

```xs
"  Epic Battle  "|ltrim
```

Result: `"Epic Battle  "`

# rtrim

Trim whitespace or other characters from the right return the result

```xs
"  Epic Battle  "|rtrim
```

Result: `"  Epic Battle"`

# capitalize

Converts the first letter of each word to a capital letter

```xs
"epic battle"|capitalize
```

Result: `"Epic Battle"`

# substr

Extracts a section of text

```xs
"Epic Battle"|substr:5:6
```

Result: `"Battle"`

# split

Splits text into an array of text and returns the result

```xs
"Epic Battle"|split:" "
```

Result: `["Epic","Battle"]`

# join

Joins an array into a text string via the separator and returns the result

```xs
["Epic","Battle"]|join:" "
```

Result: `"Epic Battle"`

# slice

Extract a section from an array.

```xs
[1,2,3,4,5]|slice:2:2
```

Result: `[3,4]`

# !array_slice:slice

Extract a section from an array.

```xs
[1,2,3,4,5]|array_slice:2:2
```

Result: `[3,4]`

# strlen

Returns the number of characters

```xs
"Epic Battle"|strlen
```

Result: `11`

# strip_html

Removes HTML tags from a string

```xs
"<p>Epic Battle</p>"|strip_html
```

Result: `"Epic Battle"`

# !strip_tags:strip_html

Removes HTML tags from a string

```xs
"<p>Epic Battle</p>"|strip_tags
```

Result: `"Epic Battle"`

# unaccent

Removes accents from characters

```xs
"études"|unaccent
```

Result: `"etudes"`

# !strip_accents:unaccent

Removes accents from characters

```xs
"études"|strip_accents
```

Result: `"etudes"`

# index

Returns the index of the case-sensitive expression or false if it can't be found

```xs
"Epic Battle"|index:"Battle"
```

Result: `5`

# !strpos:index

Returns the index of the case-sensitive expression or false if it can't be found

```xs
"Epic Battle"|strpos:"Battle"
```

Result: `5`

# iindex

Returns the index of the case-insensitive expression or false if it can't be found

```xs
"Epic Battle"|iindex:"battle"
```

Result: `5`

# !stripos:iindex

Returns the index of the case-insensitive expression or false if it can't be found

```xs
"Epic Battle"|stripos:"battle"
```

Result: `5`

# starts_with

Returns whether or not the expression is present at the beginning

```xs
"Epic Battle"|starts_with:"Epic"
```

Result: `true`

# istarts_with

Returns whether or not the case-insensitive expression is present at the beginning

```xs
"Epic Battle"|istarts_with:"epic"
```

Result: `true`

# ends_with

Returns whether or not the expression is present at the end

```xs
"Epic Battle"|ends_with:"Battle"
```

Result: `true`

# iends_with

Returns whether or not the case-insensitive expression is present at the end

```xs
"Epic Battle"|iends_with:"battle"
```

Result: `true`

# contains

Returns whether or not the expression is found

```xs
"Epic Battle"|contains:"Battle"
```

Result: `true`

# icontains

Returns whether or not the case-insensitive expression is found

```xs
"Epic Battle"|icontains:"battle"
```

Result: `true`

# set

Sets a value at the path within the object and returns the updated object

```xs
{"fizz":"buzz"}|set:"foo":"bar"
```

Result: `{"fizz": "buzz","foo":"bar"}`

# set_conditional

Sets a value at the path within the object and returns the updated object, if the conditional expression is true

```xs
{'fizz':'buzz'}|set_conditional:'foo':'bar':2==1+1
```

Result: `{'fizz':'buzz','foo':'bar'}`

# set_ifnotempty

Sets a value (if it is not empty: "", null, 0, "0", false, [], {}) at the path within the object and returns the updated object

```xs
{'fizz':'buzz'}|set_ifnotempty:'foo':'bar'
```

Result: `{'fizz':'buzz','foo':'bar'}`

# set_ifnotnull

Sets a value (if it is not null) at the path within the object and returns the updated object

```xs
{'fizz':'buzz'}|set_ifnotnull:'foo':'bar'
```

Result: `{'fizz':'buzz','foo':'bar'}`

# first_notnull

Returns the first value that is not null

```xs
null|first_notnull:0
```

Result: `0`

# first_notempty

Returns the first value that is not empty - i.e. not ("", null, 0, "0", false, [], {})

```xs
""|first_notempty:1
```

Result: `1`

# unset

Removes a value at the path within the object and returns the updated object

```xs
{'fizz':'buzz','foo':'bar'}|unset:'foo'
```

Result: `{'fizz':'buzz'}`

# transform

Processes an expression with local data bound to the $this variable

```xs
2|transform:$$+3"
```

Result: `5`

# get

Returns the value of an object at the specified path

```xs
{'fizz':'buzz'}|get:'fizz'
```

Result: `"buzz"`

# has

Returns the existence of whether or not something is present in the object at the specified path

```xs
{'fizz':'buzz'}|has:'fizz'
```

Result: `true`

# fill

Create an array of a certain size with a default value.

```xs
"v"|fill:0:6
```

Result: `["v","v","v","v","v","v"]`

# !array_fill:fill

Create an array of a certain size with a default value.

```xs
"v"|array_fill:0:6
```

Result: `["v","v","v","v","v","v"]`

# fill_keys

Create an array of keys with a default value.

```xs
key|fill_keys:["a","b","c"]
```

Result: `{"a":"key","b":"key","c":"key"}`

# !array_fill_keys:fill_keys

Create an array of keys with a default value.

```xs
key|array_fill_keys:["a","b","c"]
```

Result: `{"a":"key","b":"key","c":"key"}`

# keys

Get the property keys of an object/array as a numerically indexed array.

```xs
{"a":1,"b":2,"c":3}|keys
```

Result: `["a","b","c"]`

# !array_keys:keys

Get the property keys of an object/array as a numerically indexed array.

```xs
{"a":1,"b":2,"c":3}|array_keys
```

Result: `["a","b","c"]`

# values

Get the property values of an object/array as a numerically indexed array

```xs
{"a":1,"b":2,"c":3}|values
```

Result: `[1,2,3]`

# !array_values:values

Get the property values of an object/array as a numerically indexed array

```xs
{"a":1,"b":2,"c":3}|array_values
```

Result: `[1,2,3]`

# entries

Get the property entries of an object/array as a numerically indexed array of key/value pairs.

```xs
{"a":1,"b":2,"c":3}|entries
```

Result: `[{key:"a",value:1},{key:"b",value:2},{key:"c",value:3}]`

# !array_entries:entries

Get the property entries of an object/array as a numerically indexed array of key/value pairs.

```xs
{"a":1,"b":2,"c":3}|array_entries
```

Result: `[{key:"a",value:1},{key:"b",value:2},{key:"c",value:3}]`

# to_expr

Converts text into an expression, processes it, and returns the result

```xs
"(2 + 1) % 2"|to_expr
```

Result: `1`

# to_text

Converts integer, decimal, or bool types to text and returns the result

```xs
1.344|to_text
```

Result: `"1.344"`

# to_int

Converts text, decimal, or bool types to an integer and returns the result

```xs
"133.45 kg"|to_int
```

Result: `133`

# to_decimal

Converts text, integer, or bool types to a decimal and returns the result

```xs
"133.45 kg"|to_decimal
```

Result: `133.45`

# to_bool

Converts text, integer, or decimal types to a bool and returns the result

```xs
"true"|to_bool
```

Result: `true`

# to_timestamp

Converts a text expression (now, next friday, Jan 1 2000) to timestamp compatible format.

```xs
"next friday"|to_timestamp:"America/Los_Angeles"
```

Result: `1758265200000`

# !to_epochms:to_timestamp

Converts a text expression (now, next friday, Jan 1 2000) to timestamp compatible format.

```xs
"next friday"|to_epochms:"America/Los_Angeles"
```

Result: `1758265200000`

# to_ms

Converts a text expression (now, next friday, Jan 1 2000) to the number of milliseconds since the unix epoch.

```xs
"next friday"|to_ms:"America/Los_Angeles"
```

Result: `1758265200000`

# !to_epoch_ms:to_ms

Converts a text expression (now, next friday, Jan 1 2000) to the number of milliseconds since the unix epoch.

```xs
"next friday"|to_epoch_ms:"America/Los_Angeles"
```

Result: `1758265200000`

# to_seconds

Converts a text expression (now, next friday, Jan 1 2000) to the number of seconds since the unix epoch.

```xs
"next friday"|to_seconds:"America/Los_Angeles"
```

Result: `1758265200`

# !to_epoch_sec:to_seconds

Converts a text expression (now, next friday, Jan 1 2000) to the number of seconds since the unix epoch.

```xs
"next friday"|to_epoch_sec:"America/Los_Angeles"
```

Result: `1758265200`

# to_minutes

Converts a text expression (now, next friday, Jan 1 2000) to the number of minutes since the unix epoch.

```xs
"next friday"|to_minutes:"America/Los_Angeles"
```

Result: `29304420`

# !to_epoch_minute:to_minutes

Converts a text expression (now, next friday, Jan 1 2000) to the number of minutes since the unix epoch.

```xs
"next friday"|to_epoch_minute:"America/Los_Angeles"
```

Result: `29304420`

# to_hours

Converts a text expression (now, next friday, Jan 1 2000) to the number of hours since the unix epoch.

```xs
"next friday"|to_hours:"America/Los_Angeles"
```

Result: `488407`

# !to_epoch_hour:to_hours

Converts a text expression (now, next friday, Jan 1 2000) to the number of hours since the unix epoch.

```xs
"next friday"|to_epoch_hour:"America/Los_Angeles"
```

Result: `488407`

# to_days

Converts a text expression (now, next friday, Jan 1 2000) to the number of days since the unix epoch.

```xs
"next friday"|to_days:"America/Los_Angeles"
```

Result: `20350`

# !to_epoch_day:to_days

Converts a text expression (now, next friday, Jan 1 2000) to the number of days since the unix epoch.

```xs
"next friday"|to_epoch_day:"America/Los_Angeles"
```

Result: `20350`

# create_object

Creates an object based on a list of keys and a list of values

```xs
["a","b","c"]|create_object:[1,2,3]
```

Result: `{"a":1,"b":2,"c":3}`

# create_object_from_entries

Creates an object based on an array of key/value pairs. (i.e. same result as the entries filter)

```xs
[{key:"a",value:1},{key:"b",value:2},{key:"c",value:3}]|create_object_from_entries
```

Result: `{"a":1,"b":2,"c":3}`

# json_decode

Decodes the value represented as json and returns the result

```xs
"{\"a\":1,\"b\":2,\"c\":3}"|json_decode
```

Result: `{"a":1,"b":2,"c":3}`

# json_encode

Encodes the value and returns the result as json text

```xs
{"a":1,"b":2,"c":3}|json_encode
```

Result: `"{\"a\":1,\"b\":2,\"c\":3}"`

# xml_decode

Decodes XML and returns the result

```xs
"<root><a>1</a><b>2</b><c>3</c></root>"|xml_decode
```

Result:

```json
{
  "root": {
    "@attributes": [],
    "value": [
      {
        "a": {
          "@attributes": [],
          "value": "1"
        }
      },
      {
        "b": {
          "@attributes": [],
          "value": "2"
        }
      }
    ]
  }
}
```

# csv_parse

Parse the contents of a CSV file and convert it into an array of objects.

# csv_decode

Decodes the value represented in the CSV format and returns the result

# csv_encode

Encodes the value and returns the result in CSV format

# csv_create

Creates a CSV format data stream from a list of column names and their corresponding data rows.

# url_decode

Decodes the value represented as a url encoded value

```xs
"Hello%2C%20World%21"|url_decode
```

Result: `"Hello, World!"`

# url_decode_rfc3986

Decodes the value represented as a url encoded value using the RFC 3986 specification

```xs
"Hello%2C%20World%21"|url_decode_rfc3986
```

Result: `"Hello, World!"`

# url_encode

Encodes the value and returns the result as a url encoded value

```xs
"Hello, World!"|url_encode
```

Result: `"Hello%2C%20World%21"`

# url_encode_rfc3986

Encodes the value and returns the result as a url encoded value using the RFC 3986 specification

```xs
"Hello, World!"|url_encode_rfc3986
```

Result: `"Hello%2C%20World%21"`

# url_addarg

Parses a URL and returns an updated version with an encoded version of the supplied argument

```xs
"https://example.com?foo=bar"|url_addarg:"fiz":"buz"
```

Result: `"https://example.com?foo=bar&fiz=buz"`

# url_delarg

Parses a URL and returns an updated version with the supplied argument removed

```xs
"https://example.com?foo=bar&fiz=buz"|url_delarg:"fiz"
```

Result: `"https://example.com?foo=bar"`

# url_hasarg

Returns the existence of a argument in the URL

```xs
"https://example.com?foo=bar&fiz=buz"|url_hasarg:"fiz"
```

Result: `true`

# url_getarg

Gets the argument's value from a URL

```xs
"https://example.com?foo=bar&fiz=buz"|url_getarg:"fiz"
```

Result: `"buz"`

# url_parse

Parses a URL into its individual components.

```xs
"https://username:password@example.com:8080/path?foo=bar&fiz=buz#fragment"|url_parse
```

Result:

````json
{
  "scheme": "https",
  "host": "example.com",
  "port": 8080,
  "user": "username",
  "pass": "password",
  "path": "/path",
  "query": "foo=bar&fiz=buz",
  "fragment": "fragment"
}```

# querystring_parse

Parses a query string from a URL into its individual key-value pairs.

```xs
"foo=bar&fiz=buz"|querystring_parse
````

Result: `{"foo": "bar", "fiz": "buz"}`

# yaml_decode

Decodes the value represented as yaml and returns the result

```xs
"a: 1\nb: 2\nc: 3"|yaml_decode
```

Result: `{"a":1,"b":2,"c":3}`

# yaml_encode

Encodes the value and returns the result as yaml text

```xs
{"a":1,"b":2,"c":3}|yaml_encode
```

Result: `"a: 1\nb: 2\nc: 3\n"`

# hex2bin

Converts a hex value into its binary equivalent

```xs
"68656c6c6f"|hex2bin
```

Result: `"hello"`

# bin2hex

Converts a binary value into its hex equivalent

```xs
"hello"|bin2hex
```

Result: `"68656c6c6f"`

# dechex

Converts a decimal value into its hex equivalent

```xs
"255"|dechex
```

Result: `"ff"`

# hexdec

Converts a hex value into its decimal equivalent

```xs
"ff"|hexdec
```

Result: `"255"`

# decbin

Converts a decimal value into its binary string (i.e. 01010) equivalent

```xs
"10"|decbin
```

Result: `"1010"`

# bindec

Converts a binary string (i.e. 01010) into its decimal equivalent

```xs
"1010"|bindec
```

Result: `"10"`

# decoct

Converts a decimal value into its octal equivalent

```xs
"10"|decoct
```

Result: `"12"`

# octdec

Converts an octal value into its decimal equivalent

```xs
"12"|octdec
```

Result: `"10"`

# base_convert

Converts a value between two bases

```xs
"ff"|base_convert:16:10
```

Result: `"255"`

# base64_decode

Decodes the value represented as base64 text and returns the result

```xs
"aGVsbG8="|base64_decode
```

Result: `"hello"`

# base64_encode

Encodes the value and returns the result as base64 text

```xs
"hello"|base64_encode
```

Result: `"aGVsbG8="`

# base64_decode_urlsafe

Decodes the value represented as base64 urlsafe text and returns the result

```xs
"aGVsbG8_"|base64_decode_urlsafe
```

Result: `"hello?"`

# base64_encode_urlsafe

Encodes the value and returns the result as base64 urlsafe text

```xs
"hello?"|base64_encode_urlsafe
```

Result: `"aGVsbG8_"`

# encrypt

Encrypts the value and returns the result in raw binary form.

```xs
"hello"|encrypt:"aes-192-cbc":"1494AX6XJUsDe51kF9S9sA==":"27222b6032574bad"
```

Result: `"���Z �r|5���~�l"`

# decrypt

Decrypts the value and returns the result.

```xs
"...encrypted..."|decrypt:"aes-192-cbc":"1494AX6XJUsDe51kF9S9sA==":"27222b6032574bad"
```

Result: `"hello"`

# jws_encode

Encodes the value and return the result as a JWS token

```xs
"hello"|jws_encode:{sub: "1234567890",name: "John Doe",admin: true,iat: 1516239022}:"a-string-secret-at-least-256-bits-long":HS256
```

Result: `"...encrypted..."`

# !crypto_jws_encode:jws_encode

Encodes the value and return the result as a JWS token

```xs
"hello"|crypto_jws_encode:{sub: "1234567890",name: "John Doe",admin: true,iat: 1516239022}:"a-string-secret-at-least-256-bits-long":HS256
```

Result: `"...encrypted..."`

# jws_decode

Decodes the JWS token and return the result

```xs
"eyJzd...ZYw"|jws_decode:{}:"a-string-secret-at-least-256-bits-long":HS256
```

Result: `"hello"`

# !crypto_jws_decode:jws_decode

Decodes the JWS token and return the result

```xs
"eyJzd...ZYw"|crypto_jws_decode:{}:"a-string-secret-at-least-256-bits-long":HS256
```

Result: `"hello"`

# jwe_encode

Encodes the value and return the result as a JWE token

```xs
"hello"|jwe_encode:{sub: "1234567890",name: "John Doe",admin: true,iat: 1516239022}:"a-string-secret-at-least-256-bits-long":"A256KW":"A256CBC-HS512"
```

Result: `"...encrypted..."`

# !crypto_jwe_encode:jwe_encode

Encodes the value and return the result as a JWE token

```xs
"hello"|crypto_jwe_encode:{sub: "1234567890",name: "John Doe",admin: true,iat: 1516239022}:"a-string-secret-at-least-256-bits-long":"A256KW":"A256CBC-HS512"
```

Result: `"...encrypted..."`

# jwe_decode

Decodes the JWE token and return the result

```xs
"eyJ...Xw"|jwe_decode:{}:"a-string-secret-at-least-256-bits-long":"A256KW":"A256CBC-HS512"
```

Result: `"hello"`

# !crypto_jwe_decode:jwe_decode

Decodes the JWE token and return the result

```xs
"eyJ...Xw"|crypto_jwe_decode:{}:"a-string-secret-at-least-256-bits-long":"A256KW":"A256CBC-HS512"
```

Result: `"hello"`

# concat

Concatenates two values together

```xs
"Hello" | concat:"World!":" - "
```

Result: `"Hello - World!"`

# sprintf

formats text with variable substitution

```xs
"Hello %s, you have %d new messages"|sprintf:"Bob":5
```

Result: `"Hello Bob, you have 5 new messages"`

# replace

Replace all occurrences of a text phrase with another

```xs
"Hella World"|replace:"o":"a"
```

Result: `"Hella Warld"`

# !string_replace:replace

Replace all occurrences of a text phrase with another

```xs
"Hello World"|string_replace:"o":"a"
```

Result: `"Hella Warld"`

# secureid_encode

Returns an encrypted version of the id

```xs
12345|secureid_encode:"my_salt"
```

Result: `"ZlV3Lg.-0-UZyQ9xQk"`

# secureid_decode

Returns the id of the original encode

```xs
"ZlV3Lg.-0-UZyQ9xQk"|secureid_decode:"my_salt"
```

Result: `12345`

# md5

Returns a MD5 signature representation of the value

```xs
"some_message"|md5
```

Result: `"af8a2aae147de3350f6c0f1a075ede5d"`

# sha1

Returns a SHA1 signature representation of the value

```xs
"some_message"|sha1
```

Result: `"33a374032... (truncated) ..."`

# sha256

Returns a SHA256 signature representation of the value

```xs
"some_message"|sha256
```

Result: `"6cc869f10009fa1... (truncated) ..."`

# sha384

Returns a SHA384 signature representation of the value

```xs
"some_message"|sha384
```

Result: `"17a7717060650457... (truncated) ..."`

# sha512

Returns a SHA512 signature representation of the value

```xs
"some_message"|sha512
```

Result: `"40aaa4e84e7d98e472d240f1c84298de... (truncated) ..."`

# hmac_md5

Returns a MD5 signature representation of the value using a shared secret via the HMAC method

```xs
"some_message"|hmac_md5:MY_SECRET_KEY
```

Result: `"c4c1007ea935001cc7734b360395fb1d"`

# hmac_sha1

Returns a SHA1 signature representation of the value using a shared secret via the HMAC method

```xs
"some_message"|hmac_sha1:MY_SECRET_KEY
```

Result: `"83b48df25eda2... (truncated) ..."`

# hmac_sha256

Returns a SHA256 signature representation of the value using a shared secret via the HMAC method

```xs
"some_message"|hmac_sha256:MY_SECRET_KEY
```

Result: `"3e18fc78d5326e5... (truncated) ..."`

# hmac_sha384

Returns a SHA384 signature representation of the value using a shared secret via the HMAC method

```xs
"some_message"|hmac_sha384:MY_SECRET_KEY
```

Result: `"60818f7b6e6... (truncated) ..."`

# hmac_sha512

Returns a SHA512 signature representation of the value using a shared secret via the HMAC method

```xs
"some_message"|hmac_sha512:MY_SECRET_KEY
```

Result: `"880c17f6d5fa9e1ea3b7... (truncated) ..."`

# create_uid

Returns a unique 64bit unsigned int value seeded off the value

```xs
|create_uid
```

Result: `14567891234567890`

# !uid:create_uid

Returns a unique 64bit unsigned int value seeded off the value

```xs
|uid
```

Result: `14567891234567890`

# uuid

Returns a universally unique identifier

```xs
|uuid
```

Result: `"550e8400-e29b-41d4-a716-446655440000"`

# !uuid4:uuid

Returns a universally unique identifier

```xs
|uuid44
```

Result: `"550e8400-e29b-41d4-a716-446655440000"`

# parse_timestamp

Parse a timestamp from a flexible format.

```xs
"2023-08-15 13:45:30"|parse_timestamp:"Y-m-d H:i:s":"America/Los_Angeles"
```

Result: `"1692132330000"`

# !epochms_from_format:parse_timestamp

Parse a timestamp from a flexible format.

```xs
"2023-08-15 13:45:30"|epochms_from_format:"Y-m-d H:i:s":"America/Los_Angeles"
```

Result: `"1692132330000"`

# format_timestamp

Converts a timestamp into a human readable formatted date based on the supplied format

```xs
"1692132330000"|format_timestamp:"Y-m-d H:i:s":"America/New_York"
```

Result: `"2023-08-15 16:45:30"`

# !epochms_date:format_timestamp

Converts a timestamp into a human readable formatted date based on the supplied format

```xs
"1692132330000"|epochms_date:"Y-m-d H:i:s":"America/New_York"
```

Result: `"2023-08-15 16:45:30"`

# transform_timestamp

Takes a timestamp and applies a relative transformation to it. Ex. -7 days, last Monday, first day of this month

```xs
"2023-08-15T20:45:30.000Z"|transform_timestamp:"-7 days":"America/Los_Angeles"
```

Result: `"1691527530000"`

# !epochms_transform:transform_timestamp

Takes a timestamp and applies a relative transformation to it. Ex. -7 days, last Monday, first day of this month

```xs
"2023-08-15T20:45:30.000Z"|epochms_transform:"-7 days":"America/Los_Angeles"
```

Result: `"1691527530000"`

# add_secs_to_timestamp

Add seconds to a timestamp. (negative values are ok)

```xs
1691527530000|add_secs_to_timestamp:60
```

Result: `1691527590000`

# !epochms_add_secs:add_secs_to_timestamp

Add seconds to a timestamp. (negative values are ok)

```xs
1691527530000|epochms_add_secs:60
```

Result: `1691527590000`

# add_ms_to_timestamp

Add milliseconds to a timestamp. (negative values are ok)

```xs
monday|add_ms_to_timestamp:500
```

Result: `1758499200500`

# !epochms_add_ms:add_ms_to_timestamp

Add milliseconds to a timestamp. (negative values are ok)

```xs
monday|epochms_add_ms:500
```

Result: `1758499200500`

# regex_matches

Tests if a regular expression matches the supplied subject text.

```xs
"/^a.*c$/"|regex_matches:"abbbbc"
```

Result: `true`

# !regex_test:regex_matches

Tests if a regular expression matches the supplied subject text.

```xs
"/^a.*c$/"|regex_test:"abbbbc"
```

Result: `true`

# regex_get_first_match

Return the first set of matches performed by a regular expression on the supplied subject text.

```xs
"/(\w+)@(\w+).(\w+)/"|regex_get_first_match:"test@example.com"
```

Result: `["test@example.com","test","example","com"]`

# !regex_match:regex_get_first_match

Return the first set of matches performed by a regular expression on the supplied subject text.

```xs
"/(\w+)@(\w+).(\w+)/"|regex_match:"test@example.com"
```

Result: `["test@example.com","test","example","com"]`

# regex_get_all_matches

Return all matches performed by a regular expression on the supplied subject text.

```xs
"/\b\w+@\w+.\w+\b/"|regex_get_all_matches:"test@example.com"
```

Result: `[["test@example.com"]]`

# !regex_match_all:regex_get_all_matches

Return all matches performed by a regular expression on the supplied subject text.

```xs
"/\b\w+@\w+.\w+\b/"|regex_match_all:"test@example.com"
```

Result: `[["test@example.com"]]`

# regex_quote

Update the supplied text value to be properly escaped for regular expressions.

```xs
"Hello. How are you?"|regex_quote:"/"
```

Result: `"Hello\\. How are you\\?"`

# regex_replace

Perform a regular expression search and replace on the supplied subject text.

```xs
"/\s+/"|regex_replace:"-":"Hello   World"
```

Result: `"Hello-World"`

# map

Creates a new array with the results of calling a provided function on every element in the calling array.

```xs
[{value: 2}, {value: 5}]|map:$$.value*2
```

Result: `double each value => [4,10]`

# filter

Filters the elements of an array based on the code block returning true to keep the element or false to skip it.

```xs
[{value: 2}, {value: 5}]|filter:$$.value%2==0
```

# some

Checks if at least one element in the array passes the test implemented by the provided function.

```xs
[{value: 2}, {value: 5}]|some:$$.value%2==0
```

Result: `at least one value is even => true`

# every

Checks if all elements in the array pass the test implemented by the provided function.

```xs
[{value: 2}, {value: 6}]|every:$$.value%2==0
```

Result: `all values are even => true`

# find

Finds if all elements in the array pass the test implemented by the provided function.

```xs
[{id: 1}, {id: 2}, {id: 3}]|find:$$.id==2
```

Result: `{id:2}`

# findIndex

Finds the index of the first element in the array that passes the test implemented by the provided function.

```xs
[{id: 1}, {id: 2}, {id: 3}]|findIndex:$$.id==2
```

Result: `1`

# reduce

Reduces the array to a single value using the code block to combine each element of the array.

```xs
[1,2,3,4,5]|reduce:$$+$result:10
```

Result: `25`

# pick

Pick keys from the object to create a new object of just those keys.

```xs
{a:1,b:2,c:3}|pick:[a,c]
```

Result: `{a:1,c:3}`

# unpick

Remove keys from the object to create a new object of the remaining keys.

```xs
{a:1,b:2,c:3}|unpick:[a,c]
```

Result: `{b:2}`
