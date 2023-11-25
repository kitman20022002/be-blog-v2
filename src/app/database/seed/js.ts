import { POST_STATUS } from '../../enum/post';
import { readHtmlFile } from '../../utils/readFileUtils';


export const JSConcepts = { 
  name: 'JS',
  items: {
    'var-let-const': {
      name: 'var let const',
      keyPoint: [
        'Definition: Declare variables', 
        'Benefits: const -> let -> var',
        'Examples: eg: const a = 1',
      ],
      description: readHtmlFile('var.html'),
    },
    'arrow-functions' : {
      keyPoint: [
        'Definition: More concise syntax for writing function', 
        'Benefits: does not have own "this" lexically bound',
        'Examples: const sum = (a, b) => a + b;',
      ],
    },
    'promise' : {
      keyPoint: [
        'Definition: Where a function that takes multiple arguments is transformed into a sequence of functions, each taking a single argument.', 
        'Benefits: Code Reusability, Lazy Evaluation (delayed evaluation of a function until all arguments are provided), Increased Readability',
        'Examples: sum(a)(b)(c)',
      ],
    },
    'async-await':{
      keyPoint: [
        'Definition: Composition in programming refers to combining two or more functions to create a new function.', 
        'Benefits: Modularity, Readability, Maintainability, Testability',
        'Examples: const multiplyByTwoAndAddThree = (x) => addThree(multiplyByTwo(x));',
      ],
    },
    'spread-operator': {
      keyPoint: [
        'Definition: Composition in programming refers to combining two or more functions to create a new function.', 
        'Benefits: Modularity, Readability, Maintainability, Testability',
        'Examples: const multiplyByTwoAndAddThree = (x) => addThree(multiplyByTwo(x));',
      ],
    },
    'web-component': {
      keyPoint: [
        'Definition: APIs that allow the definition of new, custom HTML elements.', 
        'Benefits: Enables the creation of reusable and encapsulated elements that can be used across web applications.',
        'Examples: See below',
      ],
      status: POST_STATUS.IN_PROGRESS,
      description: readHtmlFile('web-compoment.html'),
    },
  }, 
};
