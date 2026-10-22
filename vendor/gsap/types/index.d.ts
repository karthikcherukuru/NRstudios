// Type definitions for gsap 3
// Project: https://gsap.com/
// Definitions by: Jack Doyle <https://github.com/jackdoyle>
//                 Blake Bowen <https://github.com/OSUblake>
//                 Pedro Tavares <https://github.com/dipscom>
//                 Zach Saucier <https://github.com/ZachSaucier>
// Definitions: https://github.com/greensock/GSAP

/// <reference path="animation.d.ts"/>
/// <reference path="css-plugin.d.ts"/>
/// <reference path="ease.d.ts"/>
/// <reference path="gsap-plugins.d.ts"/>
/// <reference path="gsap-utils.d.ts"/>
/// <reference path="timeline.d.ts"/>
/// <reference path="tween.d.ts"/>
/// <reference path="gsap-core.d.ts"/>

// Global types
type GSAPAnimation = gsap.core.Animation;
type GSAPCallback = gsap.Callback;
type GSAPDistributeConfig = gsap.utils.DistributeConfig;
type GSAPPlugin = gsap.Plugin;
type GSAPPluginScope = gsap.PluginScope;
type GSAPPluginStatic = gsap.PluginStatic;
type GSAPStaggerVars = gsap.StaggerVars;
type GSAPTickerCallback = gsap.TickerCallback;
type GSAPTimeline = gsap.core.Timeline;
type GSAPTimelineVars = gsap.TimelineVars;
type GSAPTween = gsap.core.Tween;
type GSAPTweenTarget = gsap.TweenTarget;
type GSAPTweenVars = gsap.TweenVars;

type GSAP = typeof gsap;

declare module "gsap" {
  export * from "gsap/gsap-core";
  export { gsap as default } from "gsap/gsap-core";
}

declare module "gsap/src" {
  export * from "gsap";
  export { gsap as default } from "gsap";
}

declare module "gsap/src/index" {
  export * from "gsap";
  export { gsap as default } from "gsap";
}

declare module "gsap/dist" {
  export * from "gsap";
  export { gsap as default } from "gsap";
}

declare module "gsap/dist/gsap" {
  export * from "gsap";
  export { gsap as default } from "gsap";
}

declare module "gsap/all" {
  export * from "gsap";
  export { gsap as default } from "gsap";
}

declare module "gsap/src/all" {
  export * from "gsap/all";
  export { gsap as default } from "gsap/all";
}

declare module "gsap-trial" {
  export * from "gsap/gsap-core";
  export { gsap as default } from "gsap/gsap-core";
}

declare module "gsap-trial/src" {
  export * from "gsap";
  export { gsap as default } from "gsap";
}

declare module "gsap-trial/src/index" {
  export * from "gsap";
  export { gsap as default } from "gsap";
}

declare module "gsap-trial/dist" {
  export * from "gsap";
  export { gsap as default } from "gsap";
}

declare module "gsap-trial/dist/gsap" {
  export * from "gsap";
  export { gsap as default } from "gsap";
}

declare module "gsap-trial/all" {
  export * from "gsap";
  export { gsap as default } from "gsap";
}

declare module "gsap-trial/src/all" {
  export * from "gsap/all";
  export { gsap as default } from "gsap/all";
}

