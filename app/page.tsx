'use client';

import { useState, useEffect } from 'react';

interface MeasureAction {
  text: string;
  dueDate?: string;
  assignee?: string;
  archived: boolean;
}

interface Goal {
  name: string;
  strategies: string[];
  measures: MeasureAction[];
  actions: MeasureAction[];
  owner: string;
}

interface PlanData {
  logoUrl: string;
  vision: string;
  mission: string;
  goals: Goal[];
  teamMembers: string[];
}

interface PlanVersion {
  id: string;
  timestamp: string;
  data: PlanData;
}

export default function Page() {
  const [planData, setPlanData] = useState<PlanData>({
    logoUrl: '',
    vision: '',
    mission: '',
    goals: [],
    teamMembers: []
  });
  const [status, setStatus] = useState('');
  const [mode, setMode] = useState<'edit' | 'presentation' | 'progress'>('edit');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<PlanVersion[]>([]);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(true);
  const [filters, setFilters] = useState({
    assignee: '',
    status: 'all', // 'all', 'archived', 'active'
    dueStatus: 'all' // 'all', 'overdue', 'due_soon', 'no_due_date'
  });

  useEffect(() => {
    // Check if user is admin - using hardcoded email as requested
    setIsAdmin(true); // Change this to false if you want to test non-admin view

    // Load data
    fetch('/api/plan')
      .then(res => res.json())
      .then(data => {
        console.log('Loaded data:', data);
        if (data && Object.keys(data).length > 0) {
          // Ensure all arrays are properly initialized
          const safeGoals = (data.goals || []).map((goal: any) => ({
            name: goal.name || '',
            strategies: Array.isArray(goal.strategies) ? goal.strategies : [],
            measures: Array.isArray(goal.measures) ? goal.measures.map((m: any) => ({
              text: m.text || '',
              dueDate: m.dueDate || undefined,
              assignee: m.assignee || undefined,
              archived: Boolean(m.archived)
            })) : [],
            actions: Array.isArray(goal.actions) ? goal.actions.map((a: any) => ({
              text: a.text || '',
              dueDate: a.dueDate || undefined,
              assignee: a.assignee || undefined,
              archived: Boolean(a.archived)
            })) : [],
            owner: goal.owner || goal.sponsor || goal.assignedTeam?.[0] || goal.assignees?.[0] || ''
          }));

          setPlanData({
            logoUrl: data.logoUrl || '',
            vision: data.vision || '',
            mission: data.mission || '',
            goals: safeGoals,
            teamMembers: Array.isArray(data.teamMembers) ? data.teamMembers : []
          });
        }
      })
      .catch(err => console.error('Failed to load plan:', err));

    // Load versions
    loadVersions();
  }, []);

  const handleSave = async () => {
    try {
      setStatus('Saving...');
      console.log('Saving plan data to /api/plan...');
      console.log('Sending plan data:', planData);

      // Check if content has changed by comparing with last saved version
      const hasChanged = await checkForChanges();

      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        // Auto-save version only if content has changed
        if (hasChanged) {
          await saveVersion('Auto-save');
          setStatus('Saved with new version ✅');
        } else {
          setStatus('Saved (no changes) ✅');
        }
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus('Save failed ❌');
      }
    } catch (error) {
      console.error('Save error:', error);
      setStatus('Save failed ❌');
    }
  };

  const checkForChanges = async () => {
    try {
      const response = await fetch('/api/versions');
      if (response.ok) {
        const data = await response.json();
        const latestVersion = data.versions?.[0];

        if (!latestVersion) return true; // No previous version, so this is a change

        // Simple content comparison - stringify and compare
        const currentContent = JSON.stringify(planData);
        const previousContent = JSON.stringify(latestVersion.data);

        return currentContent !== previousContent;
      }
      return true; // If we can't check, assume there are changes
    } catch (error) {
      console.error('Error checking for changes:', error);
      return true; // If we can't check, assume there are changes
    }
  };

  const saveVersion = async (label = 'Manual save') => {
    try {
      const versionId = new Date().toISOString();
      const versionData = {
        id: versionId,
        timestamp: versionId,
        label: label,
        data: planData
      };

      const response = await fetch('/api/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(versionData),
      });

      if (response.ok) {
        loadVersions();
      }
    } catch (error) {
      console.error('Version save error:', error);
    }
  };

  const loadVersions = async () => {
    try {
      const response = await fetch('/api/versions');
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions || []);
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
    }
  };

  const restoreVersion = async (version: PlanVersion) => {
    try {
      setStatus('Restoring version...');

      // Update local state
      setPlanData(version.data);

      // Save restored version as current plan
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(version.data),
      });

      if (response.ok) {
        setShowVersions(false);
        setStatus(`Restored version from ${new Date(version.timestamp).toLocaleString()}`);
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('Restore failed ❌');
      }
    } catch (error) {
      console.error('Restore error:', error);
      setStatus('Restore failed ❌');
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus('Please select an image file');
      return;
    }

    try {
      setStatus('Uploading logo...');
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setPlanData(prev => ({ ...prev, logoUrl: base64String }));
        setStatus('Logo uploaded ✅');
        setTimeout(() => setStatus(''), 2000);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Logo upload error:', error);
      setStatus('❌ Error uploading logo');
    }

    // Clear the input
    event.target.value = '';
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setStatus('Processing CSV...');
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        setStatus('CSV must have at least a header and one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      console.log('CSV Headers:', headers);

      const newGoals: Goal[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < 1 || !values[0]) continue;

        const goal: Goal = {
          name: values[0] || `Goal ${i}`,
          strategies: values[1] ? values[1].split(';').map(s => s.trim()).filter(Boolean) : [],
          measures: values[2] ? values[2].split(';').map(m => ({ text: m.trim(), archived: false })).filter(m => m.text) : [],
          actions: values[3] ? values[3].split(';').map(a => ({ text: a.trim(), archived: false })).filter(a => a.text) : [],
          owner: values[4] ? values[4].trim() : ''
        };

        newGoals.push(goal);
      }

      if (newGoals.length > 0) {
        setPlanData(prev => ({ 
          ...prev, 
          goals: newGoals,  // Replace all goals instead of appending
          // Optionally reset other fields for a complete clean slate
          // vision: '',
          // mission: '',
          // logoUrl: ''
        }));
        setStatus(`✅ Replaced entire plan with ${newGoals.length} goals from CSV`);
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('No valid goals found in CSV');
      }
    } catch (error) {
      console.error('CSV parsing error:', error);
      setStatus('❌ Error parsing CSV file');
    }

    // Clear the input
    event.target.value = '';
  };

  const addTeamMember = () => {
    setPlanData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, '']
    }));
  };

  const updateTeamMember = (index: number, value: string) => {
    setPlanData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? value : member
      )
    }));
  };

  const removeTeamMember = (index: number) => {
    setPlanData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const addGoal = () => {
    setPlanData(prev => ({
      ...prev,
      goals: [...prev.goals, {
        name: '',
        strategies: [],
        measures: [],
        actions: [],
        owner: ''
      }]
    }));
  };

  const updateGoal = (index: number, field: keyof Goal, value: any) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === index ? { ...goal, [field]: value } : goal
      )
    }));
  };

  const addMeasureAction = (goalIndex: number, type: 'measures' | 'actions') => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex ? {
          ...goal,
          [type]: [...goal[type], { text: '', archived: false }]
        } : goal
      )
    }));
  };

  const updateMeasureAction = (goalIndex: number, type: 'measures' | 'actions', itemIndex: number, field: keyof MeasureAction, value: any) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex ? {
          ...goal,
          [type]: goal[type].map((item, j) => 
            j === itemIndex ? { ...item, [field]: value } : item
          )
        } : goal
      )
    }));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newGoals = [...planData.goals];
    const draggedGoal = newGoals[draggedIndex];
    newGoals.splice(draggedIndex, 1);
    newGoals.splice(dropIndex, 0, draggedGoal);

    setPlanData(prev => ({ ...prev, goals: newGoals }));
    setDraggedIndex(null);
  };

  const goalColors = ['bg-blue-50 border-blue-200', 'bg-green-50 border-green-200', 'bg-purple-50 border-purple-200', 'bg-orange-50 border-orange-200'];

  // Progress Summary Calculations
  const getProgressSummary = () => {
    const allActions = planData.goals.flatMap(goal => goal.actions || []);
    const allMeasures = planData.goals.flatMap(goal => goal.measures || []);

    const completedActions = allActions.filter(action => action.archived).length;
    const completedMeasures = allMeasures.filter(measure => measure.archived).length;

    const actionsCompletionRate = allActions.length > 0 ? Math.round((completedActions / allActions.length) * 100) : 0;
    const measuresCompletionRate = allMeasures.length > 0 ? Math.round((completedMeasures / allMeasures.length) * 100) : 0;

    const goalsWithAllActionsComplete = planData.goals.filter(goal => {
      const actions = goal.actions || [];
      return actions.length > 0 && actions.every(action => action.archived);
    }).length;

    const overdueItems = [...allActions, ...allMeasures].filter(item => 
      !item.archived && item.dueDate && isOverdue(item.dueDate)
    ).length;

    const upcomingItems = [...allActions, ...allMeasures]
      .filter(item => !item.archived && item.dueDate && !isOverdue(item.dueDate))
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

    const nextDueDate = upcomingItems.length > 0 ? upcomingItems[0].dueDate : null;

    return {
      actionsCompletionRate,
      measuresCompletionRate,
      goalsWithAllActionsComplete,
      overdueItems,
      nextDueDate
    };
  };

  // Helper functions for progress view
  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const isDueThisWeek = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return due >= today && due <= nextWeek;
  };

  const progressSummary = getProgressSummary();

  const getProgressItems = () => {
    const items: { [memberName: string]: Array<{ type: 'action' | 'measure', item: MeasureAction, goalName: string }> } = {};

    planData.teamMembers.forEach(member => {
      if (member.trim()) {
        items[member] = [];
      }
    });

    planData.goals.forEach(goal => {
      goal.actions.forEach(action => {
        if (action.assignee && action.assignee.trim() && items[action.assignee]) {
          items[action.assignee].push({ type: 'action', item: action, goalName: goal.name || 'Untitled Goal' });
        }
      });

      goal.measures.forEach(measure => {
        if (measure.assignee && measure.assignee.trim() && items[measure.assignee]) {
          items[measure.assignee].push({ type: 'measure', item: measure, goalName: goal.name || 'Untitled Goal' });
        }
      });
    });

    return items;
  };

  const getStatusIcon = (item: MeasureAction) => {
    if (item.archived) return '✅';
    if (isOverdue(item.dueDate)) return '⚠️';
    if (isDueThisWeek(item.dueDate)) return '⏳';
    return '📋';
  };

  const getStatusColor = (item: MeasureAction) => {
    if (item.archived) return 'text-green-600 bg-green-50';
    if (isOverdue(item.dueDate)) return 'text-red-600 bg-red-50';
    if (isDueThisWeek(item.dueDate)) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Filter functions
  const filterMeasureAction = (item: MeasureAction) => {
    // Assignee filter
    if (filters.assignee && item.assignee !== filters.assignee) {
      return false;
    }

    // Status filter
    if (filters.status === 'archived' && !item.archived) {
      return false;
    }
    if (filters.status === 'active' && item.archived) {
      return false;
    }

    // Due status filter
    if (filters.dueStatus === 'overdue' && (!item.dueDate || !isOverdue(item.dueDate) || item.archived)) {
      return false;
    }
    if (filters.dueStatus === 'due_soon' && (!item.dueDate || !isDueThisWeek(item.dueDate) || item.archived)) {
      return false;
    }
    if (filters.dueStatus === 'no_due_date' && item.dueDate) {
      return false;
    }

    return true;
  };

  const getFilteredGoals = () => {
    return planData.goals.map(goal => ({
      ...goal,
      measures: goal.measures.filter(filterMeasureAction),
      actions: goal.actions.filter(filterMeasureAction)
    }));
  };

  const filteredGoals = getFilteredGoals();

  return (
    <main className="min-h-screen bg-gray-50 p-2 sm:p-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 w-full">
        {/* Collapsible Header Panel - Only in Presentation Mode */}
        {mode === 'presentation' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Collapsed State - Always Visible */}
            <div className="p-2 sm:p-4 border-b bg-gray-50">
              <button
                onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                className="flex items-center justify-between w-full text-left hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {planData.logoUrl && (
                    <img src={planData.logoUrl} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover flex-shrink-0" />
                  )}
                  <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">🌍 Strategic Business Plan</h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {isHeaderCollapsed ? 'Show Details' : 'Hide Details'}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isHeaderCollapsed ? '' : 'rotate-180'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Expanded Content */}
            <div className={`transition-all duration-300 ease-in-out ${isHeaderCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'} overflow-hidden`}>
              <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                {/* Vision and Mission */}
                {(planData.vision || planData.mission) && (
                  <div className="text-sm text-gray-600 space-y-2">
                    {planData.vision && (
                      <p className="bg-blue-50 p-3 rounded-lg">
                        <span className="font-medium text-blue-800">Vision:</span> 
                        <span className="ml-2">{planData.vision}</span>
                      </p>
                    )}
                    {planData.mission && (
                      <p className="bg-green-50 p-3 rounded-lg">
                        <span className="font-medium text-green-800">Mission:</span> 
                        <span className="ml-2">{planData.mission}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Progress Summary */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Plan Progress Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                      <div className="text-xl font-bold text-green-600">✅ {progressSummary.actionsCompletionRate}%</div>
                      <div className="text-green-700 text-xs">Actions Complete</div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                      <div className="text-xl font-bold text-blue-600">📊 {progressSummary.measuresCompletionRate}%</div>
                      <div className="text-blue-700 text-xs">Measures Complete</div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                      <div className="text-xl font-bold text-purple-600">🎯 {progressSummary.goalsWithAllActionsComplete}</div>
                      <div className="text-purple-700 text-xs">Goals Fully Complete</div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                      <div className="text-xl font-bold text-red-600">⚠️ {progressSummary.overdueItems}</div>
                      <div className="text-red-700 text-xs">Overdue Items</div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
                      <div className="text-lg font-bold text-yellow-600">⏳</div>
                      <div className="text-yellow-700 text-xs">Next Due</div>
                      <div className="text-xs mt-1 font-medium truncate">
                        {progressSummary.nextDueDate ? progressSummary.nextDueDate : 'None'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-3 sm:pt-4 flex flex-wrap gap-1 sm:gap-2">
                  {isAdmin && (
                    <label className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                      📄 Replace with CSV
                      <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                    </label>
                  )}

                  <button 
                    onClick={() => setShowVersions(!showVersions)} 
                    className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    🕐 Version History ({versions.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Header for Edit Mode */}
        {mode !== 'presentation' && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
                {/* Header with logo and title in horizontal row */}
                <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                  {planData.logoUrl && (
                    <img src={planData.logoUrl} alt="Logo" className="w-12 sm:w-20 h-auto rounded flex-shrink-0" />
                  )}
                  <h1 className="text-lg sm:text-3xl font-bold text-gray-900 min-w-0">🌍 Strategic Business Plan</h1>
                </div>

                {/* Vision and Mission as subtle subtitles */}
                {(planData.vision || planData.mission) && (
                  <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600 space-y-1">
                    {planData.vision && <p className="break-words"><span className="font-medium">Vision:</span> {planData.vision}</p>}
                    {planData.mission && <p className="break-words"><span className="font-medium">Mission:</span> {planData.mission}</p>}
                  </div>
                )}
            </div>

            {/* Progress Summary Bar */}
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-3 sm:p-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">📊 Plan Progress Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-600">✅ {progressSummary.actionsCompletionRate}%</div>
                  <div className="text-green-700">Actions Complete</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">📊 {progressSummary.measuresCompletionRate}%</div>
                  <div className="text-blue-700">Measures Complete</div>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">🎯 {progressSummary.goalsWithAllActionsComplete}</div>
                  <div className="text-purple-700">Goals Fully Complete</div>
                </div>

                <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                  <div className="text-2xl font-bold text-red-600">⚠️ {progressSummary.overdueItems}</div>
                  <div className="text-red-700">Overdue Items</div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
                  <div className="text-lg font-bold text-yellow-600">⏳</div>
                  <div className="text-yellow-700">Next Due</div>
                  <div className="text-xs mt-1 font-medium">
                    {progressSummary.nextDueDate ? progressSummary.nextDueDate : 'None'}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
            {/* Desktop Controls */}
            <div className="hidden sm:flex gap-4 mb-6">
              <button
                onClick={() => setMode('edit')}
                className={`px-4 py-2 rounded-lg ${mode === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                ✏️ Edit Mode
              </button>

              <button
                onClick={() => setMode('presentation')}
                className={`px-4 py-2 rounded-lg ${mode === 'presentation' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                📊 Presentation Mode
              </button>

              <button
                onClick={() => setMode('progress')}
                className={`px-4 py-2 rounded-lg ${mode === 'progress' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                📈 Weekly Progress
              </button>

              <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                💾 Save Plan
              </button>

              {/* Show controls only in Edit/Progress mode, not Presentation */}
              {mode !== 'presentation' && (
                <>
                  <button 
                    onClick={() => setShowVersions(!showVersions)} 
                    className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                  >
                    🕐 Version History ({versions.length})
                  </button>

                  {isAdmin && (
                    <label className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer text-sm">
                      📄 Replace with CSV
                      <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                    </label>
                  )}
                </>
              )}
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50">
              <div className="flex gap-2 justify-center max-w-screen-sm mx-auto">
                <button
                  onClick={() => setMode('edit')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${mode === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setMode('presentation')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${mode === 'presentation' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  📊 Present
                </button>
                <button
                  onClick={() => setMode('progress')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${mode === 'progress' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  📈 Progress
                </button>
                <button onClick={handleSave} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm">
                  💾 Save
                </button>
              </div>
            </div>

            {/* Version History Modal */}
            {showVersions && (
              <div className="mb-6 bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">🕐 Version History ({versions.length})</h3>
                  <span className="text-sm text-gray-500">Auto-saved on plan changes</span>
                </div>
                {versions.length === 0 ? (
                  <p className="text-gray-500">No versions saved yet. Versions are created automatically when you save the plan.</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {versions.map((version, index) => (
                      <div key={version.id} className="flex items-center justify-between bg-white p-3 rounded border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-medium text-sm">
                              {version.label || 'Auto-save'} 
                              {index === 0 && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded ml-2">Latest</span>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">{new Date(version.timestamp).toLocaleString()}</div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to restore the version from ${new Date(version.timestamp).toLocaleString()}? This will replace your current plan.`)) {
                              restoreVersion(version);
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                          disabled={index === 0}
                        >
                          {index === 0 ? 'Current' : 'Restore'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {status && <p className="text-sm mb-4 px-3 py-2 bg-blue-50 text-blue-700 rounded">{status}</p>}

            {mode === 'edit' && (
              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
                    <label className="w-full border border-gray-300 rounded-lg px-3 py-2 cursor-pointer bg-white hover:bg-gray-50 flex items-center justify-center">
                      📷 Choose Logo File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {planData.logoUrl && <img src={planData.logoUrl} alt="Logo" className="mt-2 max-w-20 h-auto rounded" />}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vision Statement</label>
                    <textarea
                      value={planData.vision}
                      onChange={e => setPlanData(prev => ({ ...prev, vision: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                      placeholder="Our vision..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                    <textarea
                      value={planData.mission}
                      onChange={e => setPlanData(prev => ({ ...prev, mission: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                      placeholder="Our mission..."
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">👥 Team Members</label>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                    {planData.teamMembers.map((member, i) => (
                      <div key={i} className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2 py-1">
                        <input
                          type="text"
                          value={member}
                          onChange={e => updateTeamMember(i, e.target.value)}
                          className="text-sm bg-transparent border-none outline-none min-w-0 flex-1"
                          placeholder="Name"
                        />
                        <button
                          onClick={() => removeTeamMember(i)}
                          className="text-red-500 hover:text-red-700 text-xs ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addTeamMember}
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg px-3 py-1 text-sm"
                    >
                      + Add Member
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        {mode === 'progress' ? (
          <div className="space-y-4 sm:space-y-6 pb-16 sm:pb-0">
            {/* Header with Download Report Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">📈 Weekly Progress by Team Member</h2>
              {isAdmin && (
                <button
                  onClick={() => {
                    const date = new Date().toISOString().split('T')[0];
                    const filename = `weekly-progress-${date}.html`;

                    const progressItems = getProgressItems();
                    let htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Weekly Progress Report - ${date}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .member-section { margin-bottom: 25px; border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
        .member-name { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .progress-bar { width: 100%; height: 20px; background-color: #f0f0f0; border-radius: 10px; overflow: hidden; margin-bottom: 15px; }
        .progress-fill { height: 100%; transition: width 0.3s ease; }
        .item { padding: 10px; margin: 5px 0; border-radius: 5px; }
        .completed { background-color: #d4edda; color: #155724; }
        .overdue { background-color: #f8d7da; color: #721c24; }
        .due-soon { background-color: #fff3cd; color: #856404; }
        .other { background-color: #f8f9fa; color: #495057; }
        .stats { display: flex; gap: 15px; margin-bottom: 15px; }
        .stat-card { padding: 10px; border-radius: 5px; text-align: center; flex: 1; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📈 Weekly Progress Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        ${planData.vision ? `<p><strong>Vision:</strong> ${planData.vision}</p>` : ''}
        ${planData.mission ? `<p><strong>Mission:</strong> ${planData.mission}</p>` : ''}
    </div>`;

                    Object.entries(progressItems).forEach(([memberName, items]) => {
                      const completed = items.filter(item => item.item.archived).length;
                      const overdue = items.filter(item => !item.item.archived && item.item.dueDate && isOverdue(item.item.dueDate)).length;
                      const dueThisWeek = items.filter(item => !item.item.archived && item.item.dueDate && isDueThisWeek(item.item.dueDate)).length;
                      const completionPercentage = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

                      htmlContent += `
    <div class="member-section">
        <div class="member-name">👤 ${memberName}</div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${completionPercentage}%; background-color: ${completionPercentage >= 80 ? '#28a745' : completionPercentage >= 50 ? '#ffc107' : '#dc3545'};"></div>
        </div>
        <div class="stats">
            <div class="stat-card completed">✅ ${completed} Completed</div>
            <div class="stat-card overdue">⚠️ ${overdue} Overdue</div>
            <div class="stat-card due-soon">📅 ${dueThisWeek} Due This Week</div>
        </div>`;

                      items.forEach(entry => {
                        const statusClass = entry.item.archived ? 'completed' : 
                                          isOverdue(entry.item.dueDate) && !entry.item.archived ? 'overdue' :
                                          isDueThisWeek(entry.item.dueDate) && !entry.item.archived ? 'due-soon' : 'other';
                        const icon = getStatusIcon(entry.item);

                        htmlContent += `
        <div class="item ${statusClass}">
            <strong>${icon} ${entry.type.toUpperCase()}</strong> from "${entry.goalName}"<br>
            ${entry.item.text || 'Untitled item'}
            ${entry.item.dueDate ? `<br><small>📅 Due: ${entry.item.dueDate}</small>` : ''}
        </div>`;
                      });

                      htmlContent += `    </div>`;
                    });

                    htmlContent += `
</body>
</html>`;

                    const blob = new Blob([htmlContent], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    setStatus(`📥 Weekly report downloaded: ${filename}`);
                    setTimeout(() => setStatus(''), 3000);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
                >
                  📥 Download Weekly Report
                </button>
              )}
            </div>

            {/* Quick Stats Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Weekly Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {(() => {
                  const allItems = Object.values(getProgressItems()).flat();
                  const completed = allItems.filter(item => item.item.archived).length;
                  const overdue = allItems.filter(item => !item.item.archived && item.item.dueDate && isOverdue(item.item.dueDate)).length;
                  const dueThisWeek = allItems.filter(item => !item.item.archived && item.item.dueDate && isDueThisWeek(item.item.dueDate)).length;
                  const total = allItems.length;

                  return (
                    <>
                      <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                        <div className="text-xl font-bold text-green-600">✅ {completed}</div>
                        <div className="text-green-700 text-xs">Completed</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                        <div className="text-xl font-bold text-red-600">⚠️ {overdue}</div>
                        <div className="text-red-700 text-xs">Overdue</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
                        <div className="text-xl font-bold text-yellow-600">📅 {dueThisWeek}</div>
                        <div className="text-yellow-700 text-xs">Due This Week</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                        <div className="text-xl font-bold text-blue-600">📋 {total}</div>
                        <div className="text-blue-700 text-xs">Total Items</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Team Member Progress */}
            {Object.entries(getProgressItems()).map(([memberName, items]) => {
              const completed = items.filter(item => item.item.archived).length;
              const completionPercentage = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

              return (
                <div key={memberName} className="bg-white rounded-lg shadow-sm border p-3 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 break-words">
                      👤 {memberName}
                      <span className="text-xs sm:text-sm font-normal text-gray-500">({items.length} items)</span>
                    </h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{completionPercentage}%</div>
                      <div className="text-xs text-blue-700">Complete</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        completionPercentage >= 80 ? 'bg-green-500' : 
                        completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-gray-500 text-sm">No assigned items</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((entry, index) => (
                        <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor(entry.item)}`}>
                          <span className="text-xl">{getStatusIcon(entry.item)}</span>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium uppercase tracking-wide opacity-75">
                                {entry.type}
                              </span>
                              <span className="text-xs text-gray-600">from "{entry.goalName}"</span>
                            </div>

                            <p className={`text-sm ${entry.item.archived ? 'line-through opacity-60' : ''}`}>
                              {entry.item.text || 'Untitled item'}
                            </p>

                            {entry.item.dueDate && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-white/50 px-2 py-1 rounded">
                                  📅 Due: {entry.item.dueDate}
                                </span>
                                {isOverdue(entry.item.dueDate) && !entry.item.archived && (
                                  <span className="text-xs text-red-600 font-medium">OVERDUE</span>
                                )}
                                {isDueThisWeek(entry.item.dueDate) && !entry.item.archived && (
                                  <span className="text-xs text-yellow-600 font-medium">DUE THIS WEEK</span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            {entry.item.archived ? (
                              <span className="text-xs text-green-600 font-medium">COMPLETED</span>
                            ) : (
                              <span className="text-xs text-gray-500">In Progress</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {planData.teamMembers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">No team members found</p>
                <p className="text-sm">Add team members in Edit Mode to see their progress here.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 w-full sm:w-auto mb-1 sm:mb-0">🔍 Filters:</h3>

                {/* Assignee Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">Assignee:</label>
                  <select
                    value={filters.assignee}
                    onChange={e => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
                    className="text-xs border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="">All</option>
                    {planData.teamMembers.filter(Boolean).map((member, i) => (
                      <option key={i} value={member}>{member}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">Status:</label>
                  <select
                    value={filters.status}
                    onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="text-xs border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Due Status Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">Due Status:</label>
                  <select
                    value={filters.dueStatus}
                    onChange={e => setFilters(prev => ({ ...prev, dueStatus: e.target.value }))}
                    className="text-xs border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="all">All</option>
                    <option value="overdue">Overdue</option>
                    <option value="due_soon">Due Soon</option>
                    <option value="no_due_date">No Due Date</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => setFilters({ assignee: '', status: 'all', dueStatus: 'all' })}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 pb-16 sm:pb-0">
              {filteredGoals.map((goal, goalIndex) => (
            <div
              key={goalIndex}
              draggable={mode === 'edit'}
              onDragStart={() => handleDragStart(goalIndex)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, goalIndex)}
              className={`${goalColors[goalIndex % goalColors.length]} rounded-lg border-2 p-3 sm:p-6 cursor-move hover:shadow-md transition-shadow overflow-hidden`}
            >
              <div className="mb-3 sm:mb-4">
                {mode === 'edit' ? (
                  <div className="relative"> {/* Add relative positioning */}
                    <input
                      type="text"
                      value={planData.goals[goalIndex].name}
                      onChange={e => updateGoal(goalIndex, 'name', e.target.value)}
                      className="w-full text-base sm:text-lg font-semibold bg-transparent border-b border-gray-300 pb-1 focus:border-gray-500 outline-none"
                      placeholder="Goal Name"
                    />
                     <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this goal and all related items?')) {
                          const newGoals = [...planData.goals];
                          newGoals.splice(goalIndex, 1);
                          setPlanData(prev => ({ ...prev, goals: newGoals }));
                           // Optimistically update versions to remove the goal from future versions
                          setVersions(prevVersions =>
                            prevVersions.map(version => {
                              const newVersionGoals = [...version.data.goals];
                              newVersionGoals.splice(goalIndex, 1); // remove the goal in version
                              return {
                                ...version,
                                data: {
                                  ...version.data,
                                  goals: newVersionGoals
                                }
                              };
                            })
                          );

                          handleSave(); // Save the plan to persist changes and trigger auto-save version if content changed

                        }
                      }}
                      className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                    >
                      🗑️{/* Delete Icon */}
                    </button>
                  </div>
                ) : (
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words">{planData.goals[goalIndex].name || 'Untitled Goal'}</h3>
                )}
              </div>

              <div className="mb-3 sm:mb-4">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">👤 Goal Owner</h4>
                {mode === 'edit' ? (
                  <select
                    value={planData.goals[goalIndex].owner || ''}
                    onChange={e => updateGoal(goalIndex, 'owner', e.target.value)}
                    className="w-full text-xs sm:text-sm border border-gray-200 rounded px-2 py-1 mb-2 sm:mb-3"
                  >
                    <option value="">Select owner</option>
                    {planData.teamMembers.filter(Boolean).map((member, i) => (
                      <option key={i} value={member}>{member}</option>
                    ))}
                  </select>
                ) : (
                  <div className="mb-2 sm:mb-3">
                    {planData.goals[goalIndex].owner ? (
                      <span className="text-xs sm:text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium break-all">
                        👤 {planData.goals[goalIndex].owner}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No owner assigned</span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">📊 Measures</h4>
                  <div className="space-y-1 sm:space-y-2">
                    {goal.measures.map((measure, i) => (
                      <div key={i} className="flex items-start gap-1 sm:gap-2">
                        <input
                          type="checkbox"
                          checked={measure.archived}
                          onChange={e => updateMeasureAction(goalIndex, 'measures', i, 'archived', e.target.checked)}
                          className="rounded mt-1 flex-shrink-0"
                        />
                        {mode === 'edit' ? (
                          <div className="flex-1 space-y-1 min-w-0">
                            <input
                              type="text"
                              value={measure.text}
                              onChange={e => updateMeasureAction(goalIndex, 'measures', i, 'text', e.target.value)}
                              className="w-full text-xs sm:text-sm border border-gray-200 rounded px-2 py-1"
                              placeholder="Measure"
                            />
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              <input
                                type="date"
                                value={measure.dueDate || ''}
                                onChange={e => updateMeasureAction(goalIndex, 'measures', i, 'dueDate', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5 flex-1"
                              />
                              <select
                                value={measure.assignee || ''}
                                onChange={e => updateMeasureAction(goalIndex, 'measures', i, 'assignee', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5 flex-1 truncate"
                              >
                                <option value="">Select assignee</option>
                                {planData.teamMembers.filter(Boolean).map((member, mi) => (
                                  <option key={mi} value={member}>{member}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs sm:text-sm ${measure.archived ? 'line-through text-gray-400' : 'text-gray-700'} break-words`}>
                              {measure.text}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {measure.dueDate && <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded whitespace-nowrap">⏰ {measure.dueDate}</span>}
                              {measure.assignee && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded break-all">👤 {measure.assignee}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {mode === 'edit' && (
                      <button
                        onClick={() => addMeasureAction(goalIndex, 'measures')}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        + Add Measure
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">🎯 Strategies</h4>
                  {mode === 'edit' ? (
                    <div className="space-y-1 sm:space-y-2">
                      {Array.isArray(planData.goals[goalIndex].strategies) && planData.goals[goalIndex].strategies.map((strategy, i) => (
                        <input
                          key={i}
                          type="text"
                          value={strategy}
                          onChange={e => updateGoal(goalIndex, 'strategies', planData.goals[goalIndex].strategies.map((s, si) => si === i ? e.target.value : s))}
                          className="w-full text-xs sm:text-sm border border-gray-200 rounded px-2 py-1"
                          placeholder="Strategy"
                        />
                      ))}
                      <button
                        onClick={() => updateGoal(goalIndex, 'strategies', [...(planData.goals[goalIndex].strategies || []), ''])}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        + Add Strategy
                      </button>
                    </div>
                  ) : (
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                      {Array.isArray(planData.goals[goalIndex].strategies) && planData.goals[goalIndex].strategies.map((strategy, i) => strategy && <li key={i} className="break-words">• {strategy}</li>)}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">⚡ Actions</h4>
                  <div className="space-y-1 sm:space-y-2">
                    {goal.actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-1 sm:gap-2">
                        <input
                          type="checkbox"
                          checked={action.archived}
                          onChange={e => updateMeasureAction(goalIndex, 'actions', i, 'archived', e.target.checked)}
                          className="rounded mt-1 flex-shrink-0"
                        />
                        {mode === 'edit' ? (
                          <div className="flex-1 space-y-1 min-w-0">
                            <input
                              type="text"
                              value={action.text}
                              onChange={e => updateMeasureAction(goalIndex, 'actions', i, 'text', e.target.value)}
                              className="w-full text-xs sm:text-sm border border-gray-200 rounded px-2 py-1"
                              placeholder="Action"
                            />
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              <input
                                type="date"
                                value={action.dueDate || ''}
                                onChange={e => updateMeasureAction(goalIndex, 'actions', i, 'dueDate', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5 flex-1"
                              />
                              <select
                                value={action.assignee || ''}
                                onChange={e => updateMeasureAction(goalIndex, 'actions', i, 'assignee', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5 flex-1 truncate"
                              >
                                <option value="">Select assignee</option>
                                {planData.teamMembers.filter(Boolean).map((member, mi) => (
                                  <option key={mi} value={member}>{member}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs sm:text-sm ${action.archived ? 'line-through text-gray-400' : 'text-gray-700'} break-words`}>
                              {action.text}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {action.dueDate && <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded whitespace-nowrap">⏰ {action.dueDate}</span>}
                              {action.assignee && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded break-all">👤 {action.assignee}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {mode === 'edit' && (
                      <button
                        onClick={() => addMeasureAction(goalIndex, 'actions')}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        + Add Action
                      </button>
                    )}
                  </div>
                </div>


              </div>
            </div>
          ))}

              {/* Show message if no goals match filters */}
              {filteredGoals.every(goal => goal.measures.length === 0 && goal.actions.length === 0) && 
               (filters.assignee || filters.status !== 'all' || filters.dueStatus !== 'all') && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p>No items match the current filters.</p>
                  <button
                    onClick={() => setFilters({ assignee: '', status: 'all', dueStatus: 'all' })}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                  >
                    Clear filters to see all items
                  </button>
                </div>
              )}

          {mode === 'edit' && (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 flex items-center justify-center">
              <button
                onClick={addGoal}
                className="text-gray-600 hover:text-gray-800 text-center"
              >
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">+</div>
                <div className="text-xs sm:text-sm">Add New Goal</div>
              </button>
            </div>
          )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}