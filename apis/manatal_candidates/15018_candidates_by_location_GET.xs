query candidates_by_location verb=GET {
  api_group = "manatal_candidates"

  input {
  }

  stack {
    db.direct_query {
      sql = """
        SELECT
            manatal_candidate.manatal_id,
            manatal_candidate.full_name,
            manatal_candidate.resume,
            manatal_candidate.picture,
            manatal_candidate.linkedin,
            manatal_candidate.address
        FROM x6_143 AS manatal_candidate
        WHERE manatal_candidate.address IN (
            'the most relevants and many others; building Enterprise Applications for Web, Desktop,',
            'tasks assigned by more 100+ different customers and Houston based',
            'software development to create memorable products that drive',
            'road',
            'in the software industry. I''ve been all about building B2B, B2C and AI LLM products recently.',
            'frontend architecture, and I have also contributed to building',
            'expertise in building web applications using popular frameworks like',
            'experience building web applications, rest full apis, microservices using various technologies and',
            'development software teams. I have led teams focus on the building tools',
            'deliver high-quality solutions, and I''m eager to contribute this expertise to drive shared',
            'de proyectos',
            'complete goals such as client acquisition, brand building and increase sales. ● Devised strategies to drive web traffic to company and',
            'building web applications. I''ve worked in multiple projects',
            'am passionate about building high',
            'a commitment to excellence and a drive for innovation.',
            'Vuejs. Proficient in building Web User Interface (UI) using HTML5, CSS3, JavaScript (following W3C Web Standards and',
            'Vue. I also can building backend',
            'Road to code 3.0',
            'Road Freight'
        )
          AND manatal_candidate.linkedin IS NOT NULL
          AND manatal_candidate.linkedin <> ''
          AND manatal_candidate.linkedin <> 'Linkedin'
        ORDER BY manatal_candidate.linkedin
        LIMIT 100;
        """
      response_type = "list"
    } as $x1
  }

  response = $x1
}