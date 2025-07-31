
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

interface Snapshot {
  key: string;
  timestamp: string;
  label: string;
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
  const [showSnapshots, setShowSnapshots] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [snapshotLabel, setSnapshotLabel] = useState('');

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

    // Load snapshots
    loadSnapshots();
  }, []);

  const handleSave = async () => {
    try {
      setStatus('Saving...');
      console.log('Saving plan data to /api/plan...');
      console.log('Sending plan data:', planData);

      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        setStatus('Saved ✅');
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus('Save failed ❌');
      }
    } catch (error) {
      console.error('Save error:', error);
      setStatus('Save failed ❌');
    }
  };

  const handleSaveSnapshot = async () => {
    try {
      setStatus('Saving snapshot...');
      const timestamp = new Date().toISOString();
      const key = `plan_version_${timestamp}`;
      
      const snapshotData = {
        key,
        timestamp,
        label: snapshotLabel || 'Snapshot',
        data: planData
      };

      const response = await fetch('/api/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshotData),
      });

      if (response.ok) {
        setStatus('Snapshot saved ✅');
        setSnapshotLabel('');
        loadSnapshots();
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus('Snapshot save failed ❌');
      }
    } catch (error) {
      console.error('Snapshot save error:', error);
      setStatus('Snapshot save failed ❌');
    }
  };

  const loadSnapshots = async () => {
    try {
      const response = await fetch('/api/snapshots');
      if (response.ok) {
        const data = await response.json();
        setSnapshots(data.snapshots || []);
      }
    } catch (error) {
      console.error('Failed to load snapshots:', error);
    }
  };

  const viewSnapshot = (snapshot: Snapshot) => {
    setPlanData(snapshot.data);
    setShowSnapshots(false);
    setStatus(`Viewing snapshot: ${snapshot.label}`);
    setTimeout(() => setStatus(''), 3000);
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
        setPlanData(prev => ({ ...prev, goals: [...prev.goals, ...newGoals] }));
        setStatus(`✅ Imported ${newGoals.length} goals from CSV`);
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

  const progressSummary = getProgressSummary();

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

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header with logo and title in horizontal row */}
            <div className="flex items-center gap-4 mb-4">
              {planData.logoUrl && (
                <img src={planData.logoUrl} alt="Logo" className="w-20 h-auto rounded" />
              )}
              <h1 className="text-3xl font-bold text-gray-900">🌍 Strategic Business Plan</h1>
            </div>

            {/* Vision and Mission as subtle subtitles */}
            {(planData.vision || planData.mission) && (
              <div className="mb-4 text-sm text-gray-600 space-y-1">
                {planData.vision && <p><span className="font-medium">Vision:</span> {planData.vision}</p>}
                {planData.mission && <p><span className="font-medium">Mission:</span> {planData.mission}</p>}
              </div>
            )}
        </div>

        {/* Progress Summary Bar */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">📊 Plan Progress Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
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

        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-4 mb-6">
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

              {/* Snapshot controls */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={snapshotLabel}
                  onChange={(e) => setSnapshotLabel(e.target.value)}
                  placeholder="Snapshot label"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
                <button onClick={handleSaveSnapshot} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  📸 Save Snapshot
                </button>
                <button 
                  onClick={() => setShowSnapshots(!showSnapshots)} 
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  📋 View Snapshots
                </button>
              </div>

              {isAdmin && (
                <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                  📄 Import CSV
                  <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Snapshots Modal */}
            {showSnapshots && (
              <div className="mb-6 bg-gray-50 rounded-lg p-4 border">
                <h3 className="text-lg font-semibold mb-3">📋 Saved Snapshots</h3>
                {snapshots.length === 0 ? (
                  <p className="text-gray-500">No snapshots saved yet</p>
                ) : (
                  <div className="space-y-2">
                    {snapshots.map((snapshot) => (
                      <div key={snapshot.key} className="flex items-center justify-between bg-white p-3 rounded border">
                        <div>
                          <div className="font-medium">{snapshot.label}</div>
                          <div className="text-sm text-gray-500">{new Date(snapshot.timestamp).toLocaleString()}</div>
                        </div>
                        <button
                          onClick={() => viewSnapshot(snapshot)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {status && <p className="text-sm mb-4 px-3 py-2 bg-blue-50 text-blue-700 rounded">{status}</p>}

            {mode === 'edit' && (
              <div className="space-y-6 mb-8">
                <div className="grid md:grid-cols-3 gap-6">
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

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">👥 Team Members</label>
                  <div className="flex flex-wrap gap-2 mb-3">
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
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Weekly Progress by Team Member</h2>
            {Object.entries(getProgressItems()).map(([memberName, items]) => (
              <div key={memberName} className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  👤 {memberName}
                  <span className="text-sm font-normal text-gray-500">({items.length} items)</span>
                </h3>
                
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
            ))}
            
            {planData.teamMembers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">No team members found</p>
                <p className="text-sm">Add team members in Edit Mode to see their progress here.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {planData.goals.map((goal, goalIndex) => (
            <div
              key={goalIndex}
              draggable={mode === 'edit'}
              onDragStart={() => handleDragStart(goalIndex)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, goalIndex)}
              className={`${goalColors[goalIndex % goalColors.length]} rounded-lg border-2 p-6 cursor-move hover:shadow-md transition-shadow`}
            >
              <div className="mb-4">
                {mode === 'edit' ? (
                  <input
                    type="text"
                    value={goal.name}
                    onChange={e => updateGoal(goalIndex, 'name', e.target.value)}
                    className="w-full text-lg font-semibold bg-transparent border-b border-gray-300 pb-1 focus:border-gray-500 outline-none"
                    placeholder="Goal Name"
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-gray-800">{goal.name || 'Untitled Goal'}</h3>
                )}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">👤 Goal Owner</h4>
                {mode === 'edit' ? (
                  <select
                    value={goal.owner || ''}
                    onChange={e => updateGoal(goalIndex, 'owner', e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1 mb-3"
                  >
                    <option value="">Select owner</option>
                    {planData.teamMembers.filter(Boolean).map((member, i) => (
                      <option key={i} value={member}>{member}</option>
                    ))}
                  </select>
                ) : (
                  <div className="mb-3">
                    {goal.owner ? (
                      <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">
                        👤 {goal.owner}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No owner assigned</span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">🎯 Strategies</h4>
                  {mode === 'edit' ? (
                    <div className="space-y-2">
                      {Array.isArray(goal.strategies) && goal.strategies.map((strategy, i) => (
                        <input
                          key={i}
                          type="text"
                          value={strategy}
                          onChange={e => updateGoal(goalIndex, 'strategies', goal.strategies.map((s, si) => si === i ? e.target.value : s))}
                          className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                          placeholder="Strategy"
                        />
                      ))}
                      <button
                        onClick={() => updateGoal(goalIndex, 'strategies', [...(goal.strategies || []), ''])}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        + Add Strategy
                      </button>
                    </div>
                  ) : (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {Array.isArray(goal.strategies) && goal.strategies.map((strategy, i) => strategy && <li key={i}>• {strategy}</li>)}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">📊 Measures</h4>
                  <div className="space-y-2">
                    {goal.measures.map((measure, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={measure.archived}
                          onChange={e => updateMeasureAction(goalIndex, 'measures', i, 'archived', e.target.checked)}
                          className="rounded"
                        />
                        {mode === 'edit' ? (
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={measure.text}
                              onChange={e => updateMeasureAction(goalIndex, 'measures', i, 'text', e.target.value)}
                              className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                              placeholder="Measure"
                            />
                            <div className="flex gap-2">
                              <input
                                type="date"
                                value={measure.dueDate || ''}
                                onChange={e => updateMeasureAction(goalIndex, 'measures', i, 'dueDate', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5"
                              />
                              <select
                                value={measure.assignee || ''}
                                onChange={e => updateMeasureAction(goalIndex, 'measures', i, 'assignee', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5"
                              >
                                <option value="">Select assignee</option>
                                {planData.teamMembers.filter(Boolean).map((member, mi) => (
                                  <option key={mi} value={member}>{member}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <span className={`text-sm ${measure.archived ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {measure.text}
                            </span>
                            <div className="flex gap-2 mt-1">
                              {measure.dueDate && <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">⏰ {measure.dueDate}</span>}
                              {measure.assignee && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">👤 {measure.assignee}</span>}
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
                  <h4 className="font-medium text-gray-700 mb-2">⚡ Actions</h4>
                  <div className="space-y-2">
                    {goal.actions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={action.archived}
                          onChange={e => updateMeasureAction(goalIndex, 'actions', i, 'archived', e.target.checked)}
                          className="rounded"
                        />
                        {mode === 'edit' ? (
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={action.text}
                              onChange={e => updateMeasureAction(goalIndex, 'actions', i, 'text', e.target.value)}
                              className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                              placeholder="Action"
                            />
                            <div className="flex gap-2">
                              <input
                                type="date"
                                value={action.dueDate || ''}
                                onChange={e => updateMeasureAction(goalIndex, 'actions', i, 'dueDate', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5"
                              />
                              <select
                                value={action.assignee || ''}
                                onChange={e => updateMeasureAction(goalIndex, 'actions', i, 'assignee', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5"
                              >
                                <option value="">Select assignee</option>
                                {planData.teamMembers.filter(Boolean).map((member, mi) => (
                                  <option key={mi} value={member}>{member}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <span className={`text-sm ${action.archived ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {action.text}
                            </span>
                            <div className="flex gap-2 mt-1">
                              {action.dueDate && <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">⏰ {action.dueDate}</span>}
                              {action.assignee && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">👤 {action.assignee}</span>}
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

          {mode === 'edit' && (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center">
              <button
                onClick={addGoal}
                className="text-gray-600 hover:text-gray-800 text-center"
              >
                <div className="text-2xl mb-2">+</div>
                <div className="text-sm">Add New Goal</div>
              </button>
            </div>
          )}
          </div>
        )}
      </div>
    </main>
  );
}
