declare module "svg" {
  export enum AttributeNames {
    // A
    "accent-height",
    "accumulate",
    "additive",
    "alignment-baseline",
    "alphabetic",
    "amplitude",
    "arabic-form",
    "ascent",
    "attributeName",
    "attributeType",
    "autoReverse",
    "azuimith",
    // B
    "baseFrequency",
    "baseline-shift",
    "baseProfile",
    "bbox",
    "begin",
    "bias",
    "by",
    // C
    "calcMode",
    "cap-height",
    "class",
    "clip",
    "clipPathUnits",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "contentScriptType",
    "contentStyleType",
    "cursor",
    "cx",
    "cy",
    // D
    "d",
    "decelerate",
    "descent",
    "diffuseContent",
    "direction",
    "display",
    "divisor",
    "dominant-baseline",
    "dur",
    "dx",
    "dy",
    // E
    "edgeMode",
    "elevation",
    "enable-background",
    "end",
    "exponent",
    "externalResourcesRequired",
    // F
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "filterRes",
    "filterUnits",
    "flood-color",
    "flood-opacity",
    "font-family",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-variant",
    "font-weight",
    "format",
    "from",
    "fr",
    "fx",
    "fy",
    // G
    "g1",
    "g2",
    "glyph-name",
    "glyph-orientation-horizontal",
    "glyph-orientation-vertical",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    // H
    "hanging",
    "height",
    "href",
    "hreflang",
    "horiz-adv-x",
    "horiz-origin-x",
    // I
    "id",
    "ideographic",
    "image-rendering",
    "in",
    "in2",
    "intercept",
    // K
    "k",
    "k1",
    "k2",
    "k3",
    "k4",
    "kernelMatrix",
    "kernelUnitLength",
    "kerning",
    "keyPoints",
    "keySplines",
    "keyTimes",
    // L
    "lang",
    "lengthAdjust",
    "letter-spacing",
    "lighting-color",
    "limitingConeAngle",
    "local",
    // M
    "marker-end",
    "marker-mid",
    "marker-start",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "mask",
    "maskContentUnits",
    "maskUnits",
    "mathematical",
    "max",
    "media",
    "method",
    "min",
    "mode",
    // N
    "name",
    "numOctaves",
    // O
    "offset",
    "opacity",
    "operator",
    "order",
    "orient",
    "orientation",
    "origin",
    "overflow",
    "overline-position",
    "overline-thickness",
    // P
    "panose-1",
    "paint-order",
    "path",
    "pathLength",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "ping",
    "pointer-events",
    "points",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    // R
    "r",
    "radius",
    "referrerPolicy",
    "refX",
    "refY",
    "rel",
    "rendering-intent",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "restart",
    "result",
    "rotate",
    "rx",
    "ry",
    // S
    "scale",
    "seed",
    "shape-rendering",
    "slope",
    "spacing",
    "specularConstant",
    "specularExponent",
    "speed",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stemh",
    "stemv",
    "stitchTiles",
    "stop-color",
    "stop-opacity",
    "strikethrough-position",
    "strikethrough-thickness",
    "string",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "style",
    "surfaceScale",
    "systemLanguage",
    // T
    "tabindex",
    "tableValues",
    "target",
    "targetX",
    "targetY",
    "text-anchor",
    "text-decoration",
    "text-rendering",
    "textLength",
    "to",
    "transform",
    "type",
    // U
    "u1",
    "u2",
    "underline-position",
    "underline-thickness",
    "unicode",
    "unicode-bidi",
    "unicode-range",
    "units-per-em",
    // V
    "v-alphabetic",
    "v-hanging",
    "v-ideographic",
    "v-mathematical",
    "values",
    "vector-effect",
    "version",
    "vert-adv-y",
    "vert-origin-x",
    "vert-origin-y",
    "viewBox",
    "viewTarget",
    "visibility",
    // W
    "width",
    "widths",
    "word-spacing",
    "writing-mode",
    // X
    "x",
    "x-height",
    "x1",
    "x2",
    "xChannelSelector",
    "xlink:actuate",
    "xlink:arcrole",
    "xlink:href",
    "xlink:role",
    "xlink:show",
    "xlink:title",
    "xlink:type",
    "xml:base",
    "xml:lang",
    "xml:space",
    // Y
    "y",
    "y1",
    "y2",
    "yChannelSelector",
    // Z
    "z",
    "zoomAndPan"
  }

