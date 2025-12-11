query db_external verb=GET {
  input
  stack {
    db.external.mssql.direct_query {
      sql = ""
      response_type = "list"
      connection_string = "mssql://user_name:user_password@domain.com:1433/my_db?sslmode=disabled"
      arg = ""
      arg = ""
    } as $x1
  
    db.external.mysql.direct_query {
      sql = "SELECT * FROM USERS WHERE ID = ?"
      response_type = "list"
      connection_string = "mysql://user_name:user_password@domain.com:3306/my_db?sslmode=disabled"
      arg = $x1
      arg = ""
    } as $x2
  
    db.external.oracle.direct_query {
      sql = "SELECT * FROM USERS"
      response_type = "list"
      connection_string = "oracle://user_name:user_password@domain.com:1521/my_db"
    } as $x3
  
    db.external.postgres.direct_query {
      sql = """
        SELECT * 
        FROM users
        WHERE 
          users.age > 18 AND
          users.gender = 'male'
        ORDER BY
          users.zipcode
        """
    
      response_type = "list"
      connection_string = "postgres://le_user:my%20password@example.com:5432/my_db?sslmode=prefer"
    } as $x4
  }

  response = $x1
}