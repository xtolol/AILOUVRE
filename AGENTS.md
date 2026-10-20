# AILOUVRE: A Daily Gallery investigating Jev Image input

## Brief
See the README.md for details of the project and future plans. This document is solely for coding practices and general rules to follow when contributing to this project.

## Coding Practices
 - All JS Functions should have comment blocks with a one sentence summary regarding the use case of the function and details on params and return variables as @param and @returns.
 - All component exports should follow the same syntax: `export default function FunctionName({ props }) {}`
 - Seperate CSS in a styles folder and import this to the respective component that needs it.
 - At the moment, no testing is required so when implementing a feature, leave it to developers to test for themselves.
 - When commiting refer to the .gitignore always and use standard commit conventions for the message. Example message: "(bug): Page is not responsive with Iphone".
 - Try to implement in steps rather than all at once. Then ask for a review/approval after small thresholds are completed such as a function being made or a sub feature part of a bigger one. During this review explain the function or feature implemented in steps so the developer can follow your approach.
