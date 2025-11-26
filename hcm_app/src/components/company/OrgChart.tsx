import {
  AddCircleOutline,
  Fullscreen,
  RemoveCircleOutline,
  ViewAgenda,
  ZoomIn,
  ZoomOut,
} from '@mui/icons-material';
import { Box, Button, ButtonGroup, Tooltip, useTheme } from '@mui/material';
import { HierarchyNode } from 'd3';
import type { OrgChart as D3OrgChart } from 'd3-org-chart';
import { OrgChart as D3OrgChartComponent } from 'd3-org-chart';
import { useLayoutEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

import { useUser } from '../../hooks/useUser';
import { getDisplayName, humanizeTitle } from '../../utils/profile';
import './OrgChart.css';

type OrgChartProps = {
  data: PublicEmployeeProfile[] | null;
  companyName: string;
  fullscreen?: boolean;
};

const OrgChart: React.FC<OrgChartProps> = ({
  data,
  companyName,
  fullscreen = false,
}) => {
  const theme = useTheme();
  const { user } = useUser();
  const [chart, setChart] = useState<D3OrgChart<PublicEmployeeProfile> | null>(
    null
  );
  const [isCompact, setIsCompact] = useState(false);

  const chartHeight = 750;

  const breakCycles = (data) => {
    const idToNode = new Map();
    data.forEach((node) => {
      idToNode.set(node.id, node);
    });

    const getId = (node) => node.id;
    const getReportsTo = (node) => node.manager_id;

    // We use a modified version of the findCycle logic here
    const breakCycle = (node, visited, recStack) => {
      const nodeId = getId(node);
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        recStack.add(nodeId);

        const reportsToId = getReportsTo(node);
        if (idToNode.has(reportsToId)) {
          const reportsToNode = idToNode.get(reportsToId);
          if (
            !visited.has(getId(reportsToNode)) &&
            breakCycle(reportsToNode, visited, recStack)
          ) {
            return true;
          } else if (recStack.has(getId(reportsToNode))) {
            // Cycle detected, clear manager_id for both
            node.manager_id = '';
            reportsToNode.manager_id = '';
            return false; // We do not return true because we want to keep searching for more cycles
          }
        }
      }
      recStack.delete(nodeId);
      return false;
    };

    data.forEach((node) => {
      breakCycle(node, new Set(), new Set());
    });
  };

  // We need to manipulate DOM, so useLayoutEffect
  useLayoutEffect(() => {
    if (data) {
      const idSet = new Set(data.map((d) => d.id));

      // Look for any nodes that have a manager_id that is not in the data
      // If so, set the parentId to ''
      let chartData = data.map((d: any) => {
        if (d.manager_id.trim() && !idSet.has(d.manager_id)) {
          return { ...d, parentId: '' };
        }
        return { ...d, parentId: d.manager_id };
      });

      // Check if there is a root node, i.e., a node with no manager_id
      const hasMultipleRoots =
        chartData.filter((node) => node.parentId.trim() === '').length > 1;

      // Only create a fake root if there is no root node
      if (hasMultipleRoots) {
        const root = {
          id: '0',
          first_name: companyName,
          last_name: '',
          manager_id: '',
          position: {},
        };

        chartData = chartData.map((node) => {
          if (!node.parentId || node.parentId.trim() === '') {
            return {
              ...node,
              parentId: root.id,
            };
          }
          return node;
        });
        // Add the root node to chartData
        chartData.push(root);
      }

      breakCycles(data);

      const orgChart: D3OrgChart<PublicEmployeeProfile> =
        new D3OrgChartComponent<PublicEmployeeProfile>();

      if (!chart) {
        setChart(orgChart);
      }

      if (!fullscreen) orgChart.svgHeight(chartHeight);

      try {
        orgChart
          .container('#org-chart')
          .data(chartData)
          .nodeWidth(() => 250)
          .initialZoom(0.9)
          .nodeHeight(() => 140)
          .childrenMargin(() => 40)
          .compactMarginBetween(() => 15)
          .compactMarginPair(() => 80)
          .compact(true)
          .setActiveNodeCentered(false)
          .buttonContent(({ node }: any) =>
            ReactDOMServer.renderToStaticMarkup(<ButtonContent node={node} />)
          )
          .nodeContent((d: any) =>
            ReactDOMServer.renderToStaticMarkup(
              <NodeContent
                width={d.width}
                height={d.height}
                data={d.data}
                user={user}
                color={theme.palette.primary.main}
              />
            )
          )
          .render();
      } catch (error) {
        console.log(error);
      }
    }
  }, [data, companyName, chart]);

  const handleCompact = () => {
    const nextCompact = !isCompact;
    setIsCompact(nextCompact);
    chart?.compact(nextCompact).render().fit();
  };

  const handleFit = () => {
    chart?.fit();
  };

  const handleExpandAll = () => {
    chart?.expandAll();
  };

  const handleCollapseAll = () => {
    chart?.collapseAll();
  };

  const handleZoomIn = () => {
    chart?.zoomIn();
  };

  const handleZoomOut = () => {
    chart?.zoomOut();
  };

  return (
    <>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <ButtonGroup>
          <Tooltip title="Expand All">
            <Button onClick={handleExpandAll} startIcon={<AddCircleOutline />}>
              Expand All
            </Button>
          </Tooltip>
          <Tooltip title="Collapse All">
            <Button
              onClick={handleCollapseAll}
              startIcon={<RemoveCircleOutline />}
            >
              Collapse All
            </Button>
          </Tooltip>
          <Tooltip title="Zoom In">
            <Button onClick={handleZoomIn} startIcon={<ZoomIn />}>
              Zoom In
            </Button>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <Button onClick={handleZoomOut} startIcon={<ZoomOut />}>
              Zoom Out
            </Button>
          </Tooltip>
          <Tooltip title="Fit">
            <Button onClick={handleFit} startIcon={<Fullscreen />}>
              Fit
            </Button>
          </Tooltip>
          <Tooltip title="Compact">
            <Button onClick={handleCompact} startIcon={<ViewAgenda />}>
              Compact
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>
      <Box sx={{ width: '100%' }}>
        <div id="org-chart" />
      </Box>
    </>
  );
};

