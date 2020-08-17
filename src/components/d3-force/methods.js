export function isLinkLine(node, link) {
  return (
    link.source[this.nodeKey] == node[this.nodeKey] ||
    link.target[this.nodeKey] == node[this.nodeKey]
  );
}

export function isLinkNode(currNode, node) {
  if (currNode[this.nodeKey] === node[this.nodeKey]) {
    return true;
  }
  return (
    this.linkMap[currNode[this.nodeKey] + "-" + node[this.nodeKey]] ||
    this.linkMap[node[this.nodeKey] + "-" + currNode[this.nodeKey]]
  );
}

//节点hover时改变节点的opacity
export function toggleNode(nodeCircle, currNode, isHover) {
  if (isHover) {
    // 提升节点层级
    // nodeCircle.sort((a, b) => a.id === currNode.id ? 1 : -1);
    // this.parentNode.appendChild(this);
    nodeCircle
      .style("opacity", 0.1)
      .filter(node => {
        return isLinkNode.call(this, currNode, node);
      })
      .style("opacity", 1);
  } else {
    nodeCircle.style("opacity", 1);
  }
}

//节点hover时改变线的opacity
export function toggleLine(linkLine, currNode, isHover) {
  if (isHover) {
    // 加重连线样式
    linkLine
      .style("opacity", 0.1)
      .filter(link => isLinkLine.call(this, currNode, link))
      .style("opacity", 1)
      .classed("link-active", true);
  } else {
    // 连线恢复样式
    linkLine.style("opacity", 1).classed("link-active", false);
  }
}

//节点hover时改变线文字的opacity
export function toggleLineText(lineText, currNode, isHover) {
  if (isHover) {
    // 只显示相连连线文字
    lineText.style("fill-opacity", link =>
      isLinkLine.call(this, currNode, link) ? 1.0 : 0.0
    );
  } else {
    // 显示所有连线文字
    lineText.style("fill-opacity", "1.0");
  }
}

//线hover时改变线的opacity
export function linkToggleLine(currLink, isHover) {
  if (isHover) {
    // 加重连线样式
    this.linkLine
      .style("opacity", 0.1)
      .filter(link => {
        if (
          link.source[this.nodeKey] == currLink.source[this.nodeKey] &&
          link.target[this.nodeKey] == currLink.target[this.nodeKey]
        ) {
          return true;
        } else {
          return false;
        }
      })
      .style("opacity", 1)
      .classed("link-active", true);
  } else {
    // 连线恢复样式
    this.linkLine.style("opacity", 1).classed("link-active", false);
  }
}

//线hover时改变节点的opacity
export function linkToggleNode(currLink, isHover) {
  if (isHover) {
    this.nodeCircle
      .style("opacity", 0.1)
      .filter(
        node =>
          node[this.nodeKey] == currLink.target[this.nodeKey] ||
          node[this.nodeKey] == currLink.source[this.nodeKey]
      )
      .style("opacity", 1);
  } else {
    this.nodeCircle.style("opacity", 1);
  }
}

//线hover时改变线文字的opacity
export function linkToggleLineText(currNode, isHover) {
  if (isHover) {
    // 只显示相连连线文字
    this.lineText.style("fill-opacity", link =>
      link.source[this.nodeKey] == currNode[this.nodeKey] &&
      link.target[this.nodeKey] == currNode[this.nodeKey]
        ? 1.0
        : 0.0
    );
  } else {
    // 显示所有连线文字
    this.lineText.style("fill-opacity", "1.0");
  }
}

//节点选中时的状态
export function nodeToggleClick(currNode) {
  this.nodeCircle
    .select("circle")
    .style("stroke-width", this.nodeConf.strokeWidth);
  this.nodeCircle
    .filter(node => node[this.nodeKey] == currNode[this.nodeKey])
    .select("circle")
    .style("stroke-width", this.nodeConf.strokeWidth + 1);
  toggleNode.call(this, this.nodeCircle, currNode, true);
  toggleLine.call(this, this.linkLine, currNode, true);
  toggleLineText.call(this, this.lineText, currNode, true);
}

//清除状态
export function clearStatus() {
  this.isClick = false;
  this.nodeCircle.style("opacity", 1);
  this.nodeCircle
    .select("circle")
    .style("stroke-width", this.nodeConf.strokeWidth);
  this.lineText.style("fill-opacity", "1.0");
  this.linkLine.style("opacity", 1).classed("link-active", true);
}
