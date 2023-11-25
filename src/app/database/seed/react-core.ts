export const reactCoreConcepts = { 
  name: 'React Core', 
  items: [
    {
      name: 'Virtual Dom',
      keyPoint: [
        'Definition: Is a lightweight copy of the actual DOM', 
        'Benefits: Efficient updates and rendering of the UI. It provides a way to optimize DOM manipulations, improving the performance of complex applications.',
        'Examples: ',
      ],
    },
    {
      name: 'Reconciliation',
      keyPoint: [
        'Definition: Algorithm compares current state of the Virtual DOM with the previous state determines most efficient way to update browser DOM', 
        'Benefits: Efficient updates and rendering of the UI. It provides a way to optimize DOM manipulations, improving the performance of complex applications.',
        'Examples: ',
      ],
    },
    {
      name: 'Fibers',
      keyPoint: [
        'Definition: Core internal mechanism of Reacts rendering engine. Each fiber represents a work unit related to a React component. It contains information about the component, its input, and its output. Fibers allow React to perform work in chunks, pause work and come back to it, prioritize work, and reuse previously completed work. ', 
        'Benefits: Improved Performance, Better User Experience, Flexibility',
        'Examples: ',
      ],
    },
  ], 
};