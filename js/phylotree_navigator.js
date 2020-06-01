class PhylotreeNavigator {
  constructor (phylotree, zoom) {
    this.$svg = $('svg#tree_display')
    this.svg = phylotree.get_svg();

    this.phylotree = phylotree
    this.zoom = zoom

    // this.drawGrid()
  }

  // For debugging
  drawGrid () {
    var step = 100

    for (var i=step; i<=1000; i+=step) {
      this.svg.insert('rect')
      .attr('x', i)
      .attr('y', 0)
      .attr('width', 1)
      .attr('height', 50)
      .style('fill', 'red')
      .style('stroke', 'none')

      this.svg.insert('rect')
      .attr('x', 0)
      .attr('y', i)
      .attr('width', 50)
      .attr('height', 1)
      .style('fill', 'red')
      .style('stroke', 'none')
    }

    var svg_width = this.$svg.width()
    var svg_height = this.$svg.height()

    this.svg.insert('rect')
      .attr('x', svg_width/2)
      .attr('y', 0)
      .attr('width', 1)
      .attr('height', svg_height)
      .style('fill', 'grey')
      .style('stroke', 'none')

    this.svg.insert('rect')
      .attr('x', 0)
      .attr('y', svg_height/2)
      .attr('width', svg_width)
      .attr('height', 1)
      .style('fill', 'grey')
      .style('stroke', 'none')
  }

  panToLeaf (node) {
    if (!node.is_leaf()) {
      return false
    }

    var transform = this.phylotree.get_current_transform()
    var current_zoom = transform.scale[0]

    var original_bbox = node.getBBox()
    original_bbox.x += this.phylotree.get_offsets()[1]

    var node_x = original_bbox.x
    var node_y = original_bbox.y + ((original_bbox.height)/2)

    var trans_x = (this.$svg.width()/2) + (this.phylotree.get_offsets()[1] - node_x)*current_zoom
    var trans_y = (this.$svg.height()/2) - (node_y*current_zoom)

    transform.translate[0] = trans_x
    transform.translate[1] = trans_y

    this.phylotree.current_translate = transform.translate

    d3.select("." + this.phylotree.get_css_classes()["tree-container"])
        .attr("transform", "translate(" + transform.translate + ")scale(" + transform.scale + ")");

    this.zoom.translate(transform.translate)

    this.phylotree.redraw_scale_bar()
  }
}

module.exports = PhylotreeNavigator