// This component can't use any styling from React, it is rendered via d3
const NodeContent: React.FC<{
  width: number;
  height: number;
  data: PublicEmployeeProfile & {
    _directSubordinates: number;
    _totalSubordinates: number;
  };
  user?: any;
  color?: string;
}> = ({ width, height, data, user, color }) => (
  <div
    style={{
      fontFamily: 'Proxima Nova, sans-serif',
      padding: 16,
      backgroundColor: 'none',
      marginLeft: 1,
      height: height,
      borderRadius: 2,
      overflow: 'visible',
    }}
  >
    <div
      style={{
        height: height - 32,
        padding: `0 16px`,
        backgroundColor: 'white',
        overflow: 'hidden',
        border:
          user?.id === data.id ? `3px solid ${color}` : '1px solid lightgray',
        borderTop: `3px solid ${color}`,
      }}
    >
      <div
        style={{
          marginTop: -3,
          backgroundColor: color,
          height: 3,
          width: width - 2,
        }}
      ></div>
      <div style={{ paddingTop: 10, paddingBottom: 20, textAlign: 'center' }}>
        <div
          style={{
            display: 'block',
            justifyContent: 'center',
            margin: 'auto',
            marginBottom: 10,
            width: 36,
            height: 36,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#bfbfbf',
            color: '#fafafb',
          }}
        >
          {data.profile_picture ? (
            <img
              src={data.profile_picture}
              alt={getDisplayName(data)}
              style={{
                width: 36,
                height: 36,
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 36,
                height: 36,
                fontSize: 16,
              }}
            >
              {getDisplayName(data).charAt(0)}
              {data.last_name.charAt(0)}
            </div>
          )}
        </div>
        <div
          style={{
            color: '#023047',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {getDisplayName(data)}
        </div>
        <div
          style={{
            color: 'gray',
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {humanizeTitle(data.position?.employee_title)}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        {/* {data._directSubordinates > 0 && (
          <div>Manages: {data._directSubordinates}</div>
        )}
        {data._totalSubordinates > 0 && (
          <div>Oversees: {data._totalSubordinates}</div>
        )} */}
      </div>
    </div>
  </div>
);

const ButtonContent: React.FC<{
  node: HierarchyNode<
    PublicEmployeeProfile & {
      _directSubordinates: number;
    }
  >;
}> = ({ node }) => {
  const icon = node.children ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
      />
    </svg>
  );
  const text = node.data._directSubordinates;
  return (
    <div
      style={{
        borderRadius: 5,
        padding: 3,
        fontSize: 12,
        margin: 'auto',
        border: '1px solid lightgray',
        background: 'white',
      }}
    >
      <span style={{ position: 'relative', top: 1 }}>{icon}</span>
      {text}
    </div>
  );
};

export default OrgChart;
