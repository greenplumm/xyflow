/*
 * We distinguish between internal and exported edges
 * The internal edges are used directly like custom edges and always get an id, source and target props
 * If you import an edge from the library, the id is optional and source and target are not used at all
 */
export { default as BaseEdge} from './BaseEdge.vue';
export { default as SimpleBezierEdge, SimpleBezierEdgeInternal } from './SimpleBezierEdge.vue';
export { default as SmoothStepEdge, SmoothStepEdgeInternal } from './SmoothStepEdge.vue';
export { default as StepEdge, StepEdgeInternal } from './StepEdge.vue';
export { default as StraightEdge, StraightEdgeInternal } from './StraightEdge.vue';
export { default as BezierEdgeInternal } from './BezierEdge.vue';
export { default as EdgeText} from './EdgeText.vue';