query all_redis verb=GET {
  input
  stack {
    redis.del {
      key = "name"
    }
  
    redis.set {
      key = "name"
      data = "xano"
      ttl = 0
    }
  
    redis.get {
      key = "xano"
    } as $x1
  
    redis.has {
      key = "name"
    } as $x2
  
    redis.set {
      key = "counter"
      data = 1
      ttl = 0
    }
  
    redis.incr {
      key = "counter"
      by = 1
    } as $x3
  
    redis.decr {
      key = "counter"
      by = 1
    } as $x4
  
    redis.keys {
      search = "name*"
    } as $keys1
  
    redis.set {
      key = "list"
      data = []|push:"FIRST"
      ttl = 0
    }
  
    redis.push {
      key = "list"
      value = "second"
    } as $x5
  
    redis.unshift {
      key = "list"
      value = "zero"
    } as $x6
  
    redis.pop {
      key = "list"
    } as $x7
  
    redis.shift {
      key = "list"
    } as $x8
  
    redis.remove {
      key = "list"
      value = "FIRST"
      count = ""
    }
  
    redis.count {
      key = "list"
    } as $x9
  
    redis.push {
      key = "list"
      value = "second"
    } as $x5
  
    redis.push {
      key = "list"
      value = "second"
    } as $x5
  
    redis.push {
      key = "list"
      value = "second"
    } as $x5
  
    redis.range {
      key = "list"
      start = 0
      stop = 1
    } as $x10
  
    redis.ratelimit {
      key = "list"
      max = 0
      ttl = 60
      error = ""
    } as $ratelimit1
  }

  response = $x1
}