  // SECTION generic

  export interface CoreAttributes {
    "id"?: string;
    "lang"?: string;
    "tabindex"?: string;
    "xml:base"?: string;
    "xml:lang"?: string;
    "xml:space"?: string;
  }

  export interface StyleAttributes {
    "class"?: string;
    "style"?: string;
  }

  export interface ConditionalProcessingAttributes {
    "externalResourcesRequired"?: string;
    "requiredExtensions"?: string;
    "requiredFeatures"?: string;
    "systemLanguage"?: string;
  }

  // !SECTION

  // SECTION XLink

  export interface XLinkAttributes {
    "xlink:href"?: string;
    "xlink:type"?: string;
    "xlink:role"?: string;
    "xlink:arcrole"?: string;
    "xlink:title"?: string;
    "xlink:show"?: string;
    "xlink:actuate"?: string;
  }

  // !SECTION

  // SECTION presentation

  export interface PresentationAttributes {
    "alignment-baseline"?: string;
    "baseline-shift"?: string;
    "clip"?: string;
    "clip-path"?: string;
    "clip-rule"?: string;
    "color"?: string;
    "color-interpolation"?: string;
    "color-interpolation-filters"?: string;
    "color-profile"?: string;
    "color-rendering"?: string;
    "cursor"?: string;
    "direction"?: string;
    "display"?: string;
    "dominant-baseline"?: string;
    "enable-background"?: string;
    "fill"?: string;
    "fill-opacity"?: string;
    "fill-rule"?: string;
    "filter"?: string;
    "flood-color"?: string;
    "flood-opacity"?: string;
    "font-family"?: string;
    "font-size"?: string;
    "font-size-adjust"?: string;
    "font-stretch"?: string;
    "font-style"?: string;
    "font-variant"?: string;
    "font-weight"?: string;
    "glyph-orientation-horizontal"?: string;
    "glyph-orientation-vertical"?: string;
    "image-rendering"?: string;
    "kerning"?: string;
    "letter-spacing"?: string;
    "lighting-color"?: string;
    "marker-end"?: string;
    "marker-mid"?: string;
    "marker-start"?: string;
    "mask"?: string;
    "opacity"?: string;
    "overflow"?: string;
    "pointer-events"?: string;
    "shape-rendering"?: string;
    "stop-color"?: string;
    "stop-opacity"?: string;
    "stroke"?: string;
    "stroke-dasharray"?: string;
    "stroke-dashoffset"?: string;
    "stroke-linecap"?: string;
    "stroke-linejoin"?: string;
    "stroke-miterlimit"?: string;
    "stroke-opacity"?: string;
    "stroke-width"?: string;
    "text-anchor"?: string;
    "transform"?: string;
    "text-decoration"?: string;
    "text-rendering"?: string;
    "unicode-bidi"?: string;
    "vector-effect"?: string;
    "visibility"?: string;
    "word-spacing"?: string;
    "writing-mode"?: string;
  }

  // !SECTION

  // SECTION Filters

  export interface FilterPrimitiveAttributes {
    "height"?: string;
    "result"?: string;
    "width"?: string;
    "x"?: string;
    "y"?: string;
  }

  export interface TransferFunctionAttributes {
    "type"?: string;
    "tableValues"?: string;
    "slope"?: string;
    "intercept"?: string;
    "amplitude"?: string;
    "exponent"?: string;
    "offset"?: string;
  }

  // !SECTION

  // SECTION Animation

  export interface AnimationAttributeTargetAttributes {
    "attributeType"?: string;
    "attributeName"?: string;
  }

  export interface AnimationTimingAttributes {
    "begin"?: string;
    "dur"?: string;
    "end"?: string;
    "min"?: string;
    "max"?: string;
    "restart"?: string;
    "repeatCount"?: string;
    "repeatDur"?: string;
    "fill"?: string;
  }

  export interface AnimationValueAttributes {
    "calcMode"?: string;
    "values"?: string;
    "keyTimes"?: string;
    "keySplines"?: string;
    "from"?: string;
    "to"?: string;
    "by"?: string;
    "autoReverse"?: string;
    "accelerate"?: string;
    "decelerate"?: string;
  }

