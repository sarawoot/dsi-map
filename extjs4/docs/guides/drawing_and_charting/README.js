Ext.data.JsonP.drawing_and_charting({"title":"Drawing and Charting","guide":"<h1>Drawing and Charting</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/drawing_and_charting-section-1'>I. The Draw Package</a></li>\n<li><a href='#!/guide/drawing_and_charting-section-2'>II. Charts</a></li>\n<li><a href='#!/guide/drawing_and_charting-section-3'>III. Series</a></li>\n</ol>\n</div>\n\n<hr />\n\n<p>This document is intended to guide you through the overall design and implementation details\nof the Drawing and Charting packages. The drawing and charting packages enable you to create\ncross browser and cross device graphics in a versatile way.</p>\n\n<p>The structure of this document will cover three main topics:</p>\n\n<ul>\n<li>Section I: \"Draw\" a versatile cross-browser/device package to draw general purpose\ngraphics and animations.</li>\n<li>Section II: \"Chart\" A high level presentation of the charting package and how classes are\norganized in it.</li>\n<li>Section III: \"Series\" A presentation of the available series and their use.</li>\n</ul>\n\n\n<h2 id='drawing_and_charting-section-1'>I. The Draw Package</h2>\n\n<hr />\n\n<p>The design choices in the graphics team concerning drawing were not just contrained to charting:\nwe needed a versatile tool that would enable us to create custom graphics in a cross-browser/device manner and also perform rich animations with them.</p>\n\n<p>The Draw package contains a Surface class that abstracts the underlying graphics implementation\nand enables the developer to create arbitrarily shaped Sprites or SpriteGroups that respond to\ninteractions like mouse events and also provide rich animations on all attributes like shape, color, size,\netc.</p>\n\n<p>The underlying/concrete implementations for the Surface class are SVG (for SVG capable browsers) and\nVML (for the Internet Explorer family - &lt; 9). Surface can be considered as an interface for\nthe SVG and VML rendering engines. Surface is agnostic to its underlying implementations. Most of the methods and ways\nto create sprites are heavily inspired by the <a href=\"http://www.w3.org/TR/SVG/\">SVG standard</a>.</p>\n\n<h3>Creating a Drawing Surface</h3>\n\n<p>You can create a simple drawing surface without loading the Charting package at all. This can be useful\nto create arbitrary graphics that work on all browsers/devices and animate well. For example, you could\ncreate an interactive map of the United States where each state is a sprite, or also an infographic where\neach element is also a sprite. What's interesting about making sprites and not images is that the document\nacquires a new level of interactivity but also that being VML and SVG based the images will never loose quality\nand can be printed correctly.</p>\n\n<p>In order to use the Draw package directly you can create a Draw Component and (for example) append it to an <code><a href=\"#!/api/Ext.window.Window\" rel=\"Ext.window.Window\" class=\"docClass\">Ext.Window</a></code>:</p>\n\n<pre class='inline-example '><code>var drawComponent = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.draw.Component\" rel=\"Ext.draw.Component\" class=\"docClass\">Ext.draw.Component</a>', {\n    viewBox: false,\n    items: [{\n        type: 'circle',\n        fill: '#ffc',\n        radius: 100,\n        x: 100,\n        y: 100\n    }]\n});\n\n<a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.window.Window\" rel=\"Ext.window.Window\" class=\"docClass\">Ext.Window</a>', {\n    width: 230,\n    height: 230,\n    layout: 'fit',\n    items: [drawComponent]\n}).show();\n</code></pre>\n\n<p>In this case we created a draw component and added a sprite to it. The <em>type</em> of the sprite is <em>circle</em> so if you run this code\nyou'll see a yellow-ish circle in a Window. When setting <code>viewBox</code> to <code>false</code> we are responsible for setting the object's position and\ndimensions accordingly.</p>\n\n<p>Sprites can have different types. Some of them are:</p>\n\n<ul>\n<li><em>circle</em> - To draw circles. You can set the radius by using the <em>radius</em> parameter in the sprite configuration.</li>\n<li><em>rect</em> - To render rectangles. You can set the width and height of the rectangle by using the <em>width</em> and <em>height</em> parameters\nin the sprite configuration.</li>\n<li><em>text</em> - To render text as a sprite. You can set the font/font-size by using the <em>font</em> parameter.</li>\n<li><em>path</em> - The most powerful sprite type. With it you can create arbitrary shapes by using the <a href=\"http://www.w3.org/TR/SVG/paths.html\">SVG path syntax</a>.\nYou can find a quick tutorial on to how to get started with\nthe path syntax <a href=\"https://developer.mozilla.org/en/SVG/Tutorial/Paths\">here</a>.</li>\n</ul>\n\n\n<p>A Sprite is an object rendered in a Drawing surface. There are different options and types of sprites.\nThe configuration of a Sprite is an object with the following properties:</p>\n\n<ul>\n<li><strong>type</strong> - (String) The type of the sprite. Possible options are 'circle', 'path', 'rect', 'text', 'square'.</li>\n<li><strong>width</strong> - (Number) Used in rectangle sprites, the width of the rectangle.</li>\n<li><strong>height</strong> - (Number) Used in rectangle sprites, the height of the rectangle.</li>\n<li><strong>size</strong> - (Number) Used in square sprites, the dimension of the square.</li>\n<li><strong>radius</strong> - (Number) Used in circle sprites, the radius of the circle.</li>\n<li><strong>x</strong> - (Number) The position along the x-axis.</li>\n<li><strong>y</strong> - (Number) The position along the y-axis.</li>\n<li><strong>path</strong> - (Array) Used in path sprites, the path of the sprite written in SVG-like path syntax.</li>\n<li><strong>opacity</strong> - (Number) The opacity of the sprite.</li>\n<li><strong>fill</strong> - (String) The fill color.</li>\n<li><strong>stroke</strong> - (String) The stroke color.</li>\n<li><strong>stroke-width</strong> - (Number) The width of the stroke.</li>\n<li><strong>font</strong> - (String) Used with text type sprites. The full font description. Uses the same syntax as the CSS <code>font</code> parameter.</li>\n<li><strong>text</strong> - (String) Used with text type sprites. The text itself.</li>\n</ul>\n\n\n<p>Additionally there are three transform objects that can be set with <code>setAttributes</code> which are <code>translate</code>, <code>rotate</code> and\n<code>scale</code>.</p>\n\n<p>For translate, the configuration object contains x and y attributes for the translation. For example:</p>\n\n<pre><code>sprite.setAttributes({\n  translate: {\n   x: 10,\n   y: 10\n  }\n}, true);\n</code></pre>\n\n<p>For rotate, the configuration object contains x and y attributes for the center of the rotation (which are optional),\nand a degrees attribute that specifies the rotation in degrees. For example:</p>\n\n<pre><code>sprite.setAttributes({\n  rotate: {\n   degrees: 90\n  }\n}, true);\n</code></pre>\n\n<p>For scale, the configuration object contains x and y attributes for the x-axis and y-axis scaling. For example:</p>\n\n<pre><code>sprite.setAttributes({\n  scale: {\n   x: 10,\n   y: 3\n  }\n}, true);\n</code></pre>\n\n<h3>Interacting with a Sprite</h3>\n\n<p>Now that we've created a draw surface with a sprite in it, let's dive into how to interact with the sprite.\nWe can get a handle to the sprite we want to modify by adding that sprite imperatively to the surface:</p>\n\n<pre class='inline-example '><code>// Create a draw component\nvar drawComponent = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.draw.Component\" rel=\"Ext.draw.Component\" class=\"docClass\">Ext.draw.Component</a>', {\n    viewBox: false\n});\n\n// Create a window to place the draw component in\n<a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.window.Window\" rel=\"Ext.window.Window\" class=\"docClass\">Ext.Window</a>', {\n    width: 220,\n    height: 230,\n    layout: 'fit',\n    items: [drawComponent]\n}).show();\n\n// Add a circle sprite\nvar myCircle = drawComponent.surface.add({\n    type: 'circle',\n    x: 100,\n    y: 100,\n    radius: 100,\n    fill: '#cc5'\n});\n\n// Now do stuff with the sprite, like changing its properties:\nmyCircle.setAttributes({\n    fill: '#ccc'\n}, true);\n\n// or animate an attribute on the sprite\nmyCircle.animate({\n    to: {\n        fill: '#555'\n    },\n    duration: 2000\n});\n\n// Add a mouseup listener to the sprite\nmyCircle.addListener('mouseup', function() {\n    alert('mouse upped!');\n});\n</code></pre>\n\n<p>In this example we've seen how we can add events, set sprite attributes and animate these attributes using the\ndraw package. As you can see this package is a versatile abstraction layer over the graphics we can do. What's\nmost interesting about this class is that we aren't tied to a specific shape or structure; also all elements\nsupport events, setting attributes and creating animations. Most important of all, all of this is compatible in all browsers and\ndevices.</p>\n\n<h2 id='drawing_and_charting-section-2'>II. Charts</h2>\n\n<p>So now that we learnt about the expressive power of the draw package, let's dive into charts. The chart\npackage consists of a hierarchy of classes that define a chart container (something like a surface but more specific for\nhandling charts); axes, legends, series, labels, callouts, tips, cartesian and radial coordinates, and specific series\nlike Pie, Area, Bar, etc.</p>\n\n<p>In this section we will cover how these classes are tied together and what bits of functionality go into each of these\nclasses. We won't cover each particular series, since that is done in the next section.</p>\n\n<h3>Chart</h3>\n\n<p>The Chart class is the main drawing surface for series. It manages the rendering of each series and also how axes are\ndrawn and defined. Chart also delegates mouse events over to different areas of the Chart like Series, Axes, etc.\nThe Chart class extends Draw Component.</p>\n\n<p>A Chart instance has access to:</p>\n\n<ul>\n<li>axes - Accessed through <code>chart.axes</code>. All the axes being defined and drawn for this visualization. This is a mixed collection.</li>\n<li>series - Accessed through <code>chart.series</code>. All the series being drawn for the chart. This could be line, bar, scatter, etc. This is also a mixed collection.</li>\n<li>legend - The legend box object and its legend items.</li>\n</ul>\n\n\n<p>The chart instance supports custom events that can be triggered right before and during the rendering of the visualization.\nWe can add handlers for these events by using:</p>\n\n<pre><code>chart.on({\n  'refresh': function() {\n    alert('(re)drawing the chart');\n  }\n});\n</code></pre>\n\n<p>Chart also delegates events like <code>itemmousedown</code> and <code>itemmouseup</code> to the series so that we can append\nlisteners to those objects and get the target sprite of the event.</p>\n\n<h3>Legend</h3>\n\n<p>The chart configuration object accepts a <code>legend</code> parameter to enable legend items for each series and\nto set the position of the legend. These options are passed into the constructor of the chart. For example:</p>\n\n<pre><code>var chart = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.chart.Chart\" rel=\"Ext.chart.Chart\" class=\"docClass\">Ext.chart.Chart</a>', {\n    width: 200,\n    height: 200,\n\n    // Set a legend\n    legend: {\n        position: 'left'\n    },\n\n    // Define axes\n    axes: [/*set an axis configuration*/],\n\n    // Define series\n    series: [/*set series configuration*/]\n});\n</code></pre>\n\n<p>Each series object needs to have the <code>showInLegend</code> parameter set to <code>true</code> in order to be in the legend list.</p>\n\n<h3>Axis</h3>\n\n<p>The <code>axis</code> package contains an <code>Abstract</code> axis class that is extended by <code>Axis</code> and <code>Radial</code> axes. <code>Axis</code> represents\na <code>Cartesian</code> axis and <code>Radial</code> uses polar coordinates to represent the information for polar based visualizations like\nPie and Radar series. Axes are bound to the type of data we're trying to represent. There are axes for categorical\ninformation (called <code>Category</code> axis) and also axis for quantitative information like <code>Numeric</code>. For time-based information\nwe have the <code>Time</code> axis that enables us to render information over a specific period of time, and to update that period of time\nwith smooth animations. If you'd like to know more about each axis please go to the axis package documentation. Also, you will find\nconfiguration examples for axis in the bottom series examples.</p>\n\n<p>An axis contains divisions and subdivisions of values, represented by major and minor ticks. These can be adjusted automatically\nor manually to some specified interval, maximum and minimum values. The configuration options <code>maximum</code>, <code>minimum</code>, <code>majorTickSteps</code> and\n<code>minorTickSteps</code> in the <code>Numeric</code> axis are used to change the configuration and placement of the major and minor ticks. For example, by\nusing:</p>\n\n<pre><code>        axes: [{\n            type: 'Numeric',\n            position: 'left',\n            fields: ['data1'],\n            title: 'Number of Hits',\n            minimum: 0,\n            //one minor tick between two major ticks\n            minorTickSteps: 1\n        }, {\n            type: 'Category',\n            position: 'bottom',\n            fields: ['name'],\n            title: 'Month of the Year'\n        }]\n</code></pre>\n\n<p>The following configuration will produce minor ticks in the left axis\nfor the line series:</p>\n\n<p><p><img src=\"guides/drawing_and_charting/Ticks.jpg\" alt=\"Series Image\"></p></p>\n\n<h3>Gradients</h3>\n\n<p>The drawing and charting package has also the power to create\nlinear gradients. The gradients can be defined in the Chart configuration\nobject as an array of gradient configurations. For each gradient configuration\nthe following parameters are specified:</p>\n\n<ul>\n<li><strong>id</strong> - string - The unique name of the gradient.</li>\n<li><strong>angle</strong> - number, optional - The angle of the gradient in degrees.</li>\n<li><strong>stops</strong> - object - An object with numbers as keys (from 0 to 100) and style objects as values.</li>\n</ul>\n\n\n<p>Each key in the stops object represents the percentage of the fill on the specified color for\nthe gradient.</p>\n\n<p>For example:</p>\n\n<pre><code>    gradients: [{\n        id: 'gradientId',\n        angle: 45,\n        stops: {\n            0: {\n                color: '#555'\n            },\n            100: {\n                color: '#ddd'\n            }\n        }\n    },  {\n        id: 'gradientId2',\n        angle: 0,\n        stops: {\n            0: {\n                color: '#590'\n            },\n            20: {\n                color: '#599'\n            },\n            100: {\n                color: '#ddd'\n            }\n        }\n    }]\n</code></pre>\n\n<p>You can apply a gradient to a sprite by setting a reference to a gradient <strong>id</strong> in\nthe fill property. This reference is done via a url syntax. For example:</p>\n\n<pre><code>    sprite.setAttributes({\n        fill: 'url(#gradientId)'\n    }, true);\n</code></pre>\n\n<h3>Series</h3>\n\n<p>A <code>Series</code> is an abstract class extended by concrete visualizations like\n<code>Line</code> or <code>Scatter</code>. The <code>Series</code> class contains code that is common to all of these series, like event handling, animation\nhandling, shadows, gradients, common offsets, etc. The <code>Series</code> class is enhanced with a set of <em>mixins</em> that provide functionality\nlike highlighting, callouts, tips, etc. A <code>Series</code> will contain an array of <code>items</code> where each item contains information about the\npositioning of each element, its associated <code>sprite</code> and a <code>storeItem</code>. The series also share the <code>drawSeries</code> method that updates\nall positions for the series and then renders the series.</p>\n\n<h3>Theming</h3>\n\n<p>The Chart configuration object may have a <code>theme</code> property with a string value that references a builtin theme name.</p>\n\n<pre><code>var chart = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.chart.Chart\" rel=\"Ext.chart.Chart\" class=\"docClass\">Ext.chart.Chart</a>', {\n    theme: 'Blue',\n    /* Other options... */\n});\n</code></pre>\n\n<p>A Theme defines the style of the shapes, color, font, axes and background\nof a chart. The theming configuration can be very rich and complex:</p>\n\n<pre><code>{\n    axis: {\n        fill: '#000',\n        'stroke-width': 1\n    },\n    axisLabelTop: {\n        fill: '#000',\n        font: '11px Arial'\n    },\n    axisLabelLeft: {\n        fill: '#000',\n        font: '11px Arial'\n    },\n    axisLabelRight: {\n        fill: '#000',\n        font: '11px Arial'\n    },\n    axisLabelBottom: {\n        fill: '#000',\n        font: '11px Arial'\n    },\n    axisTitleTop: {\n        fill: '#000',\n        font: '11px Arial'\n    },\n    axisTitleLeft: {\n        fill: '#000',\n        font: '11px Arial'\n    },\n    axisTitleRight: {\n        fill: '#000',\n        font: '11px Arial'\n    },\n    axisTitleBottom: {\n        fill: '#000',\n        font: '11px Arial'\n    },\n    series: {\n        'stroke-width': 1\n    },\n    seriesLabel: {\n        font: '12px Arial',\n        fill: '#333'\n    },\n    marker: {\n        stroke: '#555',\n        fill: '#000',\n        radius: 3,\n        size: 3\n    },\n    seriesThemes: [{\n        fill: '#C6DBEF'\n    }, {\n        fill: '#9ECAE1'\n    }, {\n        fill: '#6BAED6'\n    }, {\n        fill: '#4292C6'\n    }, {\n        fill: '#2171B5'\n    }, {\n        fill: '#084594'\n    }],\n    markerThemes: [{\n        fill: '#084594',\n        type: 'circle'\n    }, {\n        fill: '#2171B5',\n        type: 'cross'\n    }, {\n        fill: '#4292C6',\n        type: 'plus'\n    }]\n}\n</code></pre>\n\n<p>We can also create a seed of colors that will be the base for the entire theme just by creating\na simple array of colors in the configuration object like:</p>\n\n<pre><code>{\n  colors: ['#aaa', '#bcd', '#eee']\n}\n</code></pre>\n\n<p>When setting a base color the theme will generate an array of colors that match the base color:</p>\n\n<pre><code>{\n  baseColor: '#bce'\n}\n</code></pre>\n\n<p>You can create a custom theme by extending from the base theme. For example, to create a custom <code>Fancy</code> theme we can do:</p>\n\n<pre><code>var colors = ['#555',\n              '#666',\n              '#777',\n              '#888',\n              '#999'];\n\nvar baseColor = '#eee';\n\n<a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('Ext.chart.theme.Fancy', {\n    extend: '<a href=\"#!/api/Ext.chart.theme.Base\" rel=\"Ext.chart.theme.Base\" class=\"docClass\">Ext.chart.theme.Base</a>',\n\n    constructor: function(config) {\n        this.callParent([<a href=\"#!/api/Ext-method-apply\" rel=\"Ext-method-apply\" class=\"docClass\">Ext.apply</a>({\n            axis: {\n                fill: baseColor,\n                stroke: baseColor\n            },\n            axisLabelLeft: {\n                fill: baseColor\n            },\n            axisLabelBottom: {\n                fill: baseColor\n            },\n            axisTitleLeft: {\n                fill: baseColor\n            },\n            axisTitleBottom: {\n                fill: baseColor\n            },\n            colors: colors\n        }, config)]);\n    }\n});\n\nvar chart = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.chart.Chart\" rel=\"Ext.chart.Chart\" class=\"docClass\">Ext.chart.Chart</a>', {\n    theme: 'Fancy',\n\n    /* Other options here... */\n});\n</code></pre>\n\n<h2 id='drawing_and_charting-section-3'>III. Series</h2>\n\n<p>The following section will go through our available series/visualizations, introduce each\none of them and show a complete configuration example of the series. The example will include the <code>Chart</code>,\n<code>Axis</code> and <code>Series</code> configuration options.</p>\n\n<h3>Area</h3>\n\n<p>Creates a Stacked Area Chart. The stacked area chart is useful when displaying multiple aggregated layers of information.\nAs with all other series, the Area Series must be appended in the <em>series</em> Chart array configuration.</p>\n\n<p><p><img src=\"guides/drawing_and_charting/Area.jpg\" alt=\"Series Image\"></p></p>\n\n<p>A typical configuration object for the area series could be:</p>\n\n<pre><code>var chart = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.chart.Chart\" rel=\"Ext.chart.Chart\" class=\"docClass\">Ext.chart.Chart</a>', {\n    renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(),\n    width: 800,\n    height: 600,\n    animate: true,\n    store: store,\n    legend: {\n        position: 'bottom'\n    },\n\n    // Add Numeric and Category axis\n    axes: [{\n        type: 'Numeric',\n        position: 'left',\n        fields: ['data1', 'data2', 'data3'],\n        title: 'Number of Hits',\n        grid: {\n            odd: {\n                opacity: 1,\n                fill: '#ddd',\n                stroke: '#bbb',\n                'stroke-width': 1\n            }\n        },\n        minimum: 0,\n        adjustMinimumByMajorUnit: 0\n    }, {\n        type: 'Category',\n        position: 'bottom',\n        fields: ['name'],\n        title: 'Month of the Year',\n        grid: true,\n        label: {\n            rotate: {\n                degrees: 315\n            }\n        }\n    }],\n\n    // Add the Area Series\n    series: [{\n        type: 'area',\n        highlight: true,\n        axis: 'left',\n        xField: 'name',\n        yField: ['data1', 'data2', 'data3'],\n        style: {\n            opacity: 0.93\n        }\n    }]\n});\n</code></pre>\n\n<h3>Bar</h3>\n\n<p>Creates a Bar Chart. A Bar Chart is a useful visualization technique to display quantitative information for different\ncategories that can show some progression (or regression) in the dataset.\nAs with all other series, the Bar Series must be appended in the <em>series</em> Chart array configuration. See the Chart\ndocumentation for more information.</p>\n\n<p><p><img src=\"guides/drawing_and_charting/Bar.jpg\" alt=\"Series Image\"></p></p>\n\n<p>A typical configuration object for the bar series could be:</p>\n\n<pre><code>var chart = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.chart.Chart\" rel=\"Ext.chart.Chart\" class=\"docClass\">Ext.chart.Chart</a>', {\n    renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(),\n    width: 800,\n    height: 600,\n    animate: true,\n    store: store,\n    theme: 'White',\n    axes: [{\n        type: 'Numeric',\n        position: 'bottom',\n        fields: ['data1'],\n        title: 'Number of Hits'\n    }, {\n        type: 'Category',\n        position: 'left',\n        fields: ['name'],\n        title: 'Month of the Year'\n    }],\n    //Add Bar series.\n    series: [{\n        type: 'bar',\n        axis: 'bottom',\n        xField: 'name',\n        yField: 'data1',\n        highlight: true,\n        label: {\n            display: 'insideEnd',\n            field: 'data1',\n            renderer: <a href=\"#!/api/Ext.util.Format-method-numberRenderer\" rel=\"Ext.util.Format-method-numberRenderer\" class=\"docClass\">Ext.util.Format.numberRenderer</a>('0'),\n            orientation: 'horizontal',\n            color: '#333',\n           'text-anchor': 'middle'\n        }\n    }]\n});\n</code></pre>\n\n<h3>Line</h3>\n\n<p>Creates a Line Chart. A Line Chart is a useful visualization technique to display quantitative information for different\ncategories or other real values (as opposed to the bar chart), that can show some progression (or regression) in the dataset.\nAs with all other series, the Line Series must be appended in the <em>series</em> Chart array configuration. See the Chart\ndocumentation for more information.</p>\n\n<p><p><img src=\"guides/drawing_and_charting/Line.jpg\" alt=\"Series Image\"></p></p>\n\n<p>A typical configuration object for the line series could be:</p>\n\n<pre><code>var chart = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.chart.Chart\" rel=\"Ext.chart.Chart\" class=\"docClass\">Ext.chart.Chart</a>', {\n    renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(),\n    width: 800,\n    height: 600,\n    animate: true,\n    store: store,\n    shadow: true,\n    theme: 'Category1',\n    axes: [{\n        type: 'Numeric',\n        minimum: 0,\n        position: 'left',\n        fields: ['data1', 'data2', 'data3'],\n        title: 'Number of Hits'\n    }, {\n        type: 'Category',\n        position: 'bottom',\n        fields: ['name'],\n        title: 'Month of the Year'\n    }],\n\n    // Add two line series\n    series: [{\n        type: 'line',\n        axis: 'left',\n        xField: 'name',\n        yField: 'data1',\n        markerConfig: {\n            type: 'cross',\n            size: 4,\n            radius: 4,\n            'stroke-width': 0\n        }\n    }, {\n        type: 'line',\n        axis: 'left',\n        fill: true,\n        xField: 'name',\n        yField: 'data3',\n        markerConfig: {\n            type: 'circle',\n            size: 4,\n            radius: 4,\n            'stroke-width': 0\n        }\n    }]\n});\n</code></pre>\n\n<p>A marker configuration object contains the same properties used to create a Sprite.\nYou can find the properties used to create a Sprite in the Sprite section above.</p>\n\n<h3>Pie</h3>\n\n<p>Creates a Pie Chart. A Pie Chart is a useful visualization technique to display quantitative information for different\ncategories that also have a meaning as a whole.\nAs with all other series, the Pie Series must be appended in the <em>series</em> Chart array configuration. See the Chart\ndocumentation for more information. A typical configuration object for the pie series could be:</p>\n\n<p><p><img src=\"guides/drawing_and_charting/Pie.jpg\" alt=\"Series Image\"></p></p>\n\n<p>A typical configuration object for the pie series could be:</p>\n\n<pre><code>var chart = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.chart.Chart\" rel=\"Ext.chart.Chart\" class=\"docClass\">Ext.chart.Chart</a>', {\n    width: 800,\n    height: 600,\n    animate: true,\n    shadow: true,\n    store: store,\n    renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(),\n    legend: {\n        position: 'right'\n    },\n    insetPadding: 25,\n    theme: 'Base:gradients',\n    series: [{\n        type: 'pie',\n        field: 'data1',\n        showInLegend: true,\n        highlight: {\n          segment: {\n            margin: 20\n          }\n        },\n        label: {\n            field: 'name',\n            display: 'rotate',\n            contrast: true,\n            font: '18px Arial'\n        }\n    }]\n});\n</code></pre>\n\n<h3>Radar</h3>\n\n<p>Creates a Radar Chart. A Radar Chart is a useful visualization technique for comparing different quantitative values for\na constrained number of categories.\nAs with all other series, the Radar series must be appended in the <em>series</em> Chart array configuration. See the Chart\ndocumentation for more information.</p>\n\n<p><p><img src=\"guides/drawing_and_charting/Radar.jpg\" alt=\"Series Image\"></p></p>\n\n<p>A typical configuration object for the radar series could be:</p>\n\n<pre><code>var chart = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.chart.Chart\" rel=\"Ext.chart.Chart\" class=\"docClass\">Ext.chart.Chart</a>', {\n    width: 800,\n    height: 600,\n    animate: true,\n    store: store,\n    renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(),\n    insetPadding: 20,\n    theme: 'Category2',\n    axes: [{\n        type: 'Radial',\n        position: 'radial',\n        label: {\n            display: true\n        }\n    }],\n\n    // Add two series for radar.\n    series: [{\n        type: 'radar',\n        xField: 'name',\n        yField: 'data1',\n        showMarkers: true,\n        markerConfig: {\n            radius: 5,\n            size: 5\n        },\n        style: {\n            'stroke-width': 2,\n            fill: 'none'\n        }\n    },{\n        type: 'radar',\n        xField: 'name',\n        yField: 'data3',\n        showMarkers: true,\n        markerConfig: {\n            radius: 5,\n            size: 5\n        },\n        style: {\n            'stroke-width': 2,\n            fill: 'none'\n        }\n    }]\n});\n</code></pre>\n\n<h3>Scatter</h3>\n\n<p>Creates a Scatter Chart. The scatter plot is useful when trying to display more than two variables in the same visualization.\nThese variables can be mapped into x, y coordinates and also to an element's radius/size, color, etc.\nAs with all other series, the Scatter Series must be appended in the <em>series</em> Chart array configuration. See the Chart\ndocumentation for more information on creating charts.</p>\n\n<p><p><img src=\"guides/drawing_and_charting/Scatter.jpg\" alt=\"Series Image\"></p></p>\n\n<p>A typical configuration object for the scatter series could be:</p>\n\n<pre><code>var chart = <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.chart.Chart\" rel=\"Ext.chart.Chart\" class=\"docClass\">Ext.chart.Chart</a>', {\n    width: 800,\n    height: 600,\n    animate: true,\n    store: store,\n    renderTo: <a href=\"#!/api/Ext-method-getBody\" rel=\"Ext-method-getBody\" class=\"docClass\">Ext.getBody</a>(),\n    axes: [{\n        type: 'Numeric',\n        position: 'left',\n        fields: ['data1', 'data2', 'data3'],\n        title: 'Number of Hits'\n    }],\n    series: [{\n        type: 'scatter',\n        markerConfig: {\n            radius: 5,\n            size: 5\n        },\n        axis: 'left',\n        xField: 'name',\n        yField: 'data1',\n        color: '#a00'\n    }, {\n        type: 'scatter',\n        markerConfig: {\n            radius: 5,\n            size: 5\n        },\n        axis: 'left',\n        xField: 'name',\n        yField: 'data2'\n    }, {\n        type: 'scatter',\n        markerConfig: {\n            radius: 5,\n            size: 5\n        },\n        axis: 'left',\n        xField: 'name',\n        yField: 'data3'\n    }]\n});\n</code></pre>\n\n<h3>Gauge</h3>\n\n<p>Creates a Gauge Chart. Gauge Charts are used to show progress in a certain variable. There are two ways of using the Gauge chart.\nOne is setting a store element into the Gauge and selecting the field to be used from that store. Another one is instantiating the\n visualization and using the <code>setValue</code> method to adjust the value you want.</p>\n\n<p><p><img src=\"guides/drawing_and_charting/Gauge.jpg\" alt=\"Series Image\"></p></p>\n\n<p>A chart/series configuration for the Gauge visualization could look like this:</p>\n\n<pre><code>{\n    xtype: 'chart',\n    store: store,\n    axes: [{\n        type: 'gauge',\n        position: 'gauge',\n        minimum: 0,\n        maximum: 100,\n        steps: 10,\n        margin: -10\n    }],\n    series: [{\n        type: 'gauge',\n        field: 'data1',\n        donut: false,\n        colorSet: ['#F49D10', '#ddd']\n    }]\n}\n</code></pre>\n\n<p>In this configuration we create a special Gauge axis to be used with the gauge visualization (describing half-circle markers), and also we're\nsetting a maximum, minimum and steps configuration options into the axis. The Gauge series configuration contains the store field to be bound to\nthe visual display and the color set to be used with the visualization.</p>\n"});