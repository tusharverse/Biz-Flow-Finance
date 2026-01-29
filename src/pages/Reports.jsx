import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Filter
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState('3months');
  const [metrics, setMetrics] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0
  });
  const [reportData, setReportData] = useState([
    {
      period: 'Jan 2025',
      revenue: 45000,
      expenses: 12000,
      profit: 33000,
      invoices: 15,
      clients: 8
    },
    {
      period: 'Feb 2025',
      revenue: 52000,
      expenses: 14500,
      profit: 37500,
      invoices: 18,
      clients: 10
    },
    {
      period: 'Mar 2025',
      revenue: 48000,
      expenses: 13000,
      profit: 35000,
      invoices: 16,
      clients: 9
    },
  ]);

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Simulate data loading
    setLoading(false);
    
    // Initialize metrics
    setMetrics({
      total: 145000,
      paid: 98000,
      pending: 35000,
      overdue: 12000
    });
  }, [navigate]);

  const handleExportPDF = () => {
    // Create a simple PDF export using browser's print functionality
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Financial Report</title>
            <style>
              body { font-family, sans-serif; margin: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .total { font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Financial Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <h2>Report Summary</h2>
            <table>
              <tr>
                <th>Period</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
              </tr>
              ${reportData.map(item => `
                <tr>
                  <td>${item.period}</td>
                  <td>$${item.revenue.toLocaleString()}</td>
                  <td>$${item.expenses.toLocaleString()}</td>
                  <td>$${item.profit.toLocaleString()}</td>
                </tr>
              `).join('')}
              <tr class="total">
                <td>Total</td>
                <td>$${(reportData.reduce((sum, item) => sum + item.revenue, 0)).toLocaleString()}</td>
                <td>$${(reportData.reduce((sum, item) => sum + item.expenses, 0)).toLocaleString()}</td>
                <td>$${(reportData.reduce((sum, item) => sum + item.profit, 0)).toLocaleString()}</td>
              </tr>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['Period', 'Revenue', 'Expenses', 'Profit', 'Invoices', 'Clients'];
    const rows = reportData.map(item => [
      item.period,
      item.revenue,
      item.expenses,
      item.profit,
      item.invoices,
      item.clients
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalRevenue = reportData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = reportData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgMonthlyRevenue = totalRevenue / reportData.length;

  const getMetricsPercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
            <p className="text-muted-foreground">View detailed financial reports and analytics</p>
          </div>

          {/* Filters & Controls */}
          <div className="flex gap-4 mb-8">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download size={18} />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportPDF}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportCSV}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePrint}>
                    Print
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="gap-2">
                <Filter size={18} />
                Filter
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: ${(avgMonthlyRevenue / 1000).toFixed(0)}K/month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(totalExpenses / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getMetricsPercentage(totalExpenses, totalRevenue)}% of revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(totalProfit / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getMetricsPercentage(totalProfit, totalRevenue)}% profit margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                <Eye className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.reduce((sum, item) => sum + item.invoices, 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {(reportData.reduce((sum, item) => sum + item.invoices, 0) / reportData.length).toFixed(0)}/month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Status Metrics */}
          <div className="grid grid-cols-1 lg
            <Card>
              <CardHeader>
                <CardTitle>Invoice Status Overview</CardTitle>
                <CardDescription>Summary of all invoices by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Paid</span>
                      <span className="text-sm font-bold">${(metrics.paid / 1000).toFixed(0)}K ({getMetricsPercentage(metrics.paid, metrics.total)}%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${getMetricsPercentage(metrics.paid, metrics.total)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-sm font-bold">${(metrics.pending / 1000).toFixed(0)}K ({getMetricsPercentage(metrics.pending, metrics.total)}%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${getMetricsPercentage(metrics.pending, metrics.total)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overdue</span>
                      <span className="text-sm font-bold">${(metrics.overdue / 1000).toFixed(0)}K ({getMetricsPercentage(metrics.overdue, metrics.total)}%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${getMetricsPercentage(metrics.overdue, metrics.total)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Value</span>
                      <span className="text-lg font-bold">${(metrics.total / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Period Comparison</CardTitle>
                <CardDescription>Revenue and profit trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reportData.map((item, index) => (
                    <div key={index} className="border-b border-border pb-4 last
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.period}</span>
                        <span className="text-sm text-muted-foreground">{item.clients} clients</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                          <p className="text-lg font-bold text-green-600">${(item.revenue / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Profit</p>
                          <p className="text-lg font-bold text-blue-600">${(item.profit / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Types Available */}
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Select a report type to generate detailed analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md
                <div className="border border-border rounded-lg p-4 cursor-pointer hover
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Revenue Report</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Track revenue trends over time</p>
                  <Button variant="ghost" size="sm" className="mt-3 w-full">View Report</Button>
                </div>

                <div className="border border-border rounded-lg p-4 cursor-pointer hover
                  <div className="flex items-center gap-3 mb-2">
                    <LineChart className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Profit Margin</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Analyze profit margins and growth</p>
                  <Button variant="ghost" size="sm" className="mt-3 w-full">View Report</Button>
                </div>

                <div className="border border-border rounded-lg p-4 cursor-pointer hover
                  <div className="flex items-center gap-3 mb-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">Client Distribution</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">See which clients generate revenue</p>
                  <Button variant="ghost" size="sm" className="mt-3 w-full">View Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
