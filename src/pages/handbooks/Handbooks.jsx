import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, ScrollText, Globe, Package, Coins,
  Plus, Search, Filter, ChevronRight
} from 'lucide-react';
import Header from '../../components/Header';

const handbookItems = [
  {
    id: 'companies',
    title: 'Companies',
    description: 'Manage company information, contacts, and details',
    icon: Building2,
    color: 'blue',
    count: 24,
    path: '/handbooks/companies'
  },
  {
    id: 'contracts',
    title: 'Contracts',
    description: 'View and manage contract templates and agreements',
    icon: ScrollText,
    color: 'green',
    count: 156,
    path: '/handbooks/contracts'
  },
  {
    id: 'incoterms',
    title: 'Incoterms',
    description: 'International commercial terms and conditions',
    icon: Globe,
    color: 'purple',
    count: 11,
    path: '/handbooks/incoterms'
  },
  {
    id: 'packages',
    title: 'Packages',
    description: 'Package types and shipping information',
    icon: Package,
    color: 'orange',
    count: 8,
    path: '/handbooks/packages'
  },
  {
    id: 'currencies',
    title: 'Currencies',
    description: 'Currency exchange rates and information',
    icon: Coins,
    color: 'yellow',
    count: 32,
    path: '/handbooks/currencies'
  }
];

const getColorClasses = (color) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    green: 'bg-green-50 text-green-700 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
    yellow: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
  };
  return colors[color] || colors.blue;
};

const Handbooks = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Handbooks</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search handbooks..."
                className="w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {handbookItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`block p-6 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow ${getColorClasses(item.color)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <p className="text-sm opacity-80 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {item.count} {item.count === 1 ? 'record' : 'records'}
                  </span>
                  <button className="p-1.5 rounded-lg bg-white hover:bg-opacity-90 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Handbooks; 