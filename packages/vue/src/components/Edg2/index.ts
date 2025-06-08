/*
 * We distinguish between internal and exported edges
 * The internal edges are used directly like custom edges and always get an id, source and target props
 * If you import an edge from the library, the id is optional and source and target are not used at all
 */

export { default as BezierEdge } from './BezierEdge.vue';
export { default as SimpleBezierEdge } from './SimpleBezierEdge.vue';
export { default as SmoothStepEdge } from './SmoothStepEdge.vue';
export { default as StepEdge } from './StepEdge.vue';
export { default as StraightEdge } from './StraightEdge.vue';
export { default as EdgeText } from './EdgeText.vue';
export { default as BaseEdge } from './BaseEdge.vue';