import React, { useState } from 'react';
import { Clock, Star, Users, FileText, ChevronDown, ChevronUp, Share2 } from 'lucide-react';

interface DashboardSidebarProps {
  isCollapsed: boolean;
}

interface SectionHeaderProps {
  title: string;
  icon: React.ElementType;
  section: string;
  isCollapsed: boolean;
  expandedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon, section, isCollapsed, expandedSections, toggleSection }) => (
  <button
    onClick={() => toggleSection(section)}
    className={`w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg ${
      isCollapsed ? 'justify-center' : ''
    }`}
  >
    <div className="flex items-center space-x-2">
      <Icon className="w-4 h-4" />
      {!isCollapsed && <span>{title}</span>}
    </div>
    {!isCollapsed && (expandedSections[section] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
  </button>
);

const QuickStats: React.FC = () => (
  <div className="space-y-2 p-2">
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-blue-50 p-2 rounded-lg">
        <div className="text-xs text-blue-600">Pending</div>
        <div className="text-lg font-semibold text-blue-700">12</div>
      </div>
      <div className="bg-green-50 p-2 rounded-lg">
        <div className="text-xs text-green-600">Due Today</div>
        <div className="text-lg font-semibold text-green-700">3</div>
      </div>
      <div className="bg-purple-50 p-2 rounded-lg">
        <div className="text-xs text-purple-600">Active</div>
        <div className="text-lg font-semibold text-purple-700">8</div>
      </div>
      <div className="bg-orange-50 p-2 rounded-lg">
        <div className="text-xs text-orange-600">Reviews</div>
        <div className="text-lg font-semibold text-orange-700">5</div>
      </div>
    </div>
  </div>
);

const RecentActivity: React.FC = () => (
  <div className="space-y-2 p-2">
    {[1, 2, 3].map((_, i) => (
      <div key={i} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg">
        <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full"></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">Invoice INV-2024-001 updated</p>
          <p className="text-xs text-gray-400">2 hours ago</p>
        </div>
      </div>
    ))}
  </div>
);

const TeamActivity: React.FC = () => (
  <div className="space-y-2 p-2">
    {[1, 2, 3].map((_, i) => (
      <div key={i} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <Users className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">John Smith</p>
          <p className="text-xs text-gray-400">Editing Invoice</p>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>
    ))}
  </div>
);

const Collections: React.FC = () => (
  <div className="space-y-2 p-2">
    <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600">
      <Star className="w-4 h-4 text-yellow-500" />
      <span>Starred Documents</span>
    </button>
    <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600">
      <Share2 className="w-4 h-4 text-blue-500" />
      <span>Shared with Me</span>
    </button>
    <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600">
      <FileText className="w-4 h-4 text-gray-500" />
      <span>My Drafts</span>
    </button>
  </div>
);

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isCollapsed }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    quickStats: true,
    recentActivity: true,
    teamActivity: true,
    collections: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Quick Stats */}
          <div>
            <SectionHeader title="Quick Stats" icon={Clock} section="quickStats" isCollapsed={isCollapsed} expandedSections={expandedSections} toggleSection={toggleSection} />
            {expandedSections.quickStats && !isCollapsed && <QuickStats />}
          </div>

          {/* Recent Activity */}
          <div>
            <SectionHeader title="Recent Activity" icon={FileText} section="recentActivity" isCollapsed={isCollapsed} expandedSections={expandedSections} toggleSection={toggleSection} />
            {expandedSections.recentActivity && !isCollapsed && <RecentActivity />}
          </div>

          {/* Team Activity */}
          <div>
            <SectionHeader title="Team Activity" icon={Users} section="teamActivity" isCollapsed={isCollapsed} expandedSections={expandedSections} toggleSection={toggleSection} />
            {expandedSections.teamActivity && !isCollapsed && <TeamActivity />}
          </div>

          {/* Collections */}
          <div>
            <SectionHeader title="Collections" icon={Star} section="collections" isCollapsed={isCollapsed} expandedSections={expandedSections} toggleSection={toggleSection} />
            {expandedSections.collections && !isCollapsed && <Collections />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar; 