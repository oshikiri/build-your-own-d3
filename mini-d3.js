const d3 = {
  select: function (selector) {
    const element = document.querySelector(selector);
    return new Selection([[element]], [document.documentElement]);
  },
  json: async function (path) {
    return fetch(path).then((response) => response.json());
  },
  scaleBand,
  scaleLinear,
  axisLeft,
  axisBottom,
};

class Selection {
  #groups;
  #parents;
  #enter;

  constructor(groups, parents) {
    this.#groups = groups;
    this.#parents = parents;
  }

  append(name) {
    return this.select(function () {
      const child = document.createElementNS(
        "http://www.w3.org/2000/svg",
        name,
      );
      child.__data__ = this.__data__;
      return this.appendChild(child);
    });
  }

  select(selectorOrFunction) {
    const selectFunction = this.#makeSelectFunction(selectorOrFunction);
    const subgroups = this.#groups.map((group) =>
      group.map((node, i) => {
        if (node === null) {
          return undefined;
        }
        const subnode = selectFunction.call(node, node.__data__, i, group);
        if ("__data__" in node) {
          subnode.__data__ = node.__data__;
        }
        return subnode;
      }),
    );

    return new Selection(subgroups, this.#parents);
  }

  #makeSelectFunction(selectorOrFunction) {
    if (typeof selectorOrFunction == "string") {
      return function () {
        return this.querySelector(selectorOrFunction);
      };
    } else {
      return selectorOrFunction;
    }
  }

  attr(key, valueOrFunction) {
    return this.#each(function (__data__) {
      const value = Selection.getValue(valueOrFunction, __data__);
      this.setAttribute(key, value);
      return this;
    });
  }

  static getValue(valueOrFunction, __data__) {
    if (typeof valueOrFunction == "function") {
      return valueOrFunction(__data__);
    } else if (["number", "string"].includes(typeof valueOrFunction)) {
      return String(valueOrFunction);
    } else {
      return valueOrFunction.apply(__data__);
    }
  }

  text(contentOrFunction) {
    return this.#each(function (__data__) {
      const content =
        typeof contentOrFunction === "string"
          ? contentOrFunction
          : contentOrFunction(__data__);
      const textnode = document.createTextNode(content);
      this.appendChild(textnode);
    });
  }

  #each(callback) {
    const groups = this.#groups.map(function (group) {
      return group.map(function (node, i) {
        return callback.call(node, node.__data__, i);
      });
    });
    return new Selection(groups, this.#parents);
  }

  selectAll(selector) {
    const subgroups = [];
    const parents = [];
    this.#groups.forEach((group) => {
      group.forEach((node) => {
        subgroups.push(Array.from(node.querySelectorAll(selector)));
        parents.push(node);
      });
    });
    return new Selection(subgroups, parents);
  }

  data(d) {
    const groupsLength = this.#groups.length;
    const dataLength = d.length;
    const enter = new Array(groupsLength);
    for (let i = 0; i < groupsLength; i++) {
      enter[i] = new Array(dataLength);
      Selection.bindIndex(this.#parents[i], this.#groups[i], enter[i], d);
    }
    this.#enter = enter;
    return this;
  }

  static bindIndex(parent, group, enter, data) {
    for (let i = 0; i < data.length; i++) {
      if (i < group.length) {
        group[i].__data__ = data[i];
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }
  }

  enter() {
    return new Selection(this.#enter || this.#groups, this.#parents);
  }

  call(callback) {
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }
}

class EnterNode {
  constructor(parent, __data__) {
    this.parent = parent;
    this.__data__ = __data__;
  }
  appendChild(child) {
    return this.parent.appendChild(child);
  }
}

function scaleBand() {
  const scale = function (key) {
    const idx = scale.domToIdx[key];
    if (idx === undefined) return undefined;
    const [r0, r1] = scale._range;
    const start = r0 + scale.paddingOuter * scale.step;
    return start + idx * scale.step;
  };
  scale._range = [0, 1];
  scale._domain = [];
  scale.paddingInner = 0;
  scale.paddingOuter = 0;
  scale.step = 0;
  scale._bandwidth = 0;
  scale.domToIdx = {};

  function rescale() {
    const n = scale._domain.length;
    const [r0, r1] = scale._range;
    scale.step = (r1 - r0) / Math.max(1, n - scale.paddingInner + scale.paddingOuter * 2);
    scale._bandwidth = scale.step * (1 - scale.paddingInner);
  }

  scale.range = function (_range) {
    this._range = _range;
    rescale();
    return this;
  };
  scale.domain = function (_domain) {
    this._domain = _domain;
    _domain.forEach((x, i) => {
      this.domToIdx[x] = i;
    });
    rescale();
    return this;
  };
  scale.padding = function (p) {
    this.paddingInner = Math.min(1, p);
    this.paddingOuter = Math.min(1, p);
    rescale();
    return this;
  };
  scale.bandwidth = function () {
    return this._bandwidth;
  };
  scale.getTickPoints = function () {
    return this._domain;
  };
  return scale;
}

function scaleLinear() {
  const scale = function (x) {
    const [xl, xh] = scale._domain;
    const [yl, yh] = scale._range;
    return yl + ((yh - yl) * (x - xl)) / (xh - xl);
  };
  scale._range = [];
  scale._domain = [];
  scale.range = function (_range) {
    this._range = _range;
    return this;
  };
  scale.domain = function (_domain) {
    this._domain = _domain;
    return this;
  };
  scale.getTickPoints = function () {
    return range(this._domain[0], this._domain[1], 5);
  };
  return scale;
}

function range(l, h, stepsize) {
  const values = [];
  for (let current = l; current <= h; current += stepsize) {
    values.push(current);
  }
  return values;
}

const tickLength = 6;
const tickLineWidth = 0.5;

function axisLeft(scale) {
  return function (axisRoot) {
    const mainLineLength = Math.abs(scale._range[1] - scale._range[0]);
    const valueLine =
      `M-${tickLength},${mainLineLength + tickLineWidth} ` +
      `H${tickLineWidth} V${tickLineWidth} H-${tickLength}`;

    axisRoot
      .attr("fill", "none")
      .attr("font-size", "10")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "end");
    axisRoot
      .append("path")
      .attr("class", "domain")
      .attr("stroke", "currentColor")
      .attr("d", valueLine);

    const ticks = axisRoot
      .selectAll(".tick")
      .data(scale.getTickPoints())
      .enter()
      .append("g")
      .attr("class", "tick")
      .attr("opacity", "1")
      .attr("transform", (d) => `translate(0, ${scale(d)})`);

    ticks.append("line").attr("stroke", "currentColor").attr("x2", -tickLength);
    ticks
      .append("text")
      .attr("fill", "currentColor")
      .attr("x", -9)
      .attr("dy", "0.32em")
      .text((d) => d);

    return axisRoot;
  };
}

function axisBottom(scale) {
  return function (axisRoot) {
    const mainLineLength = scale._range[1] - scale._range[0];
    const valueLine =
      `M${tickLineWidth},${tickLength} ` +
      `V${tickLineWidth} H${mainLineLength + tickLineWidth} V${tickLength}`;

    axisRoot
      .attr("fill", "none")
      .attr("font-size", "10")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");
    axisRoot
      .append("path")
      .attr("class", "domain")
      .attr("stroke", "currentColor")
      .attr("d", valueLine);

    const ticks = axisRoot
      .selectAll(".tick")
      .data(scale.getTickPoints())
      .enter()
      .append("g")
      .attr("class", "tick")
      .attr("opacity", "1")
      .attr("transform", (d) => {
        const xTickCenter = scale(d) + scale.bandwidth() / 2.0;
        return `translate(${xTickCenter}, 0)`;
      });
    ticks.append("line").attr("stroke", "currentColor").attr("y2", tickLength);
    ticks
      .append("text")
      .attr("fill", "currentColor")
      .attr("y", 9)
      .attr("dy", "0.71em")
      .text((d) => d);

    return axisRoot;
  };
}
