function multiline_description {
    description = """
      This function has a description that spans multiple lines.
      It is used to demonstrate how multiline comments are handled in the parser.
      The description should be clear and concise, even when spread across several lines.
      """
    input {
      text value {
        description = "sing line description"
      }

      int number {
        description = """
          This is a multiline description for the number input.
          It can include details about the expected range, format, or any other relevant information.
          For example, this number should be a positive integer.
          It can also include examples or usage notes.
          Make sure to keep it informative and easy to understand.
          """
      }
    }

    stack {

    }

    response = "This function is valid and has a multiline description."
}