  export interface AnimationAdditionAttributes {
    "additive"?: string;
    "accumulate"?: string;
  }

  // !SECTION

  // SECTION Event

  export interface AnimationEventAttributes {
    "onbegin": string;
    "onend": string;
    "onrepeat": string;
  }

  export interface DocumentEventAttributes {
    "onabort"?: string;
    "onerror"?: string;
    "onresize"?: string;
    "onscroll"?: string;
    "onunload"?: string;
  }

  export interface GlobalEventAttributes {
    "oncancel"?: string;
    "oncanplay"?: string;
    "oncanplaythrough"?: string;
    "onchange"?: string;
    "onclick"?: string;
    "onclose"?: string;
    "oncuechange"?: string;
    "ondblclick"?: string;
    "ondrag"?: string;
    "ondragend"?: string;
    "ondragenter"?: string;
    "ondragexit"?: string;
    "ondragleave"?: string;
    "ondragover"?: string;
    "ondragstart"?: string;
    "ondrop"?: string;
    "ondurationchange"?: string;
    "onemptied"?: string;
    "onended"?: string;
    "onerror"?: string;
    "onfocus"?: string;
    "oninput"?: string;
    "oninvalid"?: string;
    "onkeydown"?: string;
    "onkeypress"?: string;
    "onkeyup"?: string;
    "onload"?: string;
    "onloadeddata"?: string;
    "onloadedmetadata"?: string;
    "onloadstart"?: string;
    "onmousedown"?: string;
    "onmouseenter"?: string;
    "onmouseleave"?: string;
    "onmousemove"?: string;
    "onmouseout"?: string;
    "onmouseover"?: string;
    "onmouseup"?: string;
    "onmousewheel"?: string;
    "onpause"?: string;
    "onplay"?: string;
    "onplaying"?: string;
    "onprogress"?: string;
    "onratechange"?: string;
    "onreset"?: string;
    "onresize"?: string;
    "onscroll"?: string;
    "onseeked"?: string;
    "onseeking"?: string;
    "onselect"?: string;
    "onshow"?: string;
    "onstalled"?: string;
    "onsubmit"?: string;
    "onsuspend"?: string;
    "ontimeupdate"?: string;
    "ontoggle"?: string;
    "onvolumechange"?: string;
    "onwaiting"?: string;
  }

  export interface GraphicalEventAttributes {
    "onactivate"?: string;
    "onfocusin"?: string;
    "onfocusout"?: string;
  }

  // !SECTION



  export interface SVGElements {
    "a",
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animate",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "color-profile",
    "cursor",
    "defs",
    "desc",
    "discard",
    "Elements",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "font",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignObject",
    "g",
    "glyph",
    "glyphRef",
    "hatch",
    "hatchpath",
    "hkern",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "missing-glyph",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "script",
    "set",
    "solidcolor",
    "stop",
    "style",
    "svg",
    "switch",
    "symbol",
    "text",
    "textPath",
    "title",
    "tref",
    "tspan",
    "use",
    "view",
    "vkern"
  }

  export interface ContentTypes {
    "angle",
    "anything",
    "clock-value",
    "color",
    "Content types",
    "coordinate",
    "frequency",
    "FuncIRI",
    "icccolor",
    "integer",
    "IRI",
    "length",
    "list-of-Ts",
    "name",
    "number",
    "number-optional-number",
    "opacity-value",
    "paint",
    "percentage",
    "time",
    "transform-list",
    "URL"
  }

  export interface SVGAElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, DocumentEventAttributes, GraphicalEventAttributes, PresentationAttributes, XLinkAttributes {
    download?: string;
    href?: string;
    hreflang?: string;
    ping?: string;
    referrerpolicy?: string;
    rel?: string;
    target?: string;
    type?: string;
    /** @deprecated */
    "xlink:href"?: string;
  }

  export interface SVGAnimateElementAttributes extends ConditionalProcessingAttributes, CoreAttributes, AnimationEventAttributes, XLinkAttributes, AnimationAttributeTargetAttributes, AnimationTimingAttributes, AnimationValueAttributes, AnimationAdditionAttributes {
    attributeName?: string;
    attributeType?: string;
    from?: string;
    to?: string;
    dur?: string;
    repeatCount?: string;
  }

