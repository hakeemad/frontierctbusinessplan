'use client';

import { useState, useEffect } from 'react';

interface Goal {
  name: string;
  measures: string[];
  strategies: string[];
  actions: string[];
}

export default function Page() {
  const [logo, setLogo] = useState('');
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/plan')
      .then(res => res.json())
      .then(data => {
        if (!data) return;
        setLogo(data.logo || '');
        setVision(data.vision || '');
        setMission(data.mission || '');
        setGoals(data.goals || []);
      });
  }, []);

  const handleSave = async () => {
    setStatus('Saving...');
    await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logo, vision, mission, goals }),
    });
    setStatus('Saved ✅');
  };

  const updateGoal = (index: number, field: keyof Goal, value: string) => {
    const updated = [...goals];
    if (field === 'name') updated[index].name = value;
    else updated[index][field] = value.split(',').map(s => s.trim()).filter(Boolean);
    setGoals(updated);
  };

  const addGoal = () => {
    setGoals([...goals, { name: '', measures: [], strategies: [], actions: [] }]);
  };

  return (
    <main className="space-y-6 max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold">🌍 Frontier Business Plan</h1>

      <section>
        <label className="block font-semibold">Logo (base64 or URL)</label>
        <input className="w-full border p-2" value={logo} onChange={e => setLogo(e.target.value)} />
        {logo && <img src={logo} alt="Logo" className="mt-2 max-w-xs" />}
      </section>

      <section>
        <label className="block font-semibold">Vision Statement</label>
        <textarea className="w-full border p-2" value={vision} onChange={e => setVision(e.target.value)} />
      </section>

      <section>
        <label className="block font-semibold">Mission Statement</label>
        <textarea className="w-full border p-2" value={mission} onChange={e => setMission(e.target.value)} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">Goals</h2>
        {goals.map((goal, idx) => (
          <div key={idx} className="border p-4 mt-4 space-y-3">
            <input
              className="w-full border p-2"
              placeholder="Goal Name"
              value={goal.name}
              onChange={e => updateGoal(idx, 'name', e.target.value)}
            />
            <input
              className="w-full border p-2"
              placeholder="Measures (comma-separated)"
              value={goal.measures.join(', ')}
              onChange={e => updateGoal(idx, 'measures', e.target.value)}
            />
            <input
              className="w-full border p-2"
              placeholder="Strategies (comma-separated)"
              value={goal.strategies.join(', ')}
              onChange={e => updateGoal(idx, 'strategies', e.target.value)}
            />
            <input
              className="w-full border p-2"
              placeholder="Actions (comma-separated)"
              value={goal.actions.join(', ')}
              onChange={e => updateGoal(idx, 'actions', e.target.value)}
            />
          </div>
        ))}
        <button onClick={addGoal} className="bg-gray-200 px-3 py-1 mt-4">+ Add Goal</button>
      </section>

      <button onClick={handleSave} className="bg-black text-white py-2 px-4 mt-4">
        Save Business Plan
      </button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </main>
  );
}
