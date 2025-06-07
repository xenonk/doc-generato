import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Home, 
  FileText, 
  FolderOpen, 
  Share2, 
  BarChart3, 
  Layers,
  Settings,
  Moon,
  Sun,
  LogOut,
  Filter,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { DOCUMENT_TYPES } from '../config/documentTypes';
import { useQuery } from 'react-query';
import { documentService } from '../services/documentService';
import { toast } from 'react-hot-toast';

const DocumentTypeCard = ({ doc, onClick }) => {
  const IconComponent = doc.icon;
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick(doc)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${doc.color} text-white`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{doc.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
      <p className="text-xs text-gray-500 mb-4">{doc.detail}</p>
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
        Create Now
      </button>
    </div>
  );
};

const RecentDocumentItem = ({ doc, onClick }) => {
  const IconComponent = doc.icon;
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'approval_awaiting':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div 
      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
      onClick={() => onClick(doc)}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <IconComponent className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Modified {doc.modifiedTime}</span>
            {!doc.isMyDocument && (
              <>
                <span>•</span>
                <span>by {doc.owner}</span>
              </>
            )}
            {doc.status === 'approval_awaiting' && doc.approver && (
              <>
                <span>•</span>
                <span className="text-orange-600">Awaiting approval from {doc.approver}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
          {doc.status}
        </span>
        <button 
          className="p-1 hover:bg-gray-200 rounded"
          onClick={(e) => {
            e.stopPropagation();
            // Handle more options click
          }}
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

const AnalyticsCard = ({ metric }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h4 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h4>
    <div className="flex items-baseline space-x-2">
      <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
      <span className={`text-sm font-medium ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
        {metric.change}
      </span>
    </div>
    <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch recent documents
  const { data: recentDocuments = [], isLoading: isLoadingDocuments } = useQuery(
    'recentDocuments',
    documentService.getRecentDocuments,
    {
      onError: (error) => {
        toast.error(`Failed to load recent documents: ${error.message}`);
      }
    }
  );

  const handleDocumentCreate = (docType) => {
    const routes = DOCUMENT_TYPES[docType.id].routes;
    if (routes && routes.create) {
      navigate(routes.create);
    }
  };

  const handleDocumentClick = (doc) => {
    const docType = DOCUMENT_TYPES[doc.type.toLowerCase()];
    if (docType && docType.routes.edit) {
      navigate(docType.routes.edit.replace(':id', doc.id));
    }
  };

  const filteredDocuments = recentDocuments.filter(doc => {
    if (!searchQuery) return true;
    return doc.name.toLowerCase().includes(searchQuery.toLowerCase());
  }).filter(doc => {
    switch (selectedTab) {
      case 'All':
        return true;
      case 'Draft':
        return doc.status === 'draft';
      case 'Completed':
        return doc.status === 'completed';
      case 'Approval Awaiting':
        return doc.status === 'approval_awaiting';
      case 'My Documents':
        return doc.isMyDocument;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DocuFlow</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  <hr className="my-2" />
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {[
              { name: 'Dashboard', icon: Home, active: true },
              { name: 'Document Sets', icon: Layers, active: false },
              { name: 'Create Document', icon: FileText, active: false },
              { name: 'My Documents', icon: FolderOpen, active: false },
              { name: 'Shared', icon: Share2, active: false },
              { name: 'Templates', icon: FileText, active: false },
              { name: 'Analytics', icon: BarChart3, active: false }
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    item.active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-8">
            {/* Quick Document Creation */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Document Creation</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Custom Template</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.values(DOCUMENT_TYPES).map((doc) => (
                  <DocumentTypeCard
                    key={doc.id}
                    doc={doc}
                    onClick={handleDocumentCreate}
                  />
                ))}
              </div>
            </section>

            {/* Recent Documents */}
            <section>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <select className="text-sm border-gray-300 rounded-md">
                        <option>Sort by: Modified</option>
                        <option>Sort by: Name</option>
                        <option>Sort by: Type</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {['All', 'My Documents', 'Draft', 'Completed', 'Approval Awaiting'].map((tab) => (
                      <button
                        key={tab}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedTab === tab
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setSelectedTab(tab)}
                      >
                        {tab}
                        {tab === 'Approval Awaiting' && (
                          <span className="ml-1 px-1.5 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full">
                            {recentDocuments.filter(doc => doc.status === 'approval_awaiting').length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {isLoadingDocuments ? (
                    <div className="p-4 text-center text-gray-500">Loading documents...</div>
                  ) : filteredDocuments.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No documents found</div>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <RecentDocumentItem 
                        key={doc.id} 
                        doc={doc} 
                        onClick={handleDocumentClick}
                      />
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Document Analytics */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Document Analytics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Documents Created',
                    value: '127',
                    change: '+12%',
                    changeType: 'positive',
                    subtitle: 'from last month',
                    color: 'bg-blue-50 text-blue-600'
                  },
                  {
                    title: 'Templates Used',
                    value: '43',
                    change: '+8%',
                    changeType: 'positive',
                    subtitle: 'from last month',
                    color: 'bg-green-50 text-green-600'
                  },
                  {
                    title: 'Time Saved',
                    value: '24h',
                    change: '+15%',
                    changeType: 'positive',
                    subtitle: 'efficiency',
                    color: 'bg-purple-50 text-purple-600'
                  },
                  {
                    title: 'Shared Documents',
                    value: '89',
                    change: '+5%',
                    changeType: 'positive',
                    subtitle: 'from last month',
                    color: 'bg-orange-50 text-orange-600'
                  }
                ].map((metric, index) => (
                  <AnalyticsCard key={index} metric={metric} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
} 