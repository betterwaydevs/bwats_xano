query control_structures verb=GET {
  input {
  }

  stack {
    util.template_engine {
      value = """
        {% set user = {
            'isActive': true,
            'isPending': false
        } %}
        
        {% if user.isActive %}
            Active user
        {% elseif user.isPending %}
            Pending activation
        {% else %}
            Inactive user
        {% endif %}
        """
    } as $elif
  
    util.template_engine {
      value = """
        {% set user = {
            'isActive': true,
            'isPending': false
        } %}
        
        {# Ternary operator #}
        {{ user.isActive ? 'Active' : 'Inactive' }}
        """
    
      disabled = true
    } as $ternary
  
    util.template_engine {
      value = """
        {% set user = {
            'isActive': true,
            'isPending': false
        } %}
        
        {# Inline if with alternate syntax #}
        {% if user is defined %}{{ user }}{% endif %}
        """
    
      disabled = true
    } as $inline_if
  
    util.template_engine {
      value = """
        {% set users = [
            {'name': 'Alice'},
            {'name': 'Bob'},
            {'name': 'Charlie'}
        ] %}
        
        <h1>User List</h1>
        
        <ul>
        {% for user in users %}
            <li>
                {{ user.name }} - 
                Iteration (1-based): {{ loop.index }} - 
                Iteration (0-based): {{ loop.index0 }} - 
                First iteration: {{ loop.first ? 'Yes' : 'No' }} - 
                Last iteration: {{ loop.last ? 'Yes' : 'No' }}
            </li>
        {% else %}
            <li>No users found</li>
        {% endfor %}
        </ul>
        """
    
      disabled = true
    } as $for_loop
  
    util.template_engine {
      value = """
        {% set user = {
            'name': 'Alice',
            'email': 'alice@example.com',
            'age': 30,
            'active': true
        } %}
        
        <h1>User Properties</h1>
        
        <ul>
        {% for key, value in user %}
            <li>{{ key }}: {{ value }}</li>
        {% endfor %}
        </ul>
        """
    } as $loop_over_obj_props
  
    util.template_engine {
      value = """
        {# active-users.html.twig #}
        
        {% set users = [
            {'name': 'Alice', 'active': true},
            {'name': 'Bob', 'active': false},
            {'name': 'Charlie', 'active': true},
            {'name': 'David', 'active': false}
        ] %}
        
        <h1>Active Users</h1>
        
        <ul>
        {% for user in users if user.active %}
            <li>{{ user.name }}</li>
        {% endfor %}
        </ul>
        """
    
      disabled = true
    } as $loop_with_condition
  
    precondition (```
      ($loop_over_obj_props|trim:"") == ("""
        <h1>User Properties</h1>
        
        <ul>
            <li>name: Alice</li>
            <li>email: alice@example.com</li>
            <li>age: 30</li>
            <li>active: 1</li>
        </ul>
        """|trim:"")
      ```)
  
    precondition (($elif|trim:"") == ("Active user"|trim:""))
  }

  response = true

  history = "inherit"
}