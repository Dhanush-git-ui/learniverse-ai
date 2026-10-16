import React, { useState } from 'react';
import { ArrowLeft, Check, ArrowRight } from 'lucide-react';
import { RoleTemplate } from '../../types/adminAssessment';
import { ROLE_TEMPLATES } from '../../data/mockAdminData';

interface RoleCatalogSelectorProps {
  onBack: () => void;
  onSelectRole: (role: RoleTemplate) => void;
}

export const RoleCatalogSelector: React.FC<RoleCatalogSelectorProps> = ({
  onBack,
  onSelectRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  // Default selected to 'Frontend Developer' matching Screenshot 3
  const [selectedRoleId, setSelectedRoleId] = useState<string>('frontend');

  // Order templates to match Screenshot 3 grid
  const orderedRoles = [
    ROLE_TEMPLATES.find(r => r.id === 'java-dev'),
    ROLE_TEMPLATES.find(r => r.id === 'mern-dev'),
    ROLE_TEMPLATES.find(r => r.id === 'frontend'),
    ROLE_TEMPLATES.find(r => r.id === 'full-stack'),
    ROLE_TEMPLATES.find(r => r.id === 'ase'),
    ROLE_TEMPLATES.find(r => r.id === 'react-dev'),
    ROLE_TEMPLATES.find(r => r.id === 'backend-dev'),
    ROLE_TEMPLATES.find(r => r.id === 'python-dev'),
    ROLE_TEMPLATES.find(r => r.id === 'data-scientist'),
    ROLE_TEMPLATES.find(r => r.id === 'data-analyst'),
    ROLE_TEMPLATES.find(r => r.id === 'data-engineer'),
    ROLE_TEMPLATES.find(r => r.id === 'sql-dev'),
  ].filter(Boolean) as RoleTemplate[];

  const filteredRoles = orderedRoles.filter((role) =>
    role.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRole = orderedRoles.find((r) => r.id === selectedRoleId) || orderedRoles[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Top Navigation Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Assessments</span>
      </button>

      {/* Title & Description matching Screenshot 3 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Role-Based Assessment
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Select the Job Role. We will Create an assessment for you. You can also customize as per your need
        </p>
      </div>

      {/* Search Input with 'Type Min 3 char' helper matching Screenshot 3 */}
      <div className="max-w-2xl mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search By Job Role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-1 pl-1 font-medium">
          Type Min 3 char
        </p>
      </div>

      {/* Explore Available Roles Header & Action Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">
          Explore Available Roles
        </h2>
        {selectedRole && (
          <button
            onClick={() => onSelectRole(selectedRole)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>Proceed with {selectedRole.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 4-column Grid of Role Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {filteredRoles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              onDoubleClick={() => onSelectRole(role)}
              className={`p-5 rounded-xl border cursor-pointer transition-all duration-150 select-none bg-white relative flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {role.title}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Sections: <strong className="font-semibold text-slate-700">{role.sectionsCount}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span>Experience: <strong className="font-semibold text-slate-700">{role.experience}</strong></span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-blue-100 text-xs font-semibold text-blue-600">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Selected</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRole(role);
                    }}
                    className="hover:underline font-bold cursor-pointer"
                  >
                    Configure &rarr;
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
