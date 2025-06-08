import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, MoreHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DashboardSidebar from '../components/DashboardSidebar';
import { DOCUMENT_TYPES } from '../config/documentTypes';
import { documentService } from '../services/documentService';
import type { Document } from '../types';

interface DocumentTypeCardProps {
  doc: any;
  onClick: (doc: any) => void;
}
const DocumentTypeCard: React.FC<DocumentTypeCardProps> = ({ doc, onClick }) => (
  <div
    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
    onClick={() => onClick(doc)}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${doc.color} text-white`}>
        <doc.icon className="w-6 h-6" />
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

interface RecentDocumentItemProps {
  doc: Document;
  onClick: (doc: Document) => void;
}
const RecentDocumentItem: React.FC<RecentDocumentItemProps> = ({ doc, onClick }) => {
  const getStatusColor = (status: string) => {
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
          {/* Replace with actual icon if available */}
          <span className="w-4 h-4 text-gray-600">{doc.type}</span>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Modified {doc.updatedAt?.toString()}</span>
            {/* Add more info as needed */}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
          {doc.status}
        </span>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          onClick={e => {
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('All');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Fetch recent documents
  const { data: recentDocuments = [], isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['recentDocuments'],
    queryFn: documentService.getRecentDocuments,
    onError: (error: any) => {
      toast.error(`Failed to load recent documents: ${error.message}`);
    },
  });

  const handleDocumentCreate = (docType: any) => {
    const routes = DOCUMENT_TYPES[docType.id].routes;
    if (routes && routes.create) {
      navigate(routes.create);
    }
  };

  const handleDocumentClick = (doc: Document) => {
    const docType = DOCUMENT_TYPES[doc.type.toLowerCase()];
    if (docType && docType.routes.edit) {
      navigate(docType.routes.edit.replace(':id', doc.id));
    }
  };

  const filteredDocuments = recentDocuments.filter((doc: Document) => {
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
        return (doc as any).isMyDocument;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          <DashboardSidebar isCollapsed={isSidebarCollapsed} />
        </Sidebar>
        <main className="flex-1 transition-all duration-300">
          <div className="p-6 h-full">
            <div className="space-y-8 w-full">
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
                  {Object.values(DOCUMENT_TYPES).map(doc => (
                    <DocumentTypeCard key={doc.id} doc={doc} onClick={handleDocumentCreate} />
                  ))}
                </div>
              </section>
              {/* Recent Documents */}
              <section>
                <div className="bg-white rounded-lg border border-gray-200 w-full">
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
                      {['All', 'My Documents', 'Draft', 'Completed', 'Approval Awaiting'].map(tab => (
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
                              {recentDocuments.filter((doc: Document) => doc.status === 'approval_awaiting').length}
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
                      filteredDocuments.map((doc: Document) => (
                        <RecentDocumentItem key={doc.id} doc={doc} onClick={handleDocumentClick} />
                      ))
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 