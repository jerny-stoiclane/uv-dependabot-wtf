import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

interface DonutChartProps<T extends { value: number }> {
  data: T[];
  width: number;
  height: number;
  radius: number;
  thickness: number;
  colors: string[];
  labels: string[];
  index?: number;
  middleText?: string;
}

const DonutChart = <T extends { value: number }>({
  data,
  width,
  height,
  radius,
  thickness,
  colors,
  labels,
  index = 1,
  middleText,
}: DonutChartProps<T>) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // delays the animations based on the index if multiple charts
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 200 + index * 100);

    return () => clearTimeout(timeout);
  }, [index]);

  // render the donut
  useEffect(() => {
    let tooltip: any = null;
    if (d3Container.current) {
      const svg = d3
        .select(d3Container.current)
        .attr('viewBox', [-width / 2, -height / 2, width, height].join(' '))
        .style('width', '100%')
        .style('height', 'auto');

      svg.selectAll('*').remove();

      const pie = d3
        .pie<T>()
        .value((d) => d.value)
        .sort(null);

      const dataReady = pie(data);

      const arc = d3
        .arc<d3.PieArcDatum<T>>()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

      const emptyArc = d3
        .arc<d3.PieArcDatum<T>>()
        .innerRadius(radius - thickness)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(2 * Math.PI);

      const arcHover = d3
        .arc<T & d3.PieArcDatum<T>>()
        .innerRadius(radius - thickness)
        .outerRadius(radius + thickness / 2);

      tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '10px');

      if (data.every((d) => d.value === 0)) {
        svg
          .append('path')
          .attr('d', emptyArc as any)
          .attr('fill', '#f0f0f0')
          .attr('stroke', 'white')
          .style('stroke-width', '2px')
          .style('opacity', 0.7);
      } else {
        const paths = svg
          .selectAll('whatever')
          .data<T & d3.PieArcDatum<T>>(dataReady as (T & d3.PieArcDatum<T>)[])
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', (_d, i) =>
            dataReady[i].value === 0 ? '#f0f0f0' : colors[i]
          )
          .attr('stroke', 'white')
          .style('stroke-width', '2px')
          .style('opacity', 0.7);

        // hover effect for arcs/tooltip handling
        if (!middleText) {
          paths
            .on('mouseover', function (event, d: any) {
              const path = d3.select(this);
              path
                .transition()
                .duration(200)
                .attr('d', arcHover as any)
                .style('opacity', 1);

              tooltip.transition().duration(200).style('opacity', 1);
              tooltip
                .html(`${labels[d.index]}: ${d.value}`)
                .style('left', event.pageX + 'px')
                .style('top', event.pageY - 28 + 'px')
                .style('color', 'black');
            })
            .on('mouseout', function () {
              const path = d3.select(this);
              path
                .transition()
                .duration(200)
                .attr('d', arc as any)
                .style('opacity', 0.7);

              tooltip.transition().duration(500).style('opacity', 0);
            });
        }

        // animate the arc initial load
        paths
          .transition()
          .duration(1200)
          .delay(() => index * 200)
          .attrTween('d', function (d: T & d3.PieArcDatum<T>) {
            const interpolate = d3.interpolate(
              { startAngle: 0, endAngle: 0 },
              { startAngle: d.startAngle, endAngle: d.endAngle }
            );
            return function (t: number) {
              const interpolated = interpolate(t) as T & d3.PieArcDatum<T>;
              return arc(interpolated) as string;
            };
          });
      }

      // middle text, these should be adjustable in the future
      if (!middleText) {
        svg
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('font-size', '2.5em')
          .attr('font-weight', 500)
          .attr('y', -5)
          .text(data[0]?.value);
      }

      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '1.5em')
        .attr('y', middleText ? 8 : 28)
        .text(middleText || 'Available');

      // text animation
      svg
        .selectAll('text')
        .style('opacity', 0)
        .transition()
        .delay(0)
        .duration(500)
        .style('opacity', 1);
    }
    return () => {
      tooltip.remove();
    };
  }, [data, width, height, radius, thickness, colors, labels]);

  return (
    <svg
      ref={d3Container}
      style={{
        transform: isVisible ? 'scale(1)' : 'scale(0)',
        transition: 'transform 0.7s ease-in-out',
      }}
    />
  );
};

export default DonutChart;