  export interface SVGAnimateMotionElementAttributes extends ConditionalProcessingAttributes, CoreAttributes, AnimationEventAttributes, XLinkAttributes, AnimationTimingAttributes, AnimationValueAttributes, AnimationAdditionAttributes {
    calcMode?: string;
    path?: string;
    keyPoints?: string;
    rotate?: string;
    origin?: string;
  }

  export interface SVGAnimateTransformElementAttributes extends ConditionalProcessingAttributes, CoreAttributes, AnimationEventAttributes, XLinkAttributes, AnimationAttributeTargetAttributes, AnimationTimingAttributes, AnimationValueAttributes, AnimationAdditionAttributes {
    by?: string;
    from?: string;
    to?: string;
    type?: string;
  }

  export interface SVGCircleElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, PresentationAttributes {
    cx?: string;
    cy?: string;
    r?: string;
    pathLength?: string;
  }

  export interface SVGClipPathElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, PresentationAttributes {
    clipPathUnits?: string;
  }

  export interface SVGColorProfileElementAttributes extends CoreAttributes, XLinkAttributes {

  }

  export interface SVGEllipseElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, PresentationAttributes {
    cx?: string;
    cy?: string;
    rx?: string;
    ry?: string;
    pathLength?: string;
  }

  export interface SVGFEBlendElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;
    in2?: string;
    mode?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEColorMatrixElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;
    type?: string;
    values?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEComponentTransferElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFECompositeElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string
    in2?: string
    operator?: string
    k1?: string
    k2?: string
    k3?: string
    k4?: string

