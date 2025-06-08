import React from 'react';
import { FileText, Users, Clock, Tag, Link2 } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface InvoiceSidebarContentProps {
  collaborators: Collaborator[];
  tags: string[];
  links: { title: string; url: string }[];
  lastModified: string;
  onAddCollaborator: () => void;
  onAddTag: () => void;
  onAddLink: () => void;
}

export const InvoiceSidebarContent: React.FC<InvoiceSidebarContentProps> = ({
  collaborators,
  tags,
  links,
  lastModified,
  onAddCollaborator,
  onAddTag,
  onAddLink,
}) => {
  return (
    <div className="p-4 space-y-6">
      {/* Collaborators Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Collaborators</h3>
          <Users className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-2">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
            >
              <img
                src={collaborator.avatar}
                alt={collaborator.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900">
                  {collaborator.name}
                </p>
                <p className="text-xs text-gray-500">{collaborator.role}</p>
              </div>
            </div>
          ))}
          <button
            onClick={onAddCollaborator}
            className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            Add Collaborator
          </button>
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Tags</h3>
          <Tag className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
            >
              {tag}
            </span>
          ))}
          <button
            onClick={onAddTag}
            className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100"
          >
            + Add Tag
          </button>
        </div>
      </div>

      {/* Links Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Related Links</h3>
          <Link2 className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 text-sm text-blue-600 hover:bg-gray-50 rounded-md"
            >
              {link.title}
            </a>
          ))}
          <button
            onClick={onAddLink}
            className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            Add Link
          </button>
        </div>
      </div>

      {/* Last Modified Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Last Modified</h3>
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">{lastModified}</p>
      </div>
    </div>
  );
}; 