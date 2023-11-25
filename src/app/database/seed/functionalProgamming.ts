export const functionalProgrammingConcepts = {
  name: 'Functional Programming', 
  items:[
    {
      name: 'High Order functions',
      keyPoint: [
        'Definition: Takes functions as arguments and return a function as its result', 
        'Benefits: more modular, reusable code',
        'Examples: eg: .map(), filter()',
      ],
    },
    {
      name: 'Pure functions',
      keyPoint: [
        'Definition: Returns the same output for the same input, no side effect', 
        'Benefits: Predictability,Testability,Reusability, Maintainability',
        'Examples: sum(a,b)',
      ],
    },
    {
      name: 'Currying',
      keyPoint: [
        'Definition: Where a function that takes multiple arguments is transformed into a sequence of functions, each taking a single argument.', 
        'Benefits: Code Reusability, Lazy Evaluation (delayed evaluation of a function until all arguments are provided), Increased Readability',
        'Examples: sum(a)(b)(c)',
      ],
    },
    {
      name: 'Composition',
      keyPoint: [
        'Definition: Composition in programming refers to combining two or more functions to create a new function.', 
        'Benefits: Modularity, Readability, Maintainability, Testability',
        'Examples: const multiplyByTwoAndAddThree = (x) => addThree(multiplyByTwo(x));',
      ],
    },
  ],
};
