import React from 'react';
import { Cpu, Database, LayoutDashboard, Layers } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'unified', label: 'Unified View', icon: Layers },
    { id: 'pipeline', label: 'CPU Pipeline', icon: Cpu },
    { id: 'cache', label: 'Cache Memory', icon: Database },
    { id: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="header-container">
      <div className="header-brand">
        <div className="brand-logo">
          <Cpu className="brand-icon" />
        </div>
        <div>
          <h1 className="brand-title">CPU & Cache Memory Simulator</h1>
          {/* Subtitle "Computer Architecture Capstone Project" removed per user request */}
        </div>
      </div>

      <nav className="header-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="nav-icon" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
