function array_functions {
  input {
  }

  stack {
    var $json {
      value = [
  {
    "_id": "6900e859251a9c0bf81feef8",
    "index": 0,
    "isActive": false,
    "age": 24,
    "name": "Aguilar Whitehead",
    "gender": "male"
  },
  {
    "_id": "6900e859fce05fec39869537",
    "index": 1,
    "isActive": true,
    "age": 24,
    "name": "Kay Higgins",
    "gender": "female"
  },
  {
    "_id": "6900e8596bac5247d793238f",
    "index": 2,
    "isActive": true,
    "age": 25,
    "name": "Leigh Frederick",
    "gender": "female"
  },
  {
    "_id": "6900e859f3a896081f4520a8",
    "index": 3,
    "isActive": false,
    "age": 21,
    "name": "Krystal Colon",
    "gender": "female"
  },
  {
    "_id": "6900e859023839f86f579d73",
    "index": 4,
    "isActive": false,
    "age": 22,
    "name": "Daniels Workman",
    "gender": "male"
  },
  {
    "_id": "6900e859756c6b3e882c9244",
    "index": 5,
    "isActive": true,
    "age": 33,
    "name": "Mccormick Perkins",
    "gender": "male"
  },
  {
    "_id": "6900e8596bc2768908f0bf30",
    "index": 6,
    "isActive": true,
    "age": 23,
    "name": "Dixie Cabrera",
    "gender": "female"
  },
  {
    "_id": "6900e859aa0822a778b99f69",
    "index": 7,
    "isActive": true,
    "age": 23,
    "name": "Battle James",
    "gender": "male"
  },
  {
    "_id": "6900e859e5098eb59309df64",
    "index": 8,
    "isActive": true,
    "age": 26,
    "name": "Petty Armstrong",
    "gender": "male"
  },
  {
    "_id": "6900e859f2b37bedb90cb73f",
    "index": 9,
    "isActive": false,
    "age": 35,
    "name": "Parsons Lloyd",
    "gender": "male"
  }
]
    }
  
    array.map ($json) {
      by = $this.email
    } as $emails
  
    array.map ($json) {
      by = {name: $this.name, gender: $this.gender}
    } as $people
  
    array.partition ($json) if ($this.gender == "male") as $is_male
    array.group_by ($json) {
      by = $this.isActive
    } as $is_active
  
    array.difference ([1,2,3,4,5,6,7,8,9]) {
      value = [2,4,6,8]
      by = $this
    } as $difference
  
    array.intersection ([1,2,3,4,5,6,7,8,9]) {
      value = [2,4,6,8]
      by = $this
    } as $intersection
  
    array.union ([1,3,5,7,9]) {
      value = [2,4,6,8]
      by = $this
    } as $union
  }

  response = {
    emails      : $emails
    people      : $people
    is_male     : $is_male
    is_active   : $is_active
    difference  : $difference
    intersection: $intersection
    union       : $union
  }
}