    class?: string;
    style?: string;
  }

  export interface SVGFEConvolveMatrixElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;
    order?: string;
    kernelMatrix?: string;
    divisor?: string;
    bias?: string;
    targetX?: string;
    targetY?: string;
    edgeMode?: string;
    kernelUnitLength?: string;
    preserveAlpha?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEDiffuseLightingElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;
    surfaceScale?: string;
    diffuseConstant?: string;
    kernelUnitLength?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEDisplacementMapElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;
    in2?: string;
    scale?: string;
    xChannelSelector?: string;
    yChannelSelector?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEDistantLightElementAttributes extends CoreAttributes {
    azumith?: string;
    elevation?: string;
  }

  export interface SVGFEDropShadowElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;
    stdDeviation?: string;
    dx?: string;
    dy?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEFloodElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    "flood-color"?: string;
    "flood-opacity"?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEGaussianBlurElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;
    stdDeviation?: string;
    edgeMode?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEImageElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes, XLinkAttributes {
    preserveAttributeRatio?: string;
    "xlink:href"?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEMergeElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    class?: string;
    style?: string;
  }

  export interface SVGFEMegeNodeElementAttributes extends CoreAttributes {
    in?: string;
  }

  // the study of Morpho
  export interface SVGFEMorphologyElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;
    operator?: string;
    radius?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEOffsetElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;
    dx?: string;
    dy?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFEPointLightElementAttributes extends CoreAttributes {
    x?: string;
    y?: string;
    z?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFESpecularLightingElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;
    surfaceScaling?: string;
    specularConstant?: string;
    specularExponent?: string;
    kernelUnitLength?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFESpotLightElementAttributes extends CoreAttributes {
    x?: string;
    y?: string;
    z?: string;
    pointsAtX?: string;
    pointsAtY?: string;
    pointsAtZ?: string;
    specularExponent?: string;
    limitingConeAngle?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFETileElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    in?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFETurbulenceElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    baseFrequency?: string;
    numOctaves?: string;
    seed?: string;
    stitchTiles?: string;
    type?: string;

    class?: string;
    style?: string;
  }

  export interface SVGFilterElementAttributes extends CoreAttributes, PresentationAttributes, FilterPrimitiveAttributes {
    x?: string;
    y?: string;
    width?: string;
    height?: string;
    filterRes?: string;
    filterUnits?: string;
    primitiveUnits?: string;
    "xlink:href"?: string;

    class?: string;
    style?: string;
  }

  export interface SVGForiegnObjectElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, DocumentEventAttributes, PresentationAttributes {
    height?: string;
    width?: string;
    x?: string;
    y?: string;

    class?: string;
    style?: string;
  }

  export interface SVGGElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, PresentationAttributes {
  }

  export interface SVGLineElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, PresentationAttributes {
    x1?: string;
    x2?: string;
    y1?: string;
    y2?: string;
    pathLength?: string;
  }

  export interface SVGLinearGradientElementAttributes extends CoreAttributes, PresentationAttributes, XLinkAttributes {
    gradientUnits?: string;
    gradientTransform?: string;
    x1?: string;
    y1?: string;
    x2?: string;
    y2?: string;
    spreadMethod?: string;
    "xlink:href"?: string;

    class?: string;
    style?: string;
  }

  export interface SVGMarkerElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, PresentationAttributes {
    markerHeight?: string;
    markerUnits?: string;
    markerWidth?: string;
    orient?: string;
    preserveAspectRatio?: string;
    refX?: string;
    refY?: string;
    viewBox?: string;
  }

  export interface SVGMaskElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, PresentationAttributes {
    height?: string;
    maskContentUnits?: string;
    maskUnits?: string;
    x?: string;
    y?: string;
    width?: string;
  }

  export interface SVGMetadataElementAttributes extends CoreAttributes, GlobalEventAttributes {
  }

  export interface SVGMPathElementAttributes extends CoreAttributes, XLinkAttributes {
    "xlink:href"?: string;
  }

  export interface SVGPathElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, PresentationAttributes {
    d?: string;
    pathLength?: string;
  }

  export interface SVGPatternElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, PresentationAttributes, XLinkAttributes {
    height?: string;
    href?: string;
    patternContentUnits?: string;
    patternTransform?: string;
    patternUnits?: string;
    preserveAspectRatio?: string;
    viewBox?: string;
    width?: string;
    x?: string;
    y?: string;
  }

  export interface SVGPolygonElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, PresentationAttributes {
    points?: string;
    pathLength?: string;
  }

  export interface SVGPolylineElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, PresentationAttributes {
    points?: string;
    pathLength?: string;
  }

  export interface SVGRadialGradientElementAttributes extends CoreAttributes, PresentationAttributes, XLinkAttributes {
    gradientUnits?: string;
    gradientTransform?: string;
    cx?: string;
    cy?: string;
    r?: string;
    fx?: string;
    fy?: string;
    fr?: string;
    spreadMethod?: string;
    "xlink:href"?: string;

    class?: string;
    style?: string;
  }

  export interface SVGRectElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, PresentationAttributes {
    x?: string;
    y?: string;
    width?: string;
    height?: string;
    rx?: string;
    ry?: string;
    pathLength?: string;
  }

  export interface SVGStopElementAttributes extends CoreAttributes, PresentationAttributes {
    offset?: string;
    "stop-color"?: string;
    "stop-opacity"?: string;

    class?: string;
    style?: string;
  }

  export interface SVGSwitchElementAttributes extends ConditionalProcessingAttributes, CoreAttributes, GraphicalEventAttributes, PresentationAttributes {
    class?: string;
    style?: string;
    transform?: string;
  }

  export interface SVGSymbolElementAttributes extends CoreAttributes, StyleAttributes, GlobalEventAttributes, DocumentEventAttributes, GraphicalEventAttributes, PresentationAttributes {
    height?: string;
    preserveAspectRatio?: string;
    refX?: string;
    refY?: string;
    viewBox?: string;
    width?: string;
    x?: string;
    y?: string;
  }

  export interface SVGTextElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, PresentationAttributes {
    x?: string;
    y?: string;
    dx?: string;
    dy?: string;
    rotate?: string;
    lengthAdjust?: string;
    textLength?: string;
  }

  export interface SVGTextPathElementAttributes extends CoreAttributes, StyleAttributes, ConditionalProcessingAttributes, GlobalEventAttributes, GraphicalEventAttributes, PresentationAttributes {
    href?: string;
    lengthAdjust?: string;
    method?: string;
    path?: string;
    side?: string;
    spacing?: string;
    startOffset?: string;
    textLength?: string;
  }

  export interface SVGTSpanElementAttributes extends ConditionalProcessingAttributes, CoreAttributes, GraphicalEventAttributes, PresentationAttributes {
    x?: string;
    y?: string;
    dx?: string;
    dy?: string;
    rotate?: string;
    textLength?: string;
    lengthAdjust?: string;

    class?: string;
    style?: string;
  }
}