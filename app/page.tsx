
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { X, Plus, Edit2, Save, Eye, Calendar, Users, Target, CheckCircle, Clock, AlertCircle, FileDown, Trash2, StickyNote } from 'lucide-react'
import { MultiSelect } from '@/components/multi-select'

type MeasureType = {
  text: string
  dueDate?: string
  assignee?: string
  archived: boolean
}

type ActionType = {
  text: string
  dueDate?: string
  assignee?: string
  archived: boolean
  status: 'Not Started' | 'In Progress' | 'Done' | 'Blocked'
  notes: string
}

type Goal = {
  title: string
  description: string
  owner: string
  measures: MeasureType[]
  strategies: string[]
  actions: ActionType[]
}

type PlanData = {
  logoUrl: string
  vision: string
  mission: string
  goals: Goal[]
  teamMembers: string[]
  lastUpdated: string
}

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'you@example.com'

export default function BusinessPlan() {
  const [planData, setPlanData] = useState<PlanData>({
    logoUrl: "",
    vision: "",
    mission: "",
    goals: [],
    teamMembers: [],
    lastUpdated: ""
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [showWeeklyReport, setShowWeeklyReport] = useState(false)
  const [activeNoteModal, setActiveNoteModal] = useState<{type: 'action', goalIndex: number, itemIndex: number} | null>(null)

  const isAdmin = userEmail === ADMIN_EMAIL

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail')
    if (storedEmail) {
      setUserEmail(storedEmail)
    }
    loadPlanData()
  }, [])

  const loadPlanData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/plan')
      if (response.ok) {
        const data = await response.json()
        setPlanData(data)
      } else {
        console.error('Failed to load plan data')
      }
    } catch (error) {
      console.error('Error loading plan data:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePlanData = async () => {
    try {
      const dataToSave = {
        ...planData,
        lastUpdated: new Date().toISOString()
      }
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      })
      if (response.ok) {
        setPlanData(dataToSave)
        setStatus('✅ Plan saved successfully')
        setTimeout(() => setStatus(''), 3000)
      } else {
        setStatus('❌ Failed to save plan')
        setTimeout(() => setStatus(''), 3000)
      }
    } catch (error) {
      console.error('Error saving plan data:', error)
      setStatus('❌ Error saving plan')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('userEmail', userEmail)
  }

  const addGoal = () => {
    const newGoal: Goal = {
      title: "New Goal",
      description: "",
      owner: "",
      measures: [],
      strategies: [],
      actions: []
    }
    setPlanData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }))
  }

  const updateGoal = (index: number, field: keyof Goal, value: any) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === index ? { ...goal, [field]: value } : goal
      )
    }))
  }

  const deleteGoal = (index: number) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }))
  }

  const addMeasure = (goalIndex: number) => {
    const newMeasure: MeasureType = {
      text: "",
      archived: false
    }
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex 
          ? { ...goal, measures: [...goal.measures, newMeasure] }
          : goal
      )
    }))
  }

  const updateMeasure = (goalIndex: number, measureIndex: number, field: keyof MeasureType, value: any) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex 
          ? {
              ...goal,
              measures: goal.measures.map((measure, j) => 
                j === measureIndex ? { ...measure, [field]: value } : measure
              )
            }
          : goal
      )
    }))
  }

  const deleteMeasure = (goalIndex: number, measureIndex: number) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex 
          ? { ...goal, measures: goal.measures.filter((_, j) => j !== measureIndex) }
          : goal
      )
    }))
  }

  const addStrategy = (goalIndex: number) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex 
          ? { ...goal, strategies: [...goal.strategies, ""] }
          : goal
      )
    }))
  }

  const updateStrategy = (goalIndex: number, strategyIndex: number, value: string) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex 
          ? {
              ...goal,
              strategies: goal.strategies.map((strategy, j) => 
                j === strategyIndex ? value : strategy
              )
            }
          : goal
      )
    }))
  }

  const deleteStrategy = (goalIndex: number, strategyIndex: number) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex 
          ? { ...goal, strategies: goal.strategies.filter((_, j) => j !== strategyIndex) }
          : goal
      )
    }))
  }

  const addAction = (goalIndex: number) => {
    const newAction: ActionType = {
      text: "",
      archived: false,
      status: 'Not Started',
      notes: ''
    }
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex 
          ? { ...goal, actions: [...goal.actions, newAction] }
          : goal
      )
    }))
  }

  const updateAction = (goalIndex: number, actionIndex: number, field: keyof ActionType, value: any) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex 
          ? {
              ...goal,
              actions: goal.actions.map((action, j) => 
                j === actionIndex ? { ...action, [field]: value } : action
              )
            }
          : goal
      )
    }))
  }

  const deleteAction = (goalIndex: number, actionIndex: number) => {
    setPlanData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === goalIndex 
          ? { ...goal, actions: goal.actions.filter((_, j) => j !== actionIndex) }
          : goal
      )
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Blocked': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const isDueThisWeek = (dueDate?: string) => {
    if (!dueDate) return false
    const due = new Date(dueDate)
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return due >= now && due <= weekFromNow
  }

  const getItemIcon = (item: MeasureType | ActionType) => {
    if (item.archived) return '✅'
    if (isOverdue(item.dueDate)) return '⚠️'
    if (isDueThisWeek(item.dueDate)) return '⏳'
    return '📋'
  }

  // Filter functions
  const getActiveItems = (items: (MeasureType | ActionType)[]) => 
    items.filter(item => !item.archived)
  
  const getArchivedItems = (items: (MeasureType | ActionType)[]) => 
    items.filter(item => item.archived)

  const exportToCSV = () => {
    const csvContent = [
      'Goal Title,Goal Description,Goal Owner,Measure,Measure Due Date,Measure Assignee,Strategy,Action,Action Due Date,Action Assignee,Action Status,Action Notes',
      ...planData.goals.flatMap(goal => {
        const rows = []
        const maxItems = Math.max(goal.measures.length, goal.strategies.length, goal.actions.length, 1)
        
        for (let i = 0; i < maxItems; i++) {
          const measure = goal.measures[i]
          const strategy = goal.strategies[i] || ''
          const action = goal.actions[i]
          
          rows.push([
            i === 0 ? goal.title : '',
            i === 0 ? goal.description : '',
            i === 0 ? goal.owner : '',
            measure ? measure.text : '',
            measure ? measure.dueDate || '' : '',
            measure ? measure.assignee || '' : '',
            strategy,
            action ? action.text : '',
            action ? action.dueDate || '' : '',
            action ? action.assignee || '' : '',
            action ? action.status : '',
            action ? action.notes : ''
          ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        }
        return rows
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'business-plan.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const csv = e.target?.result as string
      const lines = csv.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      
      const newGoals: Goal[] = []
      let currentGoal: Goal | null = null

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
        const goalTitle = values[0]
        
        if (goalTitle && goalTitle !== currentGoal?.title) {
          if (currentGoal) newGoals.push(currentGoal)
          currentGoal = {
            title: goalTitle,
            description: values[1] || '',
            owner: values[2] || '',
            measures: [],
            strategies: [],
            actions: []
          }
        }

        if (currentGoal) {
          if (values[3]) {
            currentGoal.measures.push({
              text: values[3],
              dueDate: values[4] || undefined,
              assignee: values[5] || undefined,
              archived: false
            })
          }
          
          if (values[6]) {
            currentGoal.strategies.push(values[6])
          }
          
          if (values[7]) {
            currentGoal.actions.push({
              text: values[7],
              dueDate: values[8] || undefined,
              assignee: values[9] || undefined,
              archived: false,
              status: (values[10] as ActionType['status']) || 'Not Started',
              notes: values[11] || ''
            })
          }
        }
      }

      if (currentGoal) {
        newGoals.push(currentGoal)
      }

      if (newGoals.length > 0) {
        setPlanData(prev => ({ 
          ...prev, 
          goals: newGoals,
        }))
        setStatus(`✅ Replaced entire plan with ${newGoals.length} goals from CSV`)
        setTimeout(() => setStatus(''), 3000)
      } else {
        setStatus('No valid goals found in CSV')
        setTimeout(() => setStatus(''), 3000)
      }
    }
    reader.readAsText(file)
  }

  const generateWeeklyReport = () => {
    const report = {
      weekOf: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      summary: {
        totalGoals: planData.goals.length,
        totalActions: planData.goals.reduce((sum, goal) => sum + goal.actions.length, 0),
        completedActions: planData.goals.reduce((sum, goal) => 
          sum + goal.actions.filter(action => action.status === 'Done').length, 0
        ),
        blockedActions: planData.goals.reduce((sum, goal) => 
          sum + goal.actions.filter(action => action.status === 'Blocked').length, 0
        ),
        inProgressActions: planData.goals.reduce((sum, goal) => 
          sum + goal.actions.filter(action => action.status === 'In Progress').length, 0
        )
      },
      goalDetails: planData.goals.map(goal => ({
        title: goal.title,
        owner: goal.owner,
        actions: goal.actions.map(action => ({
          text: action.text,
          status: action.status,
          notes: action.notes,
          dueDate: action.dueDate,
          assignee: action.assignee,
          isOverdue: isOverdue(action.dueDate),
          isDueThisWeek: isDueThisWeek(action.dueDate)
        }))
      }))
    }

    return report
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Target className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Frontier Business Plan</h1>
              <p className="text-gray-600 mt-2">Enter your email to access the plan</p>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Access Plan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business plan...</p>
        </div>
      </div>
    )
  }

  const weeklyReport = generateWeeklyReport()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {planData.logoUrl ? (
                <img src={planData.logoUrl} alt="Company Logo" className="h-10 w-10 object-contain" />
              ) : (
                <Target className="h-10 w-10 text-blue-600" />
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Frontier Business Plan
                </h1>
                <p className="text-sm text-gray-500">
                  {userEmail} {isAdmin && '(Admin)'}
                </p>
              </div>
            </div>

            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center space-x-2">
              {planData.lastUpdated && (
                <span className="text-sm text-gray-500">
                  Updated: {new Date(planData.lastUpdated).toLocaleDateString()}
                </span>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWeeklyReport(true)}
              >
                📊 Weekly Report
              </Button>

              <Button
                variant="outline"  
                size="sm"
                onClick={exportToCSV}
              >
                <FileDown className="h-4 w-4 mr-1" />
                Export CSV
              </Button>

              {isAdmin && (
                <label className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer text-sm">
                  📄 Replace with CSV
                  <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                </label>
              )}

              {isAdmin && (
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (isEditing) {
                      savePlanData()
                    }
                    setIsEditing(!isEditing)
                  }}
                >
                  {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit2 className="h-4 w-4 mr-1" />}
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="sm:hidden pb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWeeklyReport(true)}
                className="text-xs"
              >
                📊 Report
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="text-xs"
              >
                <FileDown className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>

            <div className="border-t pt-3 sm:pt-4 flex flex-wrap gap-1 sm:gap-2">
              {isAdmin && (
                <label className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                  📄 Replace with CSV
                  <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                </label>
              )}

              {isAdmin && (
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (isEditing) {
                      savePlanData()
                    }
                    setIsEditing(!isEditing)
                  }}
                  className="text-sm"
                >
                  {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit2 className="h-4 w-4 mr-1" />}
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              )}
            </div>

            {planData.lastUpdated && (
              <p className="text-xs text-gray-500 mt-2">
                Updated: {new Date(planData.lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>

          {status && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">{status}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Vision & Mission */}
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Vision
                </h2>
                {isEditing ? (
                  <Textarea
                    value={planData.vision}
                    onChange={(e) => setPlanData(prev => ({ ...prev, vision: e.target.value }))}
                    placeholder="Our vision statement..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap min-h-[100px] p-3 bg-gray-50 rounded-lg">
                    {planData.vision || "No vision statement yet"}
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Mission
                </h2>
                {isEditing ? (
                  <Textarea
                    value={planData.mission}
                    onChange={(e) => setPlanData(prev => ({ ...prev, mission: e.target.value }))}
                    placeholder="Our mission statement..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap min-h-[100px] p-3 bg-gray-50 rounded-lg">
                    {planData.mission || "No mission statement yet"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Strategic Goals</h2>
            {isEditing && (
              <Button onClick={addGoal} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </Button>
            )}
          </div>

          {planData.goals.map((goal, goalIndex) => (
            <Card key={goalIndex} className="relative">
              <CardContent className="p-6">
                {isEditing && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this goal and all related items? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteGoal(goalIndex)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Goal
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                <div className="space-y-6">
                  {/* Goal Title */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Goal Title</h3>
                    {isEditing ? (
                      <Input
                        value={goal.title}
                        onChange={(e) => updateGoal(goalIndex, 'title', e.target.value)}
                        placeholder="Goal title"
                        className="text-lg font-semibold"
                      />
                    ) : (
                      <h3 className="text-xl font-bold text-blue-900">{goal.title}</h3>
                    )}
                  </div>

                  {/* Goal Owner */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Goal Owner
                    </h4>
                    {isEditing ? (
                      <MultiSelect
                        options={planData.teamMembers}
                        selected={goal.owner ? [goal.owner] : []}
                        onChange={(selected) => updateGoal(goalIndex, 'owner', selected[0] || '')}
                        placeholder="Select goal owner"
                        maxSelections={1}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {goal.owner ? (
                          <Badge variant="secondary">👤 {goal.owner}</Badge>
                        ) : (
                          <span className="text-gray-500 italic">No owner assigned</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Measures */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Measures ({getActiveItems(goal.measures).length} active, {getArchivedItems(goal.measures).length} completed)
                      </h4>
                      {isEditing && (
                        <Button variant="outline" size="sm" onClick={() => addMeasure(goalIndex)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Measure
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {getActiveItems(goal.measures).map((measure, measureIndex) => {
                        const actualIndex = goal.measures.findIndex(m => m === measure)
                        return (
                          <div key={actualIndex} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <span className="text-lg mt-0.5">{getItemIcon(measure)}</span>
                            <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <div className="space-y-2">
                                  <Input
                                    value={measure.text}
                                    onChange={(e) => updateMeasure(goalIndex, actualIndex, 'text', e.target.value)}
                                    placeholder="Measure description"
                                  />
                                  <div className="flex flex-wrap gap-2">
                                    <Input
                                      type="date"
                                      value={measure.dueDate || ''}
                                      onChange={(e) => updateMeasure(goalIndex, actualIndex, 'dueDate', e.target.value || undefined)}
                                      className="w-auto"
                                    />
                                    <MultiSelect
                                      options={planData.teamMembers}
                                      selected={measure.assignee ? [measure.assignee] : []}
                                      onChange={(selected) => updateMeasure(goalIndex, actualIndex, 'assignee', selected[0] || undefined)}
                                      placeholder="Assign to"
                                      maxSelections={1}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-gray-900">{measure.text}</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {measure.dueDate && (
                                      <Badge variant="outline" className="text-xs">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(measure.dueDate).toLocaleDateString()}
                                      </Badge>
                                    )}
                                    {measure.assignee && (
                                      <Badge variant="outline" className="text-xs">
                                        👤 {measure.assignee}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            {isEditing && (
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateMeasure(goalIndex, actualIndex, 'archived', true)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  ✓
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteMeasure(goalIndex, actualIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {getArchivedItems(goal.measures).length > 0 && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                            Completed Measures ({getArchivedItems(goal.measures).length})
                          </summary>
                          <div className="mt-2 space-y-2">
                            {getArchivedItems(goal.measures).map((measure, measureIndex) => {
                              const actualIndex = goal.measures.findIndex(m => m === measure)
                              return (
                                <div key={actualIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg opacity-75">
                                  <span className="text-lg mt-0.5">✅</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-700 line-through">{measure.text}</p>
                                  </div>
                                  {isEditing && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateMeasure(goalIndex, actualIndex, 'archived', false)}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      Restore
                                    </Button>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </details>
                      )}

                      {goal.measures.length === 0 && (
                        <p className="text-gray-500 italic text-center py-4">No measures defined yet</p>
                      )}
                    </div>
                  </div>

                  {/* Strategies */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-purple-600" />
                        Strategies ({goal.strategies.length})
                      </h4>
                      {isEditing && (
                        <Button variant="outline" size="sm" onClick={() => addStrategy(goalIndex)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Strategy
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {goal.strategies.map((strategy, strategyIndex) => (
                        <div key={strategyIndex} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <span className="text-lg mt-0.5">🎯</span>
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <Input
                                value={strategy}
                                onChange={(e) => updateStrategy(goalIndex, strategyIndex, e.target.value)}
                                placeholder="Strategy description"
                              />
                            ) : (
                              <p className="text-gray-900">{strategy}</p>
                            )}
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteStrategy(goalIndex, strategyIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      {goal.strategies.length === 0 && (
                        <p className="text-gray-500 italic text-center py-4">No strategies defined yet</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-orange-600" />
                        Actions ({getActiveItems(goal.actions).length} active, {getArchivedItems(goal.actions).length} completed)
                      </h4>
                      {isEditing && (
                        <Button variant="outline" size="sm" onClick={() => addAction(goalIndex)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Action
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {getActiveItems(goal.actions).map((action, actionIndex) => {
                        const actualIndex = goal.actions.findIndex(a => a === action)
                        return (
                          <div key={actualIndex} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                            <span className="text-lg mt-0.5">{getItemIcon(action)}</span>
                            <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <div className="space-y-2">
                                  <Input
                                    value={action.text}
                                    onChange={(e) => updateAction(goalIndex, actualIndex, 'text', e.target.value)}
                                    placeholder="Action description"
                                  />
                                  <div className="flex flex-wrap gap-2">
                                    <Input
                                      type="date"
                                      value={action.dueDate || ''}
                                      onChange={(e) => updateAction(goalIndex, actualIndex, 'dueDate', e.target.value || undefined)}
                                      className="w-auto"
                                    />
                                    <MultiSelect
                                      options={planData.teamMembers}
                                      selected={action.assignee ? [action.assignee] : []}
                                      onChange={(selected) => updateAction(goalIndex, actualIndex, 'assignee', selected[0] || undefined)}
                                      placeholder="Assign to"
                                      maxSelections={1}
                                    />
                                    <Select
                                      value={action.status}
                                      onValueChange={(value) => updateAction(goalIndex, actualIndex, 'status', value as ActionType['status'])}
                                    >
                                      <SelectTrigger className="w-auto">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Not Started">Not Started</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Done">Done</SelectItem>
                                        <SelectItem value="Blocked">Blocked</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Textarea
                                    value={action.notes}
                                    onChange={(e) => updateAction(goalIndex, actualIndex, 'notes', e.target.value)}
                                    placeholder="Notes (optional)"
                                    className="min-h-[80px]"
                                  />
                                </div>
                              ) : (
                                <div>
                                  <p className="text-gray-900">{action.text}</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge className={getStatusColor(action.status)}>
                                      {action.status}
                                    </Badge>
                                    {action.dueDate && (
                                      <Badge variant="outline" className="text-xs">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(action.dueDate).toLocaleDateString()}
                                      </Badge>
                                    )}
                                    {action.assignee && (
                                      <Badge variant="outline" className="text-xs">
                                        👤 {action.assignee}
                                      </Badge>
                                    )}
                                    {action.notes && (
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
                                            <StickyNote className="h-3 w-3 mr-1" />
                                            View Note
                                          </Badge>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Action Notes</DialogTitle>
                                          </DialogHeader>
                                          <div className="mt-2">
                                            <p className="text-sm text-gray-600 mb-2">Action: {action.text}</p>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                              <p className="whitespace-pre-wrap">{action.notes}</p>
                                            </div>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            {isEditing && (
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateAction(goalIndex, actualIndex, 'archived', true)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  ✓
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteAction(goalIndex, actualIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {getArchivedItems(goal.actions).length > 0 && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                            Completed Actions ({getArchivedItems(goal.actions).length})
                          </summary>
                          <div className="mt-2 space-y-2">
                            {getArchivedItems(goal.actions).map((action, actionIndex) => {
                              const actualIndex = goal.actions.findIndex(a => a === action)
                              return (
                                <div key={actualIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg opacity-75">
                                  <span className="text-lg mt-0.5">✅</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-700 line-through">{action.text}</p>
                                    {action.notes && (
                                      <div className="mt-1">
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
                                              <StickyNote className="h-3 w-3 mr-1" />
                                              View Note
                                            </Badge>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Action Notes</DialogTitle>
                                            </DialogHeader>
                                            <div className="mt-2">
                                              <p className="text-sm text-gray-600 mb-2">Action: {action.text}</p>
                                              <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="whitespace-pre-wrap">{action.notes}</p>
                                              </div>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    )}
                                  </div>
                                  {isEditing && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateAction(goalIndex, actualIndex, 'archived', false)}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      Restore
                                    </Button>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </details>
                      )}

                      {goal.actions.length === 0 && (
                        <p className="text-gray-500 italic text-center py-4">No actions defined yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {planData.goals.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Yet</h3>
                <p className="text-gray-600 mb-4">Start building your strategic plan by adding your first goal.</p>
                {isEditing && (
                  <Button onClick={addGoal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Goal
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Team Members Management */}
        {isEditing && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Team Members
              </h3>
              <MultiSelect
                options={[]}
                selected={planData.teamMembers}
                onChange={(members) => setPlanData(prev => ({ ...prev, teamMembers: members }))}
                placeholder="Add team members..."
                allowCustom={true}
              />
              <p className="text-sm text-gray-600 mt-2">
                Add team members here to assign them to goals, measures, and actions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Weekly Report Modal */}
      <Dialog open={showWeeklyReport} onOpenChange={setShowWeeklyReport}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              📊 Weekly Progress Report - {weeklyReport.weekOf}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{weeklyReport.summary.totalGoals}</div>
                  <div className="text-sm text-gray-600">Total Goals</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{weeklyReport.summary.completedActions}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{weeklyReport.summary.inProgressActions}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{weeklyReport.summary.blockedActions}</div>
                  <div className="text-sm text-gray-600">Blocked</div>
                </CardContent>
              </Card>
            </div>

            {/* Goal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Action Details by Goal</h3>
              {weeklyReport.goalDetails.map((goal, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                      {goal.owner && <Badge variant="secondary">👤 {goal.owner}</Badge>}
                    </div>
                    
                    {goal.actions.length > 0 ? (
                      <div className="space-y-2">
                        {goal.actions.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                            <Badge className={getStatusColor(action.status)} variant="outline">
                              {action.status}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm">{action.text}</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {action.isOverdue && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Overdue
                                  </Badge>
                                )}
                                {action.isDueThisWeek && !action.isOverdue && (
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Due This Week
                                  </Badge>
                                )}
                                {action.assignee && (
                                  <Badge variant="outline" className="text-xs">
                                    👤 {action.assignee}
                                  </Badge>
                                )}
                              </div>
                              {action.notes && (
                                <div className="mt-1 p-2 bg-white rounded text-xs">
                                  <strong>Notes:</strong> {action.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No actions defined for this goal</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
