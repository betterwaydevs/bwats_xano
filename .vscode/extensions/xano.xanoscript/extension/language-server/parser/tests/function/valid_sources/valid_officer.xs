function "Starfleet/RankCheck" {
  description = "Determines if a user's Starfleet rank is sufficient for a specific mission."
  input {
    text userRank {
      description = "The Starfleet rank of the user (e.g., 'Ensign', 'Lieutenant Commander', 'Captain')."
    }

    text requiredRank {
      description = "The minimum rank needed for the mission (e.g., 'Lieutenant', 'Commander')."
    }
  }

  stack {
    var $rank_order {
      value = {
        "ensign": 1,
        "lieutenant junior grade": 2,
        "lieutenant": 3,
        "lieutenant commander": 4,
        "commander": 5,
        "captain": 6,
        "commodore": 7,
        "rear admiral": 8,
        "vice admiral": 9,
        "admiral": 10
      }
      description = "Defines a numerical order for Starfleet ranks."
    }

    var $user_rank_lower {
      value = $input.userRank|to_lower
      description = "Convert user's rank to lowercase for comparison."
    }

    var $required_rank_lower {
      value = $input.requiredRank|to_lower
      description = "Convert required rank to lowercase for comparison."
    }

    var $user_rank_value {
      value = $rank_order[$user_rank_lower] ?? 0
      description = "Get the numerical rank value for the user, defaulting to 0 if rank is not found."
    }

    var $required_rank_value {
      value = $rank_order[$required_rank_lower] ?? 0
      description = "Get the numerical rank value for the required rank, defaulting to 0 if rank is not found."
    }

    var $is_sufficient {
      value = $user_rank_value >= $required_rank_value
      description = "Compare numerical ranks to determine sufficiency."
    }
  }

  response = $is_sufficient
}