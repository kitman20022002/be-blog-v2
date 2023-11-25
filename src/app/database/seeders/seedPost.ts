/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */

import { functionalProgrammingConcepts } from '../seed/functionalProgamming';
import { JSConcepts } from '../seed/js';
import { reactConcepts } from '../seed/react';
import { reactCoreConcepts } from '../seed/react-core';

function camelToKebabCase(str:string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const JavaConcepts = {
  name: 'Functional Programming', 
  items:{
    'highOrderFunctions': {
      name: 'High Order functions',
      keyPoint: [
        'Definition: Takes functions as arguments and return a function as its result', 
        'Benefits: more modular, reusable code',
        'Examples: eg: .map(), filter()',
      ],
    },
  },
};

export const frontEnd:any = { JSConcepts, functionalProgrammingConcepts, reactCoreConcepts, reactConcepts };
const backEnd = { JavaConcepts }; 
const devops = { JavaConcepts }; 
const others = { JavaConcepts };

export const root = { frontEnd, backEnd, devops, others };

export const getStacksByCategory = (category: string) => {
  const matchCategory  = Object.keys(root).find(item => camelToKebabCase(item) === category.toLowerCase());
  if (!matchCategory) {
    return null;
  }
  return root[matchCategory as keyof typeof root];
};

export const getConceptByStack = (stacks:any, stack:string, slug:string)=>{
  const matchStack = Object.keys(stacks).find(item => stacks[item].name.toLowerCase() === stack.toLowerCase());

  if (!matchStack) {
    return null;
  }

  return stacks[matchStack]?.items[slug];
};

/////////////////////////
// 'first-class citizen '
////////////////////////
export const seedPost = async () => {
  // try {
  //   const bulkOps =  functionalProgrammingConcepts.map(post => {
  //     return {
  //       updateOne: {
  //         filter: { title: post.title },
  //         update: { $set: post },
  //         upsert: true,
  //       },
  //     };
  //   });
  //   await Post.bulkWrite(bulkOps)
  //     .catch((err:any) => console.error('Hobby Bulk operation error:', err));
  //   return Post.find({});
  // } catch (err) {
  //   console.error('Error seeding hobbies:', err);
  // }
};
