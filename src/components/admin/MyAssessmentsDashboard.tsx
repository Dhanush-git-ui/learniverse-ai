import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  RotateCw, 
  ChevronDown, 
  MoreVertical, 
  Edit3, 
  Copy, 
  Trash2,
  Check,
  ExternalLink,
  Layers
} from 'lucide-react';
import { AdminAssessment } from '../../types/adminAssessment';

interface MyAssessmentsDashboardProps {
  userName?: string;
  assessments: AdminAssessment[];
  onCreateClick: () => void;
  onEditAssessment: (assessment: AdminAssessment) => void;
  onDeleteAssessment: (id: string) => void;
  onRefresh?: () => void;
}

export const MyAssessmentsDashboard: React.FC<MyAssessmentsDashboardProps> = ({
  userName = 'Admin',
  assessments,
  onCreateClick,
  onEditAssessment,
  onDeleteAssessment,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'drafts' | 'completed'>('active');
  const [filterAuthor, setFilterAuthor] = useState('Created by me');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter assessments based on search and tab
  const filteredAssessments = assessments.filter((asmt) => {
    const matchesSearch = asmt.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Author filter
    if (filterAuthor === 'Created by me' && asmt.createdBy && asmt.createdBy !== userName) {
      if (asmt.createdBy !== 'Learniverse Admin') return false;
    }

    if (activeTab === 'active') {
      return matchesSearch && (asmt.status === 'In Progress' || asmt.status === 'Upcoming');
    } else if (activeTab === 'drafts') {
      return matchesSearch && asmt.status === 'Draft';
    } else {
      return matchesSearch && asmt.status === 'Completed';
    }
  });

  const activeCount = assessments.filter(a => a.status === 'In Progress' || a.status === 'Upcoming').length;
  const draftsCount = assessments.filter(a => a.status === 'Draft').length;
  const completedCount = assessments.filter(a => a.status === 'Completed').length;

  const handleCopyLink = (asmt: AdminAssessment) => {
    const url = `${window.location.origin}/assessment?drive=${asmt.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(asmt.id);
    setTimeout(() => setCopiedId(null), 2000);
    setOpenMenuId(null);
  };

  const handleTriggerRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Page Header matching Screenshot 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Assessments
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Hey {userName}, Welcome Back!
          </p>
        </div>

        {/* Right Action: Search Box & Blue Create Button */}
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for assessments"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
            />
          </div>

          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all cursor-pointer select-none"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Assessment</span>
          </button>
        </div>
      </div>

      {/* Tabs and Filters Row matching Screenshot 1 */}
      <div className="flex items-center justify-between border-b border-slate-200/90 mb-6 pb-0.5">
        {/* Status Tabs with counts */}
        <div className="flex items-center gap-8 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3.5 transition-colors relative cursor-pointer ${
              activeTab === 'active'
                ? 'text-blue-600 after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`pb-3.5 transition-colors relative cursor-pointer ${
              activeTab === 'drafts'
                ? 'text-blue-600 after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drafts ({draftsCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3.5 transition-colors relative cursor-pointer ${
              activeTab === 'completed'
                ? 'text-blue-600 after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2.5px] after:bg-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Refresh & Filter Controls matching Screenshot 1 */}
        <div className="flex items-center gap-5 text-sm mb-2">
          <button 
            onClick={handleTriggerRefresh}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium py-1 px-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <div className="relative">
            <div 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-1 text-slate-700 font-medium cursor-pointer py-1 px-2 rounded-md hover:bg-slate-100 transition-colors select-none"
            >
              <span>{filterAuthor}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isFilterDropdownOpen && (
              <div
                className="absolute right-0 top-8 w-44 bg-white border border-slate-200 rounded-lg shadow-2xs py-1 z-30 text-xs font-medium text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsFilterDropdownOpen(false)}
              >
                {['Created by me', 'Created by others', 'All Assessments'].map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setFilterAuthor(opt);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between ${filterAuthor === opt ? 'text-blue-600 font-semibold bg-blue-50/50' : ''}`}
                  >
                    <span>{opt}</span>
                    {filterAuthor === opt && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Table matching Screenshot 1 */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold">
              <th className="py-3 px-4 w-14 text-center">S.No</th>
              <th className="py-3 px-6">Assessment</th>
              <th className="py-3 px-4">Published On</th>
              <th className="py-3 px-4">Start Time</th>
              <th className="py-3 px-4">End Time</th>
              <th className="py-3 px-4 text-center">Total Score</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center w-16">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
            {filteredAssessments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="max-w-md mx-auto flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-800">
                        No {activeTab} assessments found
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {activeTab === 'active'
                          ? 'You currently have 0 active assessments running. Click below to create and launch a new test for your students.'
                          : activeTab === 'drafts'
                          ? 'You have 0 saved drafts. Create an assessment and save it as a draft anytime.'
                          : 'No completed assessments are archived yet.'}
                      </p>
                    </div>
                    <button
                      onClick={onCreateClick}
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Assessment</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAssessments.map((asmt, index) => (
                <tr 
                  key={asmt.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* S.No */}
                  <td className="py-4 px-4 text-center font-medium text-slate-500">
                    {index + 1}
                  </td>

                  {/* Assessment Name */}
                  <td className="py-4 px-6">
                    <div 
                      onClick={() => onEditAssessment(asmt)}
                      className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {asmt.title}
                    </div>
                    {asmt.sections && asmt.sections.length > 0 && (
                      <div className="text-xs text-slate-400 mt-0.5">
                        {asmt.sections.length} Sections • {asmt.totalTime || 60} mins
                      </div>
                    )}
                  </td>

                  {/* Published On */}
                  <td className="py-4 px-4 text-slate-600 text-xs whitespace-nowrap">
                    {asmt.publishedOn}
                  </td>

                  {/* Start Time */}
                  <td className="py-4 px-4 text-slate-600 text-xs whitespace-nowrap">
                    {asmt.startTime}
                  </td>

                  {/* End Time */}
                  <td className="py-4 px-4 text-slate-600 text-xs whitespace-nowrap">
                    {asmt.endTime}
                  </td>

                  {/* Total Score */}
                  <td className="py-4 px-4 text-center font-semibold text-slate-700">
                    {asmt.totalScore}
                  </td>

                  {/* Status Badge matching Screenshot 1 */}
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200/60">
                      {asmt.status}
                    </span>
                  </td>

                  {/* Actions Kebab Menu matching Screenshot 1 */}
                  <td className="py-4 px-4 text-center relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === asmt.id ? null : asmt.id)}
                      className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === asmt.id && (
                      <div
                        className="absolute right-6 top-10 w-48 bg-white border border-slate-200 rounded-lg shadow-2xs py-1.5 z-30 text-left text-xs font-medium text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                        onMouseLeave={() => setOpenMenuId(null)}
                      >
                        <button
                          onClick={() => {
                            onEditAssessment(asmt);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Configure Assessment</span>
                        </button>

                        <button
                          onClick={() => handleCopyLink(asmt)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 text-slate-700 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>{copiedId === asmt.id ? 'Copied Link!' : 'Copy Candidate Link'}</span>
                        </button>

                        <a
                          href={`/assessment?drive=${asmt.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 text-slate-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          <span>Preview as Candidate</span>
                        </a>

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          onClick={() => {
                            onDeleteAssessment(asmt.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-50 text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Assessment</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
