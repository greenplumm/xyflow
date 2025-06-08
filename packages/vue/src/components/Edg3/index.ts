/*
 * 我们区分内部和导出的边缘组件
 * 内部边缘组件直接用作自定义边缘，并始终具有id、source和target属性
 * 如果从库中导入边缘组件，则id是可选的，并且完全不使用source和target
 */

export { default as BaseEdge } from './BaseEdge.vue';
export { default as EdgeText } from './EdgeText.vue';
export { default as SimpleBezierEdge } from './SimpleBezierEdge.vue';
export { default as SmoothStepEdge } from './SmoothStepEdge.vue';
export { default as StepEdge } from './StepEdge.vue';
export { default as StraightEdge } from './StraightEdge.vue';
export { default as BezierEdge } from './BezierEdge.vue';

export { default as BezierEdgeInternal } from './BezierEdge.vue';
export { default as StraightEdgeInternal } from './StraightEdge.vue';
export { default as StepEdgeInternal } from './StepEdge.vue';
export { default as SmoothStepEdgeInternal } from './SmoothStepEdge.vue';
export { default as SimpleBezierEdgeInternal } from './SimpleBezierEdge.vue';
export { default as EdgeTextInternal } from './EdgeText.vue';