export const reactConcepts = {
  name: 'React', 
  items: [
    {
      name: 'High Order Components',
      keyPoint: [
        'Definition: A HOC is a function that takes a component and returns a new component.', 
        'Benefits: more modular, reusable code',
        'Examples: eg: this.children',
      ],
    },
    {
      name: 'Context API',
      keyPoint: [
        'Definition: Managing state globally across an entire React app', 
        'Benefits: avoid props drilling, easy to use, improves performance, Readability',
        'Examples: user, theme, or preferred language',
      ],
    },
    {
      name: 'Hooks',
      keyPoint: [
        'Definition: they provide a way to use stateful logic in functional components.', 
        'Benefits: n/a',
        'Examples: useState(), ',
      ],
    },
    {
      name: 'State',
      keyPoint: [
        'Definition: Similar to a variable which we can call or assign a value, due to how react works we cannot just use a variables', 
        'Benefits: Code Reusability, Lazy Evaluation (delayed evaluation of a function until all arguments are provided), Increased Readability',
        'Examples: const [number, setNumber] = useState(0)',
      ],
    },
    {
      name: 'Props',
      keyPoint: [
        'Definition: Properties to pass data from parent components to child components', 
        'Benefits: Predictability and Readability(Read only)',
        'Examples: function Comp(props) { const {abc} = props; }',
      ],
    },
  ], 
};