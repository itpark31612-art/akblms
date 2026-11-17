import React from 'react';
import * as RechartsModule from 'recharts';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const ResponsiveContainer =
  RechartsModule.ResponsiveContainer as unknown as React.ComponentType<any>;
export const AreaChart = RechartsModule.AreaChart as unknown as React.ComponentType<any>;
export const BarChart = RechartsModule.BarChart as unknown as React.ComponentType<any>;
export const PieChart = RechartsModule.PieChart as unknown as React.ComponentType<any>;
export const XAxis = RechartsModule.XAxis as unknown as React.ComponentType<any>;
export const YAxis = RechartsModule.YAxis as unknown as React.ComponentType<any>;
export const Tooltip = RechartsModule.Tooltip as unknown as React.ComponentType<any>;
export const Area = RechartsModule.Area as unknown as React.ComponentType<any>;
export const Bar = RechartsModule.Bar as unknown as React.ComponentType<any>;
export const Pie = RechartsModule.Pie as unknown as React.ComponentType<any>;
export const Cell = RechartsModule.Cell as unknown as React.ComponentType<any>;
export const CartesianGrid = RechartsModule.CartesianGrid as unknown as React.ComponentType<any>;
