import React, { useState } from 'react';
import { ChevronDown, X, Trophy, Award, TrendingUp, TrendingDown } from 'lucide-react';

export interface Staff {
  id: string;
  name: string;
  tasks?: number;
  inventory?: number;
  taskCompleted: number;
  replenishmentDays: number;
  avgDailySales?: number;
  totalSales?: string;
  status: 'critical' | 'warning' | 'stable' | 'good';
  department?: string;
  position?: string;
  efficiency?: number;
  lastUpdated?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  percentage: number;
  percentageColor: string;
  subtitle: string;
  subtitleValue: string;
  topStaffLabel: string;
  topStaffName: string;
  staffs: Staff[];
  type: 'tasks' | 'inventory';
  branchName?: string;
}

const MetricCard2: React.FC<MetricCardProps> = ({
  title,
  value,
  percentage, 
  percentageColor,
  subtitle,
  subtitleValue,
  topStaffLabel,
  topStaffName,
  staffs,
  type,
  branchName = 'Main Branch'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Sort staff by performance (for ranking)
  const sortedStaff = [...staffs].sort((a, b) => {
    if (type === 'tasks') {
      return b.taskCompleted - a.taskCompleted;
    }
    return (b.avgDailySales || 0) - (a.avgDailySales || 0);
  });

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 2: return 'bg-gray-100 text-gray-700 border-gray-300';
      case 3: return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Trophy className="w-4 h-4 mr-1" />;
    }
    return <TrendingUp className="w-4 h-4 mr-1" />;
  };

  const openStaffDetails = (staff: Staff) => {
    setSelectedStaff(staff);
  };

  return (
    <>
      <div className="bg-[#1e293b] text-white rounded-sm shadow-sm flex flex-col h-full overflow-hidden">
        {/* Header Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{title}</h3>
            <div className="w-24 h-4 bg-gray-700 rounded-full overflow-hidden relative">
              <div 
                className={`h-full ${percentageColor}`} 
                style={{ width: `${percentage}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
                {percentage}% 
              </span>
            </div>
          </div>
          <div className="text-3xl font-light mb-4">{value}</div>
          
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-400">{topStaffLabel}</span>
              <span className="text-[10px] font-bold text-blue-400 uppercase">{topStaffName}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-gray-400">Total of Staff</span>
              <span className="text-[10px] font-bold">{subtitleValue}</span>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white text-gray-800 flex-1 p-2">
          <div className="flex justify-between items-center px-2 py-1 mb-1 border-b border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase">{title} STAFF</span>
          </div>

          <table className="w-full text-[9px]">
            <thead className="text-gray-400 border-b border-gray-50">
              <tr>
                <th className="text-left font-normal py-1">Staff Name</th>
                <th className="text-center font-normal py-1">
                  {type === 'tasks' ? 'Number of Tasks' : 'Avg Daily Sales'}
                </th>
                <th className="text-right font-normal py-1">
                  {type === 'tasks' ? 'Overall (Completed)' : 'Replenishment'}
                </th>
              </tr>
            </thead>
            <tbody>
              {staffs.slice(0, 5).map((p) => (
                <tr 
                  key={p.id} 
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openStaffDetails(p)}
                >
                  <td className="py-2 text-[10px]">{p.name}</td>
                  <td className="py-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-400" 
                          style={{ width: `${(type === 'tasks' ? (p.tasks || 0) / 100 : (p.avgDailySales || 0))}%` }}
                        />
                      </div>
                      <span>{type === 'tasks' ? p.tasks : p.avgDailySales}</span>
                    </div>
                  </td>
                  <td className="py-2 text-right">
                    <span className={`px-2 py-0.5 rounded-sm font-bold ${
                      p.status === 'critical' ? 'bg-red-100 text-red-600' :
                      p.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                      p.status === 'stable' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {type === 'tasks' ? p.taskCompleted : p.replenishmentDays}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 text-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[8px] font-bold text-gray-400 border border-gray-200 px-4 py-1 rounded hover:bg-gray-50 transition-colors"
            >
              View All Staffs
            </button>
          </div>
        </div>
      </div>

      {/* View All Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#1e293b] text-white p-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">All Staff Performance - {branchName}</h2>
                <p className="text-sm text-gray-300">
                  {type === 'tasks' ? 'Task Completion Metrics' : 'Sales & Inventory Metrics'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reward Banner */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200 p-4">
              <div className="flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600 mr-2" />
                <span className="font-bold text-yellow-800 text-lg">
                  Top 5 Staff Members Will Receive Monthly Rewards!
                </span>
              </div>
              <p className="text-center text-sm text-yellow-700 mt-1">
                Rewards include: Performance Bonus, Gift Cards, Extra PTO, and Employee of the Month Recognition
              </p>
            </div>

            {/* Modal Content */}
            <div className="overflow-auto max-h-[calc(90vh-180px)] p-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-xs text-gray-600">Total Staff</p>
                  <p className="text-xl font-bold text-blue-700">{staffs.length}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <p className="text-xs text-gray-600">Average Completion</p>
                  <p className="text-xl font-bold text-green-700">
                    {Math.round(staffs.reduce((acc, s) => acc + s.taskCompleted, 0) / staffs.length)}%
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <p className="text-xs text-gray-600">Best Performer</p>
                  <p className="text-xl font-bold text-purple-700">{topStaffName}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <p className="text-xs text-gray-600">Department Avg.</p>
                  <p className="text-xl font-bold text-orange-700">
                    {type === 'tasks' ? 
                      Math.round(staffs.reduce((acc, s) => acc + (s.tasks || 0), 0) / staffs.length) :
                      Math.round(staffs.reduce((acc, s) => acc + (s.avgDailySales || 0), 0) / staffs.length)
                    }
                  </p>
                </div>
              </div>

              {/* Staff Table */}
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">Rank</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Staff Name</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Department</th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      {type === 'tasks' ? 'Total Tasks' : 'Avg Daily Sales'}
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      {type === 'tasks' ? 'Completed' : 'Replenishment Days'}
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">Efficiency</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Reward Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStaff.map((staff, index) => {
                    const rank = index + 1;
                    const efficiency = staff.efficiency || Math.floor(Math.random() * 30) + 70;
                    
                    return (
                      <tr 
                        key={staff.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer
                          ${rank <= 5 ? 'bg-gradient-to-r from-green-50/50 to-transparent' : ''}
                          ${rank === 1 ? 'border-l-4 border-l-yellow-500' : ''}
                        `}
                        onClick={() => openStaffDetails(staff)}
                      >
                        <td className="p-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${getRankColor(rank)}`}>
                            {getRankIcon(rank)}
                            {rank}
                          </div>
                        </td>
                        <td className="p-3 font-medium">{staff.name}</td>
                        <td className="p-3 text-gray-600">{staff.department || 'General'}</td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <div 
                                className={`h-full ${
                                  rank <= 3 ? 'bg-green-500' : 
                                  rank <= 8 ? 'bg-blue-500' : 
                                  'bg-gray-400'
                                }`}
                                style={{ 
                                  width: `${type === 'tasks' ? 
                                    (staff.tasks || 0) / 100 * 100 :
                                    (staff.avgDailySales || 0) / 200 * 100
                                  }%` 
                                }}
                              />
                            </div>
                            <span>{type === 'tasks' ? staff.tasks : staff.avgDailySales}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full font-medium ${
                            staff.status === 'critical' ? 'bg-red-100 text-red-800' :
                            staff.status === 'warning' ? 'bg-orange-100 text-orange-800' :
                            staff.status === 'stable' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {type === 'tasks' ? `${staff.taskCompleted}%` : `${staff.replenishmentDays} days`}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <div 
                                className={`h-full ${
                                  efficiency >= 90 ? 'bg-green-500' :
                                  efficiency >= 80 ? 'bg-blue-500' :
                                  efficiency >= 70 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${efficiency}%` }}
                              />
                            </div>
                            <span>{efficiency}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              staff.status === 'critical' ? 'bg-red-500' :
                              staff.status === 'warning' ? 'bg-orange-500' :
                              staff.status === 'stable' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`} />
                            <span className="capitalize">{staff.status}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {rank === 1 && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold">
                              GOLD
                            </span>
                          )}
                          {rank === 2 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-bold">
                              SILVER
                            </span>
                          )}
                          {rank === 3 && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-bold">
                              BRONZE
                            </span>
                          )}
                          {rank > 3 && rank <= 5 && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                              Top 5
                            </span>
                          )}
                          {rank > 5 && (
                            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full">
                              Standard
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Legend */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-2">Reward Tiers Legend:</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                    <span className="text-sm">Gold (1st) - 500 Bonus</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                    <span className="text-sm">Silver (2nd) - 300 Bonus</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded mr-2"></div>
                    <span className="text-sm">Bronze (3rd) - 200 Bonus</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                    <span className="text-sm">Top 5 (4th-5th) - 100 Bonus</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {/* Add export functionality */}}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold">Staff Details</h3>
              <button 
                onClick={() => setSelectedStaff(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600 mr-4">
                  {selectedStaff.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{selectedStaff.name}</h4>
                  <p className="text-gray-600">{selectedStaff.department || 'General Department'}</p>
                  <p className="text-sm text-gray-500">{selectedStaff.position || 'Staff Member'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Tasks Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedStaff.taskCompleted}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    {type === 'tasks' ? 'Total Tasks' : 'Avg Daily Sales'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {type === 'tasks' ? selectedStaff.tasks : selectedStaff.avgDailySales}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Efficiency</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedStaff.efficiency || Math.floor(Math.random() * 30) + 70}%
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Status</p>
                  <p className={`text-2xl font-bold capitalize ${
                    selectedStaff.status === 'critical' ? 'text-red-600' :
                    selectedStaff.status === 'warning' ? 'text-orange-600' :
                    selectedStaff.status === 'stable' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {selectedStaff.status}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="font-semibold mb-2">Performance Trend</h5>
                <div className="h-32 bg-gray-100 rounded-lg flex items-end p-2">
                  {/* Simplified chart bars */}
                  {[65, 75, 80, 85, 90, selectedStaff.taskCompleted].map((value, index) => (
                    <div key={index} className="flex-1 mx-1">
                      <div 
                        className={`bg-blue-500 rounded-t ${
                          index === 5 ? 'bg-green-500' : ''
                        }`}
                        style={{ height: `${value}%` }}
                      />
                      <div className="text-xs text-center mt-1 text-gray-600">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Current'][index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setSelectedStaff(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MetricCard2;