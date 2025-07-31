
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
  assignedTeam: string[];
}

interface PlanData {
  logoUrl: string;
  vision: string;
  mission: string;
  goals: Goal[];
}

export default function Page() {
  const [planData, setPlanData] = useState<PlanData>({
    logoUrl: '',
    vision: '',
    mission: '',
    goals: []
  });
  const [status, setStatus] = useState('');
  const [mode, setMode] = useState<'edit' | 'presentation'>('edit');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
            measures: Array.isArray(goal.measures) ? goal.measures : [],
            actions: Array.isArray(goal.actions) ? goal.actions : [],
            assignedTeam: Array.isArray(goal.assignedTeam) ? goal.assignedTeam : []
          }));
          
          setPlanData({
            logoUrl: data.logoUrl || '',
            vision: data.vision || '',
            mission: data.mission || '',
            goals: safeGoals
          });
        }
      })
      .catch(err => console.error('Failed to load plan:', err));
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
          assignedTeam: values[4] ? values[4].split(';').map(t => t.trim()).filter(Boolean) : []
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

  const addGoal = () => {
    setPlanData(prev => ({
      ...prev,
      goals: [...prev.goals, {
        name: '',
        strategies: [],
        measures: [],
        actions: [],
        assignedTeam: []
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

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🌍 Strategic Business Plan</h1>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode(mode === 'edit' ? 'presentation' : 'edit')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {mode === 'edit' ? '📊 Presentation Mode' : '✏️ Edit Mode'}
            </button>
            
            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              💾 Save Plan
            </button>
            
            {isAdmin && (
              <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                📄 Import CSV
                <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
              </label>
            )}
          </div>

          {status && <p className="text-sm mb-4 px-3 py-2 bg-blue-50 text-blue-700 rounded">{status}</p>}

          {mode === 'edit' && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="text"
                  value={planData.logoUrl}
                  onChange={e => setPlanData(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Logo URL or base64"
                />
                {planData.logoUrl && <img src={planData.logoUrl} alt="Logo" className="mt-2 max-w-24 h-auto" />}
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
          )}

          {mode === 'presentation' && (planData.vision || planData.mission) && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              {planData.logoUrl && <img src={planData.logoUrl} alt="Logo" className="mb-4 max-w-32 h-auto" />}
              {planData.vision && <div className="mb-4"><h3 className="font-semibold text-gray-700">Vision:</h3><p className="text-gray-600">{planData.vision}</p></div>}
              {planData.mission && <div><h3 className="font-semibold text-gray-700">Mission:</h3><p className="text-gray-600">{planData.mission}</p></div>}
            </div>
          )}
        </div>

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

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">🎯 Strategies</h4>
                  {mode === 'edit' ? (
                    <div className="space-y-2">
                      {goal.strategies.map((strategy, i) => (
                        <input
                          key={i}
                          type="text"
                          value={strategy}
                          onChange={e => updateGoal(goalIndex, 'strategies', (goal.strategies || []).map((s, si) => si === i ? e.target.value : s))}
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
                      {(goal.strategies || []).map((strategy, i) => strategy && <li key={i}>• {strategy}</li>)}
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
                              <input
                                type="text"
                                value={measure.assignee || ''}
                                onChange={e => updateMeasureAction(goalIndex, 'measures', i, 'assignee', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5"
                                placeholder="Assignee"
                              />
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
                              <input
                                type="text"
                                value={action.assignee || ''}
                                onChange={e => updateMeasureAction(goalIndex, 'actions', i, 'assignee', e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1 py-0.5"
                                placeholder="Assignee"
                              />
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

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">👥 Team</h4>
                  {mode === 'edit' ? (
                    <div className="space-y-2">
                      {goal.assignedTeam.map((member, i) => (
                        <input
                          key={i}
                          type="text"
                          value={member}
                          onChange={e => updateGoal(goalIndex, 'assignedTeam', (goal.assignedTeam || []).map((m, mi) => mi === i ? e.target.value : m))}
                          className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                          placeholder="Team member"
                        />
                      ))}
                      <button
                        onClick={() => updateGoal(goalIndex, 'assignedTeam', [...(goal.assignedTeam || []), ''])}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        + Add Team Member
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {(goal.assignedTeam || []).map((member, i) => member && (
                        <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {member}
                        </span>
                      ))}
                    </div>
                  )}
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
      </div>
    </main>
  );
}
