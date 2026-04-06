import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Download, FileText, ClipboardList, RefreshCw } from "lucide-react";
import GovHeader from "../components/GovHeader";
import GovFooter from "../components/GovFooter";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = ({ setIsAdmin }) => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("submissions");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (activeTab === "audit" && auditLogs.length === 0) {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/admin/submissions`);
      setSubmissions(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const response = await axios.get(`${API}/admin/audit-logs?limit=200`);
      setAuditLogs(response.data);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await axios.get(`${API}/admin/submissions/export`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    navigate("/");
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action) => {
    const colors = {
      'USER_REGISTERED': 'text-[#2e8540]',
      'USER_LOGIN': 'text-[#1a4480]',
      'ADMIN_LOGIN': 'text-[#7c3aed]',
      'PROFILE_UPDATED': 'text-[#0891b2]',
      'CITATION_SEARCH': 'text-[#ea580c]',
      'ACTION_RECORDED': 'text-[#d83933]',
      'LOGIN_FAILED': 'text-[#d83933]',
      'EXPORT_SUBMISSIONS_CSV': 'text-[#71767a]'
    };
    return colors[action] || 'text-[#1b1b1b]';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <GovHeader />
      
      <div className="border-b-4 border-[#d83933]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1b1b]">
              Admin Dashboard
            </h1>
            <p className="text-[#71767a] text-sm mt-1">
              Manage submissions, view activity logs, and export data
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              disabled={exporting || submissions.length === 0}
              className="rounded-sm bg-[#2e8540] hover:bg-[#236b34] text-white py-2 px-4 text-sm font-bold flex items-center gap-2"
              data-testid="export-csv-btn"
            >
              <Download className="w-4 h-4" />
              {exporting ? "EXPORTING..." : "EXPORT CSV"}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-sm border-[#d83933] text-[#d83933] hover:bg-[#d83933] hover:text-white py-2 px-4 text-sm font-bold"
              data-testid="admin-logout-btn"
            >
              LOGOUT
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-[#FDF0F0] border border-[#E63946] text-[#E63946] text-sm mb-6">
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#f0f0f0] rounded-sm p-1">
            <TabsTrigger 
              value="submissions" 
              className="rounded-sm data-[state=active]:bg-[#1a4480] data-[state=active]:text-white flex items-center gap-2"
              data-testid="submissions-tab"
            >
              <FileText className="w-4 h-4" />
              Submissions ({submissions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="audit" 
              className="rounded-sm data-[state=active]:bg-[#1a4480] data-[state=active]:text-white flex items-center gap-2"
              data-testid="audit-logs-tab"
            >
              <ClipboardList className="w-4 h-4" />
              Audit Log ({auditLogs.length})
            </TabsTrigger>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-[#71767a]">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12 bg-[#f5f5f5] border border-[#dfe1e2] rounded-sm">
                <p className="text-[#71767a]">No submissions yet</p>
              </div>
            ) : (
              <div className="bg-white border border-[#dfe1e2] rounded-sm shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#dfe1e2] bg-[#1a4480] flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">
                    USER SUBMISSIONS
                  </h2>
                  <Button
                    onClick={fetchSubmissions}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-[#162e51]"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto" data-testid="submissions-table">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f0f0f0] border-b border-[#dfe1e2]">
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Email</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Name</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">DOB</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Phone</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Address</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Citation #</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Zip Code</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Action</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((sub, index) => (
                        <TableRow key={sub.id || index} className="border-b border-[#dfe1e2] hover:bg-[#f9f9f9]">
                          <TableCell className="text-sm py-3">{sub.email || '-'}</TableCell>
                          <TableCell className="text-sm py-3 font-semibold">{sub.name || '-'}</TableCell>
                          <TableCell className="text-sm py-3 font-mono">{sub.dob || '-'}</TableCell>
                          <TableCell className="text-sm py-3 font-mono">{sub.phone || '-'}</TableCell>
                          <TableCell className="text-sm py-3 max-w-[150px] truncate">{sub.address || '-'}</TableCell>
                          <TableCell className="text-sm py-3 font-mono text-[#1a4480]">{sub.citation_searched || '-'}</TableCell>
                          <TableCell className="text-sm py-3 font-mono">{sub.zip_code || '-'}</TableCell>
                          <TableCell className="text-sm py-3">
                            {sub.action_taken ? (
                              <span className={sub.action_taken === 'self-surrender' ? 'text-[#d83933] font-semibold' : 'text-[#2e8540] font-semibold'}>
                                {sub.action_taken}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-xs py-3 text-[#71767a]">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden">
                  {submissions.map((sub, index) => (
                    <div key={sub.id || index} className="p-4 border-b border-[#dfe1e2] last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-[#1b1b1b]">{sub.name || 'No Name'}</span>
                        <span className="text-xs text-[#71767a]">
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-[#71767a]">Email:</span> {sub.email || '-'}</p>
                        <p><span className="text-[#71767a]">DOB:</span> {sub.dob || '-'}</p>
                        <p><span className="text-[#71767a]">Phone:</span> {sub.phone || '-'}</p>
                        <p><span className="text-[#71767a]">Address:</span> {sub.address || '-'}</p>
                        <p><span className="text-[#71767a]">Citation:</span> <span className="font-mono text-[#1a4480]">{sub.citation_searched || '-'}</span></p>
                        <p><span className="text-[#71767a]">Zip:</span> {sub.zip_code || '-'}</p>
                        {sub.action_taken && (
                          <p>
                            <span className="text-[#71767a]">Action:</span>{' '}
                            <span className={sub.action_taken === 'self-surrender' ? 'text-[#d83933] font-semibold' : 'text-[#2e8540] font-semibold'}>
                              {sub.action_taken}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit">
            {auditLoading ? (
              <div className="text-center py-12">
                <p className="text-[#71767a]">Loading audit logs...</p>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-12 bg-[#f5f5f5] border border-[#dfe1e2] rounded-sm">
                <p className="text-[#71767a]">No audit logs yet</p>
              </div>
            ) : (
              <div className="bg-white border border-[#dfe1e2] rounded-sm shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#dfe1e2] bg-[#162e51] flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">
                    ACTIVITY AUDIT LOG
                  </h2>
                  <Button
                    onClick={fetchAuditLogs}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-[#1a4480]"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto" data-testid="audit-logs-table">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#f0f0f0] border-b border-[#dfe1e2]">
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Timestamp</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Action</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">User Email</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">User ID</TableHead>
                        <TableHead className="text-xs font-bold uppercase text-[#1b1b1b] py-3">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log, index) => (
                        <TableRow key={log.id || index} className="border-b border-[#dfe1e2] hover:bg-[#f9f9f9]">
                          <TableCell className="text-xs py-3 font-mono text-[#71767a]">
                            {formatTimestamp(log.timestamp)}
                          </TableCell>
                          <TableCell className={`text-sm py-3 font-semibold ${getActionColor(log.action)}`}>
                            {log.action}
                          </TableCell>
                          <TableCell className="text-sm py-3">{log.user_email || '-'}</TableCell>
                          <TableCell className="text-xs py-3 font-mono text-[#71767a] max-w-[100px] truncate">
                            {log.user_id || '-'}
                          </TableCell>
                          <TableCell className="text-xs py-3 text-[#71767a] max-w-[200px]">
                            {log.details && Object.keys(log.details).length > 0 
                              ? JSON.stringify(log.details).substring(0, 50) + (JSON.stringify(log.details).length > 50 ? '...' : '')
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden">
                  {auditLogs.map((log, index) => (
                    <div key={log.id || index} className="p-4 border-b border-[#dfe1e2] last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`font-bold ${getActionColor(log.action)}`}>{log.action}</span>
                        <span className="text-xs text-[#71767a] font-mono">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-[#71767a]">User:</span> {log.user_email || '-'}</p>
                        <p><span className="text-[#71767a]">ID:</span> <span className="font-mono text-xs">{log.user_id?.substring(0, 8) || '-'}...</span></p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <p className="text-xs text-[#71767a] break-words">
                            <span className="font-semibold">Details:</span> {JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <GovFooter />
    </div>
  );
};

export default AdminDashboard;
